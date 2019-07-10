const moment = require('moment')

class TargetAreaSearchView {
  constructor (targetAreas, areas, { url, query, area }) {
    this.areas = areas
    this.targetAreas = targetAreas
    this.url = url
    this.area = area
    this.query = query
    this.updateTime = moment
      .tz('Europe/London')
      .format('dddd D MMMM YYYY [at] h:mma')

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
          text: 'Severity',
          classes: 'center',
          attributes: { valign: 'center' }
        }
      ]
    })

    return {
      head: head,
      rows: rows
    }
  }
}

module.exports = TargetAreaSearchView
