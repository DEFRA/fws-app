const hapi = require('@hapi/hapi')
const CatboxObject = require('@hapi/catbox-object')
const moment = require('moment-timezone')
const config = require('./config')
const registerServerMethods = require('./services/methods')
const { dateFormat, longDateFormat } = require('./constants')

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
      }
    },
    cache: [
      {
        name: 'object_cache',
        provider: {
          constructor: CatboxObject
        }
      }
    ]
  })

  // Register the auth plugins
  await server.register(require('@hapi/bell'))
  await server.register(require('@hapi/cookie'))

  // Setup the authentication strategies
  server.auth.strategy('azuread', 'bell', {
    provider: 'azuread',
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

  // if (config.isDev) {
  await server.register(require('blipp'))
  await server.register(require('./plugins/logging'))
  // }

  server.ext('onPostHandler', (request, h) => {
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
      meta.timestamp = new Date()
      meta.dateString = moment.tz('Europe/London').format(dateFormat)
      meta.longDateString = moment.tz('Europe/London').format(longDateFormat)

      ctx.meta = meta
      response.source.context = ctx
    }
    return h.continue
  })

  registerServerMethods(server)

  return server
}

module.exports = createServer
