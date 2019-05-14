
class fwis {
  constructor (data) {
    this.data = data
    this.summaryData = {}

    if (data && data.warnings) {
      this.data.warnings.forEach(warning => {
        if (!this.summaryData[warning.attr.ownerArea]) {
          this.summaryData[warning.attr.ownerArea] = {}
        }
        this.summaryData[warning.attr.ownerArea][warning.attr.severity] = this.summaryData[warning.attr.ownerArea][warning.attr.severity]++ || 1
      })
    } else {
      let error = 'No warning data provided.'
      throw new Error(error)
    }
  }

  getSummaryTable () {
    const head = [
      {
        text: 'Environment Agency Area',
        attributes: { valign: 'top' }
      }, {
        text: 'Flood Alerts',
        attributes: { valign: 'top' }
      }, {
        text: 'Flood Warnings',
        attributes: { valign: 'top' }
      }, {
        text: 'Severe Flood Warnings',
        attributes: { valign: 'top' }
      }, {
        text: 'Warnings No Longer In Force',
        attributes: { valign: 'top' }
      }, {
        text: 'Total',
        attributes: { valign: 'top' }
      }
    ]
    const rows = Object.keys(this.summaryData).map(area => {
      return [{
        html: `<a href='#Area'> ${area} </a>`
      }, {
        text: this.summaryData[area]['Flood Alert'] || 0
      }, {
        text: this.summaryData[area]['Flood Warning'] || 0
      }, {
        text: this.summaryData[area]['Severe Flood Warning'] || 0
      }, {
        text: this.summaryData[area]['No Longer In Force'] || 0
      }, {
        text: (this.summaryData[area]['Severe Flood Warning'] || 0) + (this.summaryData[area]['Flood Warning'] || 0) + (this.summaryData[area]['Flood Alert'] || 0) + (this.summaryData[area]['No Longer In Force'] || 0)
      }]
    })
    return {
      head: head,
      rows: rows
    }
  }
}

module.exports = fwis
