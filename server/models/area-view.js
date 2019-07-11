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

//       Object.keys(this.summaryData[area]).forEach(severity => {
//         Object.keys(this.summaryData[area][severity]).forEach(localArea => {
//           let subRow
//           if (localArea === '0') {
//             const severityIconLocation = '/assets/images/' + severity.replace(/ /g, '') + '.png'
//             const count = Object.keys(this.summaryData[area][severity]).length
//             subRow = [
//               {
//                 html: `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`,
//                 attributes: { valign: 'center', rowspan: count }
//               }, {
//                 text: severity,
//                 attributes: { valign: 'center', rowspan: count }
//               }, {
//                 text: Object.keys(this.summaryData[area][severity]).length || 0,
//                 attributes: { valign: 'center', rowspan: count },
//                 classes: 'center'
//               }, {
//                 text: this.summaryData[area][severity][localArea]['name'],
//                 attributes: { valign: 'center' },
//                 classes: 'center'
//               }, {
//                 text: this.summaryData[area][severity][localArea]['warningCode'],
//                 attributes: { valign: 'center' },
//                 classes: 'center'
//               }, {
//                 text: this.summaryData[area][severity][localArea]['changed'],
//                 attributes: { valign: 'center' },
//                 classes: 'center'
//               }
//             ]
//           } else {
//             subRow = [
//               {
//                 text: this.summaryData[area][severity][localArea]['name'],
//                 attributes: { valign: 'center' },
//                 classes: 'center'
//               },
//               {
//                 text: this.summaryData[area][severity][localArea]['warningCode'],
//                 attributes: { valign: 'center' },
//                 classes: 'center'
//               }, {
//                 text: this.summaryData[area][severity][localArea]['changed'],
//                 attributes: { valign: 'center' },
//                 classes: 'center'
//               }
//             ]
//           }
//           subRows.push(subRow)
//         })
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

// #2
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
//             html: count && table(this.summaryData[area][severity], 'name'),
//             attributes: { valign: 'center' },
//             classes: 'center'
//           }, {
//             html: count && table(this.summaryData[area][severity], 'warningCode'),
//             attributes: { valign: 'center' },
//             classes: 'center'
//           }, {
//             html: count && table(this.summaryData[area][severity], 'changed'),
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

// function table (warnings, name) {
//   return `
//     <div class='c'>
//       ${warnings.map(warning => `<div class='r'>${warning[name]}</div>`).join('')}
//     </div>
//   `
// }

// function table (warnings, name) {
//   return `
//     <div class='c'>
//       ${warnings.map(warning => `<div class='r'>${warning[name]}</div>`).join('')}
//     </div>
//   `
// }

// module.exports = AreaView

// #3
const moment = require('moment')

class AreaView {
  constructor (data, url, id) {
    this.data = data
    this.id = id
    this.url = url
    this.summaryData = {}

    if (data && data.warnings) {
      this.data.warnings
        .filter(w => id ? w.attr.ownerArea === id : true)
        .forEach(warning => {
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
              situationChanged: moment(warning.attr.situationChanged),
              severityChanged: moment(warning.attr.severityChanged)
            }
          )
        })

      this.areaView = this.getAreaView()
      this.updateTime = moment.tz('Europe/London').format('dddd D MMMM YYYY [at] h:mma')
    } else {
      let error = 'No warning data provided.'
      throw new Error(error)
    }
  }

  getAreaView () {
    const rows = []
    const areas = Object.keys(this.summaryData).sort()
    const areaRows = areas.map(area => {
      const subRows = []
      const headRow = [
        {
          html: `<a href='/area/${encodeURIComponent(area)}'> ${area} </a>`,
          classes: 'govuk-table__header govuk-!-width-one-quarter',
          attributes: { valign: 'center', xwidth: '35%' },
          colspan: 2
        }, {
          text: 'Total',
          classes: 'govuk-table__header center',
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
          text: 'Situation Changed',
          classes: 'govuk-table__header center',
          attributes: { valign: 'center' }
        }, {
          text: 'Severity Changed',
          classes: 'govuk-table__header center',
          attributes: { valign: 'center' }
        }
      ]
      subRows.push(headRow)

      const severities = [
        'Severe Flood Warning', 'Flood Warning',
        'Flood Alert', 'Warnings No Longer In Force'
      ]

      severities.forEach(severity => {
        const severityIconLocation = '/assets/images/' + severity.replace(/ /g, '') + '.png'
        const count = this.summaryData[area][severity]
          ? Object.keys(this.summaryData[area][severity]).length
          : 0

        if (!count) {
          const subRow = [
            {
              html: `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`,
              attributes: { valign: 'center' }
            }, {
              text: severity,
              attributes: { valign: 'center' }
            }, {
              text: count,
              attributes: { valign: 'center' },
              classes: 'center'
            }, {}, {}, {}, {}
          ]

          subRows.push(subRow)
        } else {
          const warnings = this.summaryData[area][severity].sort((a, b) => {
            return b.situationChanged - a.situationChanged
          })

          warnings.forEach((warning, index) => {
            if (index === 0) {
              const subRow = [{
                html: `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`,
                attributes: { valign: 'center' },
                classes: count > 1 ? 'noborder' : ''
              }, {
                text: severity,
                attributes: { valign: 'center' },
                classes: count > 1 ? 'noborder' : ''
              }, {
                text: count,
                attributes: { valign: 'center' },
                classes: count > 1 ? 'center noborder' : 'center'
              }, {
                html: `<a href="/target-area/${warning.warningCode}">${warning.name}</a>`,
                attributes: { valign: 'center' },
                classes: 'center'
              }, {
                text: warning.warningCode,
                attributes: { valign: 'center' },
                classes: 'center'
              }, {
                text: warning.situationChanged.format('DD/MM/YYYY h:mma'),
                attributes: { valign: 'center' },
                classes: 'center'
              }, {
                text: warning.severityChanged.format('DD/MM/YYYY h:mma'),
                attributes: { valign: 'center' },
                classes: 'center'
              }]

              subRows.push(subRow)
            } else {
              const subRow = [{
                classes: index < count - 1 ? 'noborder' : ''
              }, {
                classes: index < count - 1 ? 'noborder' : ''
              }, {
                classes: index < count - 1 ? 'noborder' : ''
              }, {
                html: `<a href="/target-area/${warning.warningCode}">${warning.name}</a>`,
                attributes: { valign: 'center' },
                classes: 'center'
              }, {
                text: warning.warningCode,
                attributes: { valign: 'center' },
                classes: 'center'
              }, {
                text: warning.situationChanged.format('DD/MM/YYYY h:mma'),
                attributes: { valign: 'center' },
                classes: 'center'
              }, {
                text: warning.severityChanged.format('DD/MM/YYYY h:mma'),
                attributes: { valign: 'center' },
                classes: 'center'
              }]

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
