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
      // const fwis = new Fwis(await fwisService.get())
      server.publish('/summary', {
        warnings: await fwisService.get(),
        updateTime: new Date().toISOString()
      })
    } else {
      console.log('No sockets to publish warnings to')
    }
  }
}
