const areas = require('../models/areas')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: (request, h) => {
      return h.view('home', {
        title: 'Flood warnings management tool',
        summaryTable: areas.summaryTable,
        updateTime: new Date().toISOString()
      })
    }
  }
}
