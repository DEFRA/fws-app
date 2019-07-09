const moment = require('moment')

class HomeView {
  constructor (fwis) {
    this.title = 'Flood Digital Management Console'
    this.summaryTable = fwis.getSummaryTable()
    this.updateTime = moment.tz('Europe/London').format('dddd D MMMM YYYY [at] h:mma')
  }
}

module.exports = HomeView
