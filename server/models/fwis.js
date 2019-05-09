const moment = require('moment')

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
        classes: 'govuk-table__row bg'
      }, {
        text: 'Flood Alerts',
        classes: 'govuk-table__row bg'
      }, {
        text: 'Flood Warnings',
        classes: 'govuk-table__row bg'
      }, {
        text: 'Severe Flood Warnings',
        classes: 'govuk-table__row bg'
      }, {
        text: 'Warnings No Longer In Force',
        classes: 'govuk-table__row bg'
      }, {
        text: 'Total',
        classes: 'govuk-table__row bg'
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
      caption: 'Summary',
      captionClasses: 'govuk-heading-l',
      head: head,
      rows: rows
    }
  }
}

module.exports = fwis
