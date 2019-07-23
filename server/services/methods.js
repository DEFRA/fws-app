const {
  getFloods,
  getAllAreas,
  getHistoricFloods,
  updateWarning
} = require('.')

function registerServerMethods (server) {
  server.method('flood.getFloods', getFloods, {
    cache: {
      expiresIn: 2 * 60 * 1000, // 2 mins
      generateTimeout: 6 * 1000 // 10 secs
    }
  })

  server.method('flood.getHistoricFloods', getHistoricFloods, {
    cache: {
      expiresIn: 10 * 60 * 1000, // 10 mins
      generateTimeout: 10 * 1000 // 10 secs
    }
  })

  server.method('flood.getAllAreas', getAllAreas, {
    cache: {
      expiresAt: '17:00', // 5pm local time
      generateTimeout: 10 * 1000 // 10 seconds
    }
  })

  server.method('flood.updateWarning', updateWarning)
}

module.exports = registerServerMethods
