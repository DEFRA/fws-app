class fwis {
  constructor (data) {
    this.data = data
    this.summaryData = {
      'Cumbria and Lancashire': {},
      'Devon and Cornwall': {},
      'East Anglia': {},
      'East Midlands': {},
      'Gtr Mancs Mersey and Ches': {},
      'Herts and North London': {},
      'Kent S London and E Sussex': {},
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
        text: 'Area'
      }, {
        text: 'Severe Flood Warnings'
      }, {
        text: 'Flood Warnings'
      }, {
        text: 'Flood Alerts'
      }, {
        text: 'No Longer In Force'
      }, {
        text: 'Total'
      }
    ]
    const rows = Object.keys(this.summaryData).map(area => {
      return [{
        text: area
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
