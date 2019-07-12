const { groupBy } = require('../helpers')

class SummaryView {
  constructor (warnings) {
    this.warnings = warnings
    this.summaryTable = this.getSummaryTable()
  }

  getSummaryTable () {
    const warnings = this.warnings.map(w => w.attr)
    const grouped = groupBy(warnings, 'ownerArea')

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

    const rows = Object.keys(grouped).map(area => {
      return [{
        html: `<a href='/area/${encodeURIComponent(area)}'>${area}</a>`
      }, {
        text: grouped[area].filter(w => w.severityValue === '1').length,
        classes: 'center'
      }, {
        text: grouped[area].filter(w => w.severityValue === '2').length,
        classes: 'center'
      }, {
        text: grouped[area].filter(w => w.severityValue === '3').length,
        classes: 'center'
      }, {
        text: grouped[area].filter(w => w.severityValue === '4').length,
        classes: 'center'
      }, {
        text: grouped[area].length,
        classes: 'center'
      }]
    })

    rows.push([{
      text: 'Severity Total',
      classes: 'govuk-table__header'
    }, {
      text: warnings.filter(warning => warning.severityValue === '1').length,
      classes: 'govuk-table__header center'
    }, {
      text: warnings.filter(warning => warning.severityValue === '2').length,
      classes: 'govuk-table__header center'
    }, {
      text: warnings.filter(warning => warning.severityValue === '3').length,
      classes: 'govuk-table__header center'
    }, {
      text: warnings.filter(warning => warning.severityValue === '4').length,
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

module.exports = SummaryView
