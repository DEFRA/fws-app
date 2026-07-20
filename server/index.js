const crypto = require('node:crypto')
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

  server.ext('onPreResponse', async (request, h) => {
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
      meta.version = version
      meta.stage = config.env

      // For unauthenticated requests, use Redis to store the destination to redirect to
      // after logging in. Store the destination using an opaque UUID based token and
      // deliver the token via a short lived HttpOnly cookie.
      // As the destination does not appear in URLs or page source the attack surface from
      // destination manipulation is reduced. The token is short lived and single use, further
      // reducing the attack surface. SameSite=Lax is required (not/ Strict) so the cookie is
      //  sent on the cross-site Azure AD callback redirect.
      if (!request.auth.isAuthenticated) {
        const token = crypto.randomUUID()
        const redirectPath = request.path + (request.url.search || '')
        await server.app.redirectCache.set(token, redirectPath, config.redirectTokenTtlMs)
        h.state('redirectToken', token, {
          path: '/',
          isSecure: config.isSecure,
          isHttpOnly: true,
          isSameSite: 'Lax',
          ttl: config.redirectTokenTtlMs
        })
      }

      ctx.meta = meta
      response.source.context = ctx
    }
    return h.continue
  })

  // Catbox cache policy for redirect tokens. Uses the shared Redis cache in
  // deployed environments and falls back to Hapi's in-memory cache locally.
  const redirectCache = server.cache({
    cache: config.localCache ? undefined : 'redis_cache',
    segment: 'redirect-tokens',
    expiresIn: config.redirectTokenTtlMs
  })
  server.app.redirectCache = redirectCache

  registerServerMethods(server)

  return server
}

module.exports = createServer
