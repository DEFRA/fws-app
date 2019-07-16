const { groupBy } = require('../helpers')
const { severities } = require('../constants')

class SummaryView {
  constructor (warnings) {
    this.warnings = warnings
    this.summaryTable = this.getSummaryTable()
  }

  getSummaryTable () {
    const warnings = this.warnings.map(w => w.attr)
    const grouped = groupBy(warnings, 'ownerArea')

    const severityHeaders = severities.map(severity => {
      return {
        text: severity.pluralisedName,
        classes: 'center'
      }
    })

    // Head
    const head = [
      {
        text: 'Environment Agency Area'
      },
      ...severityHeaders,
      {
        text: 'Area Total',
        classes: 'center'
      }
    ]

    // Rows
    const rows = Object.keys(grouped).sort().map(area => {
      const severityValues = severities.map(severity => {
        return {
          text: grouped[area].filter(w => w.severityValue === severity.value).length,
          classes: 'center'
        }
      })

      return [
        {
          html: `<a href='/area/${encodeURIComponent(area)}'>${area}</a>`
        },
        ...severityValues,
        {
          text: grouped[area].length,
          classes: 'center'
        }
      ]
    })

    // Totals
    const severityTotals = severities.map(severity => {
      return {
        text: warnings.filter(warning => warning.severityValue === severity.value).length,
        classes: 'govuk-table__header center'
      }
    })

    rows.push([
      {
        text: 'Severity Total',
        classes: 'govuk-table__header'
      },
      ...severityTotals,
      {
        text: ''
      }
    ])

    return {
      head,
      rows
    }
  }
}

module.exports = SummaryView
