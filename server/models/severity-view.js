const { severities } = require('../constants')
const { formatUTCDate, sortByMultiple } = require('../helpers')

class SeverityView {
  constructor (warnings) {
    this.warnings = warnings
    this.severityTable = this.getSeverityTable()
  }

  getSeverityTable () {
    const warnings = this.warnings.map(w => w.attr)

    const rows = []

    const headRow = [
      {
        text: 'Severity',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center', colspan: 2 }
      },
      {
        text: 'Total',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'Owner area',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'Warning area name',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'Situation changed',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'Severity changed',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      }
    ]
    rows.push(headRow)

    const severityRowOrder = ['3', '2', '1', '4']

    severityRowOrder.forEach(severity => {
      const severityName = severities.find(s => s.value === severity).name
      const severityWarnings = warnings
        .filter(w => w.severityValue === severity)
        .map(w => {
          w.situationChanged = new Date(w.situationChanged).getTime()
          return w
        })
        .sort(sortByMultiple('ownerArea', '-situationChanged'))

      const count = severityWarnings.length

      function isSameAsPreviousArea (index) {
        return severityWarnings[index].ownerArea !==
          severityWarnings[index - 1].ownerArea
      }

      function isSameAsNextArea (index) {
        return severityWarnings[index].ownerArea ===
          severityWarnings[index + 1].ownerArea
      }

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
          }, {}, {}, {}, {}, {}
        ])
      } else {
        severityWarnings.forEach((warning, index) => {
          const isLastWarning = severityWarnings.length === index + 1
          const severity = severities.find(s => s.value === warning.severityValue)
          const severityIconLocation = '/assets/images/' + severity.image

          rows.push([
            {
              html: index === 0
                ? `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`
                : '',
              attributes: { valign: 'center' },
              classes: !isLastWarning
                ? 'center noborder'
                : 'center'
            },
            {
              html: index === 0
                ? `<strong>${severityName}</strong>`
                : '',
              attributes: { valign: 'center' },
              classes: !isLastWarning
                ? 'center noborder'
                : 'center'
            },
            {
              text: index === 0
                ? count
                : '',
              attributes: { valign: 'center' },
              classes: !isLastWarning
                ? 'center noborder'
                : 'center'
            },
            {
              text: index === 0 || isSameAsPreviousArea(index)
                ? warning.ownerArea
                : '',
              classes: !isLastWarning && isSameAsNextArea(index)
                ? 'center noborder'
                : 'center'
            },
            {
              html: `<a href="/target-area/${warning.taCode}">${warning.taName}</a>`,
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
