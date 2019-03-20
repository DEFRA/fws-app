const Fwis = require('../models/fwis')
const fwisService = require('../services/fwis')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      try {
        const fwis = new Fwis(await fwisService.get())
        return h.view('home', {
          title: 'Flood warnings management tool',
          summaryTable: fwis.getSummaryTable(),
          updateTime: new Date().toISOString()
        })
      } catch (err) {
        throw err
      }
    }
  }
}
