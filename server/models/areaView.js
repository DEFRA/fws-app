const moment = require('moment')

class Area {
  constructor (data) {
    this.data = data
    this.summaryData = {}

    this.data.warnings.forEach(warning => {
      if (!this.summaryData[warning.attr.ownerArea]) {
        this.summaryData[warning.attr.ownerArea] = {}
      }

      if (!this.summaryData[warning.attr.ownerArea][warning.attr.severity]) {
        this.summaryData[warning.attr.ownerArea][warning.attr.severity] = []
      }

      this.summaryData[warning.attr.ownerArea][warning.attr.severity].push(
        {
          name: warning.attr.taName,
          changed: moment(warning.attr.situationChanged).format('DD/MM/YYYY - hh:mm')
        }
      )
    })
  }

  getAreaView () {
    let head = []
    let rows = []

    const areaRows = Object.keys(this.summaryData).map(area => {
      let subRows = []
      let headRow = [
        {
          html: `<h4 id=3> ${area}</h4>`,
          classes: 'govuk-table__header',
          attributes: { valign: 'top' }
        }, {
          text: 'Total',
          classes: 'govuk-table__header',
          attributes: { valign: 'top' }
        }, {
          text: 'Local Area Name',
          classes: 'govuk-table__header',
          attributes: { valign: 'top' }
        }, {
          text: 'Last Changed',
          classes: 'govuk-table__header',
          attributes: { valign: 'top' }
        }
      ]
      subRows.push(headRow)
      let subRow = []
      
      Object.keys(this.summaryData[area]).forEach(severity => {
        Object.keys(this.summaryData[area][severity]).forEach(localArea => {
          if (localArea === '0') {
            subRow = [
              {
                text: severity,
                attributes: { valign: 'top', rowspan: Object.keys(this.summaryData[area][severity]).length }
              }, {
                text: Object.keys(this.summaryData[area][severity]).length || 0,
                attributes: { valign: 'top', rowspan: Object.keys(this.summaryData[area][severity]).length }
              }, {
                text: this.summaryData[area][severity][localArea]['name'],
                attributes: { valign: 'top' }
              }, {
                text: this.summaryData[area][severity][localArea]['changed'],
                attributes: { valign: 'top' }
              }
            ]
          } else {
            subRow = [
              {
                text: this.summaryData[area][severity][localArea]['name'],
                attributes: { valign: 'top' }
              }, {
                text: this.summaryData[area][severity][localArea]['changed'],
                attributes: { valign: 'top' }
              }
            ]
          }
          subRows.push(subRow)
        })
      })
      return subRows
    })
    areaRows.forEach(element => element.forEach(subElement => rows.push(subElement)))

    return {
      head: head,
      rows: rows
    }
  }
}

module.exports = Area
