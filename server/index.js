const hapi = require('hapi')
const config = require('./config')
const Fwis = require('./models/fwis')
const fwisService = require('./services/fwis')

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
  await server.register(require('./plugins/socket'))

  server.subscription('/summary')

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  function broadcastSummary () {
    setInterval(async () => {
      console.log('Broadcasting new data')
      const fwis = new Fwis(await fwisService.get())
      server.publish('/summary', {
        params: fwis.getSummaryTable(),
        updateTime: new Date().toISOString()
      })
    }, 60000)
  }
  broadcastSummary()

  return server
}

module.exports = createServer
