const moment = require('moment')

class AreaView {
  constructor (data) {
    this.data = data
    this.summaryData = {}

    if (data && data.warnings) {
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
            warningCode: warning.attr.taCode,
            changed: moment(warning.attr.situationChanged).format('DD/MM/YYYY hh:mma')
          }
        )
      })
    } else {
      let error = 'No warning data provided.'
      throw new Error(error)
    }
  }

  getAreaView () {
    const rows = []

    const areaRows = Object.keys(this.summaryData).map(area => {
      const subRows = []
      const headRow = [
        {
          text: area,
          classes: 'govuk-table__header govuk-!-width-one-quarter',
          attributes: { valign: 'center', xwidth: '35%' },
          colspan: 2
        }, {
          text: 'Total',
          classes: 'govuk-table__header center',
          attributes: { valign: 'center' }
        }, {
          text: 'Local Area Name',
          classes: 'govuk-table__header center',
          attributes: { valign: 'center' }
        }, {
          text: 'Warning Area Code',
          classes: 'govuk-table__header center',
          attributes: { valign: 'center' }
        }, {
          text: 'Last Changed',
          classes: 'govuk-table__header center govuk-!-width-one-quarter',
          attributes: { valign: 'center' }
        }
      ]
      subRows.push(headRow)

      Object.keys(this.summaryData[area]).forEach(severity => {
        Object.keys(this.summaryData[area][severity]).forEach(localArea => {
          let subRow
          if (localArea === '0') {
            const severityIconLocation = '/assets/images/' + severity.replace(/ /g, '') + '.png'
            const count = Object.keys(this.summaryData[area][severity]).length
            subRow = [
              {
                html: `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`,
                attributes: { valign: 'center', rowspan: count }
              }, {
                text: severity,
                attributes: { valign: 'center', rowspan: count }
              }, {
                text: Object.keys(this.summaryData[area][severity]).length || 0,
                attributes: { valign: 'center', rowspan: count },
                classes: 'center'
              }, {
                text: this.summaryData[area][severity][localArea]['name'],
                attributes: { valign: 'center' },
                classes: 'center'
              }, {
                text: this.summaryData[area][severity][localArea]['warningCode'],
                attributes: { valign: 'center' },
                classes: 'center'
              }, {
                text: this.summaryData[area][severity][localArea]['changed'],
                attributes: { valign: 'center' },
                classes: 'center'
              }
            ]
          } else {
            subRow = [
              {
                text: this.summaryData[area][severity][localArea]['name'],
                attributes: { valign: 'center' },
                classes: 'center'
              },
              {
                text: this.summaryData[area][severity][localArea]['warningCode'],
                attributes: { valign: 'center' },
                classes: 'center'
              }, {
                text: this.summaryData[area][severity][localArea]['changed'],
                attributes: { valign: 'center' },
                classes: 'center'
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
      rows
    }
  }
}

module.exports = AreaView

// const moment = require('moment')

// class AreaView {
//   constructor (data) {
//     this.data = data
//     this.summaryData = {}

//     if (data && data.warnings) {
//       this.data.warnings.forEach(warning => {
//         if (!this.summaryData[warning.attr.ownerArea]) {
//           this.summaryData[warning.attr.ownerArea] = {}
//         }

//         if (!this.summaryData[warning.attr.ownerArea][warning.attr.severity]) {
//           this.summaryData[warning.attr.ownerArea][warning.attr.severity] = []
//         }

//         this.summaryData[warning.attr.ownerArea][warning.attr.severity].push(
//           {
//             name: warning.attr.taName,
//             warningCode: warning.attr.taCode,
//             changed: moment(warning.attr.situationChanged).format('DD/MM/YYYY hh:mma')
//           }
//         )
//       })
//     } else {
//       let error = 'No warning data provided.'
//       throw new Error(error)
//     }
//   }

//   getAreaView () {
//     const rows = []

//     const areaRows = Object.keys(this.summaryData).map(area => {
//       const subRows = []
//       const headRow = [
//         {
//           text: area,
//           classes: 'govuk-table__header govuk-!-width-one-quarter',
//           attributes: { valign: 'center', xwidth: '35%' },
//           colspan: 2
//         }, {
//           text: 'Total',
//           classes: 'govuk-table__header center',
//           attributes: { valign: 'center' }
//         }, {
//           text: 'Local Area Name',
//           classes: 'govuk-table__header center',
//           attributes: { valign: 'center' }
//         }, {
//           text: 'Warning Area Code',
//           classes: 'govuk-table__header center',
//           attributes: { valign: 'center' }
//         }, {
//           text: 'Last Changed',
//           classes: 'govuk-table__header center govuk-!-width-one-quarter',
//           attributes: { valign: 'center' }
//         }
//       ]
//       subRows.push(headRow)

//       const severities = ['Severe Flood Warning', 'Flood Warning', 'Flood Alert', 'Warnings No Longer In Force']
//       severities.forEach(severity => {
//         const severityIconLocation = '/assets/images/' + severity.replace(/ /g, '') + '.png'
//         const count = this.summaryData[area][severity]
//           ? Object.keys(this.summaryData[area][severity]).length
//           : 0
//         const subRow = [
//           {
//             html: `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`,
//             attributes: { valign: 'center' }
//           }, {
//             text: severity,
//             attributes: { valign: 'center' }
//           }, {
//             text: count,
//             attributes: { valign: 'center' },
//             classes: 'center'
//           }, {
//             html: count && this.summaryData[area][severity].map(warning => warning.name).join('<br>'),
//             attributes: { valign: 'center' },
//             classes: 'center'
//           }, {
//             html: count && this.summaryData[area][severity].map(warning => warning.warningCode).join('<br>'),
//             attributes: { valign: 'center' },
//             classes: 'center'
//           }, {
//             html: count && this.summaryData[area][severity].map(warning => warning.changed).join('<br>'),
//             attributes: { valign: 'center' },
//             classes: 'center'
//           }
//         ]

//         subRows.push(subRow)
//       })

//       return subRows
//     })

//     areaRows.forEach(element => element.forEach(subElement => rows.push(subElement)))

//     return {
//       rows
//     }
//   }
// }

// module.exports = AreaView
