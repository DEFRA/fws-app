import hapi from '@hapi/hapi'
import CatboxRedis from '@hapi/catbox-redis'
import bell from '@hapi/bell'
import cookie from '@hapi/cookie'
import inert from '@hapi/inert'
import blipp from 'blipp'
import moment from 'moment-timezone'
import config from './config.js'
import { createRequire } from 'node:module'
import registerServerMethods from './services/methods.js'
import { dateFormat, longDateFormat } from './constants.js'
import views from './plugins/views.js'
import router from './plugins/router.js'
import errorPages from './plugins/error-pages.js'
import logging from './plugins/logging.js'

// standard's parser does not support JSON import attributes yet
const pkg = createRequire(import.meta.url)('../package.json')
let cache

if (!config.localCache) {
  cache = [{
    name: 'redis_cache',
    provider: {
      constructor: CatboxRedis.Engine,
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
    cache
  })

  // Register the auth plugins
  await server.register(bell)
  await server.register(cookie)

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
  await server.register(inert)
  await server.register(views)
  await server.register(router)
  await server.register(errorPages)
  await server.register(logging)
  await server.register(blipp)

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
      meta.version = pkg.version
      meta.stage = config.env

      ctx.meta = meta
      response.source.context = ctx
    }
    return h.continue
  })

  registerServerMethods(server)

  return server
}

export default createServer
