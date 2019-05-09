const Fwis = require('../models/fwis')
const Area = require('../models/areaView')
const fwisService = require('../services/fwis')
const moment = require('moment-timezone')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      try {
        const fwis = new Fwis(await fwisService.get())
        const area = new Area(await fwisService.get())
        return h.view('home', {
          title: 'Flood Digital Management Console',
          summaryTable: fwis.getSummaryTable(),
          areaView: area.getAreaView(),
          updateTime: moment.tz('Europe/London').format('DD/MM/YYYY - HH:mm:ss')
        })
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }
}
