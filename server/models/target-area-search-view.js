class TargetAreaSearchView {
  constructor (areas, query, area, targetAreas = [], warnings = []) {
    this.targetAreas = targetAreas
    this.warnings = warnings
    this.areas = areas
    this.area = area
    this.query = query

    this.targetAreaView = this.getTargetAreaView()
    this.showTargetAreaTable = !!this.targetAreaView.rows.length
  }

  getTargetAreaView () {
    const head = [
      {
        text: 'Area Name',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header govuk-!-width-one-quarter'
      },
      {
        text: 'Warning area name',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      },
      {
        text: 'Warning area code',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      },
      {
        text: 'Severity',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      }
    ]

    const warnings = this.warnings
    const sorter = (a, b) => {
      const warningA = warnings.find(w => w.attr.taCode === a.ta_code)
      const warningB = warnings.find(w => w.attr.taCode === b.ta_code)

      if (warningA) {
        return warningB ? 0 : -1
      } else if (warningB) {
        return 1
      } else {
        return 0
      }
    }

    const targetAreas = this.targetAreas.sort(sorter)

    const rows = targetAreas.map(ta => {
      const targetAreaWarning = warnings.find(w => w.attr.taCode === ta.ta_code)
      return [
        {
          html: `<a href='/area/${encodeURIComponent(ta.owner_area)}'>${ta.owner_area}</a>`,
          attributes: { valign: 'center' }
        },
        {
          html: `<a href='/target-area/${encodeURIComponent(ta.ta_code)}'>${ta.ta_name}</a>`,
          attributes: { valign: 'center' },
          classes: 'center'
        },
        {
          text: ta.ta_code,
          attributes: { valign: 'center' },
          classes: 'center'
        },
        {
          text: targetAreaWarning ? targetAreaWarning.attr.severity : '',
          attributes: { valign: 'center' },
          classes: 'center'
        }
      ]
    })

    return {
      head,
      rows
    }
  }
}

module.exports = TargetAreaSearchView
