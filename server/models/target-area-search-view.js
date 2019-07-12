class TargetAreaSearchView {
  constructor (targetAreas, warnings, areas, { query, area }) {
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
        classes: 'govuk-table__header govuk-!-width-one-quarter',
        attributes: { valign: 'center' }
      }, {
        text: 'Target Area Name',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      }, {
        text: 'Target Area Code',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      }, {
        text: 'Severity',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      }
    ]

    const rows = this.targetAreas.map(ta => {
      const targetAreaWarning = this.warnings.find(w => w.attr.taCode === ta.fwdCode)
      return [
        {
          html: `<a href='/area/${encodeURIComponent(ta.eaAreaName)}'>${ta.eaAreaName}</a>`,
          attributes: { valign: 'center' }
        }, {
          html: `<a href='/target-area/${encodeURIComponent(ta.fwdCode)}'>${ta.label}</a>`,
          classes: 'center',
          attributes: { valign: 'center' }
        }, {
          text: ta.fwdCode,
          classes: 'center',
          attributes: { valign: 'center' }
        }, {
          text: targetAreaWarning ? targetAreaWarning.attr.severity : '',
          classes: 'center',
          attributes: { valign: 'center' }
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
