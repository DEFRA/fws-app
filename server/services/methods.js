const services = require('.')
const config = require('../config')

// Note that generate timeouts are set as 30 seconds as the backend is served by lambda which can take a while to warm up if not already warm

function registerServerMethods (server) {
  server.method('flood.getFloods', services.getFloods, {
    cache: {
      cache: config.localCache ? '' : 'redis_cache',
      expiresIn: 1 * 60 * 1000, // 1 minute
      generateTimeout: 30 * 1000 // 30 secs
    }
  })

  server.method('flood.getFloodsPlus', services.getFloodsPlus, {
    cache: {
      cache: config.localCache ? '' : 'redis_cache',
      expiresIn: 1 * 60 * 1000, // 1 minute
      generateTimeout: 30 * 1000 // 30 secs
    }
  })

  server.method('flood.getHistoricFloods', services.getHistoricFloods, {
    cache: {
      cache: config.localCache ? '' : 'redis_cache',
      expiresIn: 10 * 60 * 1000, // 10 mins
      generateTimeout: 30 * 1000 // 30 secs
    }
  })

  server.method('flood.getAllAreas', services.getAllAreas, {
    cache: {
      cache: config.localCache ? '' : 'redis_cache',
      expiresIn: 60 * 60 * 1000, // 1 hour
      generateTimeout: 30 * 1000 // 30 seconds
    }
  })

  server.method('flood.updateWarning', services.updateWarning)
}

module.exports = registerServerMethods
