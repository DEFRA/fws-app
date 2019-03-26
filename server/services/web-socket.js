const Fwis = require('../models/fwis')
const fwisService = require('./fwis')

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
      const fwis = new Fwis(await fwisService.get())
      console.log('Warning count: ' + fwis.data.warnings.length)
      console.log(JSON.stringify(fwis.data))
      console.log(JSON.stringify(fwis.summaryData))
      server.publish('/summary', {
        params: fwis.getSummaryTable(),
        updateTime: new Date().toISOString()
      })
    } else {
      console.log('No sockets to publish warnings to')
    }
  }
}
