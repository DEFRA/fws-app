class fwis {
  constructor (data) {
    this.data = data
    this.summaryData = {
      'Cumbria and Lancashire': {},
      'Devon, Cornwall and the Isles of Scilly': {},
      'East Anglia': {},
      'East Midlands': {},
      'Greater Manchester, Merseyside and Cheshire': {},
      'Hertfordshire and North London': {},
      'Kent and South London': {},
      'Lincs and Northants': {},
      'North East': {},
      'Solent and South Downs': {},
      'Thames': {},
      'Wessex': {},
      'West Midlands': {},
      'Yorkshire': {}
    }
    this.data.warnings.forEach(warning => {
      this.summaryData[warning.attr.ownerArea][warning.attr.severity] = this.summaryData[warning.attr.ownerArea][warning.attr.severity]++ || 1
    })
  }

  getSummaryTable () {
    const head = [
      {
        text: 'Area',
        classes: 'govuk-table__row bg'
      }, {
        text: 'Severe Flood Warnings',
        classes: 'govuk-table__row bg'
      }, {
        text: 'Flood Warnings',
        classes: 'govuk-table__row bg'
      }, {
        text: 'Flood Alerts',
        classes: 'govuk-table__row bg'
      }, {
        text: 'No Longer In Force',
        classes: 'govuk-table__row bg'
      }, {
        text: 'Total',
        classes: 'govuk-table__row bg'
      }
    ]
    const rows = Object.keys(this.summaryData).map(area => {
      return [{
        html: `<a href='#area-0'> ${area} </a>`
      }, {
        text: this.summaryData[area]['Severe Flood Warning'] || 0
      }, {
        text: this.summaryData[area]['Flood Warning'] || 0
      }, {
        text: this.summaryData[area]['Flood Alert'] || 0
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
