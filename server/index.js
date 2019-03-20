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

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  function broadcastTime () {
    setInterval(async () => {
      console.log('Broadcasting new data')
      const fwis = new Fwis(await fwisService.get())
      server.broadcast({
        params: fwis.getSummaryTable(),
        updateTime: new Date().toISOString()
      })
    }, 10000)
  }
  broadcastTime()

  return server
}

module.exports = createServer
