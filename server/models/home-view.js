class HomeView {
  constructor (fwis) {
    this.title = 'Flood Digital Management Console'
    this.summaryTable = fwis.getSummaryTable()
  }
}

module.exports = HomeView
