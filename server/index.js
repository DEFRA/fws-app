const hapi = require('@hapi/hapi')
const CatboxRedis = require('@hapi/catbox-redis')
const moment = require('moment-timezone')
const config = require('./config')
const { version } = require('../package.json')
const registerServerMethods = require('./services/methods')
const { dateFormat, longDateFormat } = require('./constants')
let cache

if (!config.localCache) {
  cache = [{
    name: 'redis_cache',
    provider: {
      constructor: CatboxRedis,
      options: {
        host: config.redisHost,
        port: config.redisPort,
        tls: config.redisTls ? { checkServerIdentity: () => undefined } : undefined
      }
    }
  }]
}

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      auth: {
        mode: 'try'
      },
      validate: {
        options: {
          abortEarly: false
        }
      },
      cors: true,
      security: true
    },
    cache: cache
  })

  // Register the auth plugins
  await server.register(require('@hapi/bell'))
  await server.register(require('@hapi/cookie'))

  // Setup the authentication strategies
  server.auth.strategy('azure-legacy', 'bell', {
    provider: 'azure-legacy',
    password: config.cookiePassword,
    clientId: config.adClientId,
    clientSecret: config.adClientSecret,
    isSecure: config.isSecure,
    forceHttps: config.forceHttps,
    config: {
      tenant: config.adTenant
    }
  })

  server.auth.strategy('session', 'cookie', {
    cookie: {
      path: '/',
      password: config.cookiePassword,
      isSecure: config.isSecure
    }
  })

  server.auth.default('session')

  // Register the remaining plugins
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/logging'))
  await server.register(require('blipp'))

  server.ext('onPreResponse', (request, h) => {
    const response = request.response
    if (response.variety === 'view') {
      const ctx = response.source.context || {}
      const meta = ctx.meta || {}

      // Set the auth object
      // onto the top level context
      ctx.auth = request.auth

      // Set some common context
      // variables under the `meta` namespace
      meta.url = request.url.href
      meta.redirectTo = encodeURIComponent(request.path + (request.url.search ? request.url.search : ''))
      meta.timestamp = new Date()
      meta.dateString = moment.tz('Europe/London').format(dateFormat)
      meta.longDateString = moment.tz('Europe/London').format(longDateFormat)
      meta.version = version
      meta.stage = config.env

      ctx.meta = meta
      response.source.context = ctx
    }
    return h.continue
  })

  registerServerMethods(server)

  return server
}

module.exports = createServer
