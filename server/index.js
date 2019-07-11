const hapi = require('hapi')
const moment = require('moment-timezone')
const config = require('./config')
const { dateFormat, longDateFormat } = require('./constants')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(require('inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  server.ext('onPostHandler', (request, h) => {
    const response = request.response
    if (response.variety === 'view') {
      const ctx = response.source.context || {}
      const meta = ctx.meta || {}

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

  return server
}

module.exports = createServer
