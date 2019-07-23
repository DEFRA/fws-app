class TargetAreaSearchView {
  constructor (areas, targetAreas = [], warnings = [], query, area) {
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
        text: 'Target Area Name',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      },
      {
        text: 'Target Area Code',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      },
      {
        text: 'Severity',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      }
    ]

    const rows = this.targetAreas.map(ta => {
      const targetAreaWarning = this.warnings.find(w => w.attr.taCode === ta.ta_code)
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
