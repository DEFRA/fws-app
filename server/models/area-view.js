const { severities } = require('../constants')
const { groupBy, formatUTCDate } = require('../helpers')

class AreaView {
  constructor (warnings, id) {
    this.warnings = warnings.filter(w => id ? w.attr.ownerArea === id : true)
    this.id = id
    this.areaView = this.getAreaView()
  }

  getAreaView () {
    const warnings = this.warnings.map(w => w.attr)
    const grouped = groupBy(warnings, 'ownerArea')

    const rows = []
    const areas = Object.keys(grouped).sort()
    const areaRows = areas.map(area => {
      const subRows = []
      const headRow = [
        {
          html: `<a href='/area/${encodeURIComponent(area)}'>${area}</a>`,
          classes: 'govuk-table__header govuk-!-width-one-quarter',
          attributes: { valign: 'center' },
          colspan: 2
        },
        {
          text: 'Total',
          classes: 'govuk-table__header center',
          attributes: { valign: 'center' }
        },
        {
          text: 'Target area name',
          classes: 'govuk-table__header center',
          attributes: { valign: 'center' }
        },
        {
          text: 'Target area code',
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
      subRows.push(headRow)

      const severityRowOrder = ['3', '2', '1', '4']

      const areaGrouped = groupBy(grouped[area], 'severityValue')

      severityRowOrder.forEach(severityRow => {
        const severity = severities.find(s => s.value === severityRow)
        const severityIconLocation = '/assets/images/' + severity.image
        const count = areaGrouped[severity.value]
          ? Object.keys(areaGrouped[severity.value]).length
          : 0

        if (!count) {
          const subRow = [
            {
              html: `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`,
              attributes: { valign: 'center' }
            },
            {
              text: severity.name,
              attributes: { valign: 'center' }
            },
            {
              text: count,
              attributes: { valign: 'center' },
              classes: 'center'
            },
            {}, {}, {}, {}
          ]

          subRows.push(subRow)
        } else {
          const warnings = areaGrouped[severity.value].sort((a, b) => {
            return new Date(b.situationChanged) - new Date(a.situationChanged)
          })

          warnings.forEach((warning, index) => {
            if (index === 0) {
              const subRow = [
                {
                  html: `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`,
                  attributes: { valign: 'center' },
                  classes: count > 1 ? 'noborder' : ''
                },
                {
                  text: severity.name,
                  attributes: { valign: 'center' },
                  classes: count > 1 ? 'noborder' : ''
                },
                {
                  text: count,
                  attributes: { valign: 'center' },
                  classes: count > 1 ? 'center noborder' : 'center'
                },
                {
                  html: `<a href="/target-area/${warning.taCode}">${warning.taName}</a>`,
                  attributes: { valign: 'center' },
                  classes: 'center'
                },
                {
                  text: warning.taCode,
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
                }]

              subRows.push(subRow)
            } else {
              const subRow = [
                {
                  classes: index < count - 1 ? 'noborder' : ''
                },
                {
                  classes: index < count - 1 ? 'noborder' : ''
                },
                {
                  classes: index < count - 1 ? 'noborder' : ''
                },
                {
                  html: `<a href="/target-area/${warning.taCode}">${warning.taName}</a>`,
                  attributes: { valign: 'center' },
                  classes: 'center'
                },
                {
                  text: warning.taCode,
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
              ]

              subRows.push(subRow)
            }
          })
        }
      })

      return subRows
    })

    areaRows.forEach(element => element.forEach(subElement => rows.push(subElement)))

    return {
      rows
    }
  }
}

module.exports = AreaView
