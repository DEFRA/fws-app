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

    const severityOrderBy = ['3', '2', '1', '4']
    const severityHeaders = severities.map(severity => {
      return {
        text: severity.pluralisedName,
        classes: 'center',
        value: severity.value
      }
    }).sort((a, b) => {
      return severityOrderBy.indexOf(a.value) - severityOrderBy.indexOf(b.value)
    })

    // Head
    const head = [
      {
        text: 'Environment agency area'
      },
      ...severityHeaders,
      {
        text: 'Area total',
        classes: 'center'
      }
    ]

    // Rows
    const rows = Object.keys(grouped).sort().map(area => {
      const severityValues = severityHeaders.map(severity => {
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
    const severityTotals = severityHeaders.map(severity => {
      return {
        text: warnings.filter(warning => warning.severityValue === severity.value).length,
        classes: 'govuk-table__header center'
      }
    })

    let total = 0
    severityTotals.forEach(st => {
      total = total + st.text
    })

    rows.push([
      {
        text: 'Severity total',
        classes: 'govuk-table__header'
      },
      ...severityTotals,
      {
        text: total,
        classes: 'govuk-table__header center'
      }
    ])

    return {
      head,
      rows
    }
  }
}

module.exports = SummaryView
