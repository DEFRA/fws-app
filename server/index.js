const hapi = require('hapi')
// const schedule = require('node-schedule')
const config = require('./config')
// const ws = require('./services/web-socket')

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
  // await server.register(require('./plugins/socket'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  // Initialise websocket connection
  // ws.init(server)

  // // Publish warning data every minute
  // schedule.scheduleJob('* * * * *', () => {
  //   console.log('Schedule warnings')
  //   // ws.publishWarnings(server)
  // })

  return server
}

module.exports = createServer
