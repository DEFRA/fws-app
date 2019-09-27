const { severities } = require('../constants')
const { sortBy, formatUTCDate } = require('../helpers')

class SeverityView {
  constructor (warnings, id) {
    this.warnings = warnings.filter(w => id ? w.attr.ownerArea === id : true)
    this.id = id
    this.severityTable = this.getSeverityTable()
  }

  getSeverityTable () {
    const warnings = this.warnings.map(w => w.attr)

    const rows = []
    // Create static table headers
    const headRow = [
      {
        text: 'Severity',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'Total',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'Owner Area',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'TaName',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'Severity changed',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'Situation changed',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      }
    ]
    rows.push(headRow)

    // Set severity row order from sever to not inforce
    const severityRowOrder = ['3', '2', '1', '4']

    // Filter Warnings by severity name then sort the filtered array by ownerArea
    severityRowOrder.forEach(severity => {
      const severityName = severities.find(s => s.value === severity).name
      const severityWarnings = warnings
        .filter(w => w.severityValue === severity)
        .sort(sortBy('ownerArea'))

      const count = severityWarnings.length

      // If count is 0 show severity name with a count of 0 and all other fields blank
      if (count === 0) {
        rows.push([
          {
            html: `<strong>${severityName}</strong>`,
            attributes: { valign: 'center' },
            classes: 'center'
          },
          {
            text: count,
            attributes: { valign: 'center' },
            classes: 'center'
          }, {}, {}, {}, {}
        ])
      } else {
        severityWarnings.forEach((warning, index) => {
          // Count isLastWarning, needed for Classes below
          const isLastWarning = severityWarnings.length === index + 1

          // Classes enabled if index > 0 and isnt last row remove boarder else show
          rows.push([
            {
              html: index === 0 ? `<strong>${severityName}</strong>` : '',
              attributes: { valign: 'center' },
              classes: index > 0 && !isLastWarning ? 'center noborder' : 'center'
            },
            {
              text: index === 0 ? count : '',
              attributes: { valign: 'center' },
              classes: index > 0 && !isLastWarning ? 'center noborder' : 'center'
            },
            {
              text: warning.ownerArea,
              attributes: { valign: 'center' },
              classes: 'center'
            },
            {
              html: warning.taName,
              attributes: { valign: 'center' },
              classes: 'center'
            },
            {
              text: formatUTCDate(warning.situationChanged),
              attributes: { valign: 'center' },
              classes: 'center'
            },
            {
              text: formatUTCDate(warning.severityChanged),
              attributes: { valign: 'center' },
              classes: 'center'
            }
          ])
        })
      }
    })

    return {
      rows
    }
  }
}

module.exports = SeverityView
