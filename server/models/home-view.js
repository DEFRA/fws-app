const moment = require('moment')

class HomeView {
  constructor (fwis, area) {
    this.title = 'Flood Digital Management Console'
    this.summaryTable = fwis.getSummaryTable()
    this.areaView = area.getAreaView()
    this.updateTime = moment.tz('Europe/London').format('DD/MM/YYYY hh:mma')
  }
}

module.exports = HomeView
