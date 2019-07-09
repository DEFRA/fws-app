const moment = require('moment-timezone')
const fwisService = require('./fwis')
const Fwis = require('../models/fwis')
const Area = require('../models/area-view')

module.exports = {
  init: (server) => {
    server.subscription('/summary')
  },
  publishWarnings: async (server) => {
    let connected = false
    server.eachSocket(socket => {
      connected = true
    })
    if (connected) {
      console.log('Publishing warnings to sockets')
      const data = await fwisService.get()
      const fwis = new Fwis(data)
      const area = new Area(data)

      server.publish('/summary', {
        fwis,
        areaView: area.getAreaView(),
        summaryTable: fwis.getSummaryTable(),
        warnings: await fwisService.get(),
        updateTime: new Date().toISOString(),
        updateTimePretty: moment.tz('Europe/London').format('dddd D MMMM YYYY [at] h:mma')
      })
    } else {
      console.log('No sockets to publish warnings to')
    }
  }
}
