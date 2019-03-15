const areas = require('../models/areas')

module.exports = {
  method: 'GET',
  path: '/table',
  options: {
    handler: (request, h) => {
      return h.view('partial/table2', {
        title: 'test title',
        params: areas.summaryTable
      })
    }
  }
}
