
class fwis {
  constructor (data) {
    this.data = data
    this.summaryData = {}

    if (data && data.warnings) {
      this.data.warnings.forEach(warning => {
        if (!this.summaryData[warning.attr.ownerArea]) {
          this.summaryData[warning.attr.ownerArea] = {}
        }
        this.summaryData[warning.attr.ownerArea][warning.attr.severity] =
          this.summaryData[warning.attr.ownerArea][warning.attr.severity]++ || 1
      })
    } else {
      let error = 'No warning data provided.'
      throw new Error(error)
    }
  }

  getSummaryTable () {
    const head = [
      {
        text: 'Environment Agency Area'
      }, {
        text: 'Flood Alerts',
        classes: 'center'
      }, {
        text: 'Flood Warnings',
        classes: 'center'
      }, {
        text: 'Severe Flood Warnings',
        classes: 'center'
      }, {
        text: 'Warnings No Longer In Force',
        classes: 'center'
      }, {
        text: 'Area Total',
        classes: 'center'
      }
    ]

    const rows = Object.keys(this.summaryData).map(area => {
      return [{
        html: `<a href='/area/${encodeURIComponent(area)}'>${area}</a>`
        // html: `<a href='/area'> ${area} </a>`
      }, {
        text: this.summaryData[area]['Flood Alert'] || 0,
        classes: 'center'
      }, {
        text: this.summaryData[area]['Flood Warning'] || 0,
        classes: 'center'
      }, {
        text: this.summaryData[area]['Severe Flood Warning'] || 0,
        classes: 'center'
      }, {
        text: this.summaryData[area]['No Longer In Force'] || 0,
        classes: 'center'
      }, {
        text: (this.summaryData[area]['Severe Flood Warning'] || 0) +
          (this.summaryData[area]['Flood Warning'] || 0) +
          (this.summaryData[area]['Flood Alert'] || 0) +
          (this.summaryData[area]['No Longer In Force'] || 0),
        classes: 'center'
      }]
    })

    rows.push([{
      text: 'Severity Total',
      classes: 'govuk-table__header'
    }, {
      text: this.data.warnings.filter(warning => warning.attr.severityValue === '1').length,
      classes: 'govuk-table__header center'
    }, {
      text: this.data.warnings.filter(warning => warning.attr.severityValue === '2').length,
      classes: 'govuk-table__header center'
    }, {
      text: this.data.warnings.filter(warning => warning.attr.severityValue === '3').length,
      classes: 'govuk-table__header center'
    }, {
      text: this.data.warnings.filter(warning => warning.attr.severityValue === '4').length,
      classes: 'govuk-table__header center'
    }, {
      text: ''
    }])

    return {
      head,
      rows
    }
  }
}

module.exports = fwis
