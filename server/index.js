const hapi = require('hapi')
const config = require('./config')
const areas = require('./models/areas')

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

  server.route({
    method: 'GET',
    path: '/h',
    config: {
      id: 'hello',
      handler: (request, h) => {
        return new Date().toISOString()
      }
    }
  })

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  function broadcastTime () {
    setInterval(async () => {
      // console.log('Broadcasting new data')
      // const table = await server.render('partial/table', {
      //   title: 'Flood warnings management tool',
      //   summaryTable: areas.summaryTable,
      //   updateTime: new Date().toISOString()
      // })
      // console.log(table)
      server.broadcast({
        title: 'Summary',
        params: areas.summaryTable,
        updateTime: new Date().toISOString()
      })
    }, 1000)
  }
  broadcastTime()

  return server
}

module.exports = createServer
