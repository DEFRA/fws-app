const areas = [
  'Cumbria and Lancashire',
  'Devon and Cornwall',
  'East Anglia',
  'East Midlands',
  'Gtr Mancs Mersey and Ches',
  'Herts and North London',
  'Kent S London and E Sussex',
  'Lincs and Northants',
  'North East',
  'Solent and South Downs',
  'Thames',
  'Wessex',
  'West Midlands',
  'Yorkshire'
]

// const warnings = [
//   'Severe Flood Warning',
//   'Flood Warnings',
//   'Flood Alerts',
//   'No Longer In Force'
// ]

module.exports = {
  summaryTable: {
    head: [
      {
        text: 'Area'
      }, {
        text: 'Severe Flood Warnings'
      }, {
        text: 'Flood Warnings'
      }, {
        text: 'Flood Alerts'
      }, {
        text: 'No Longer In Force'
      }, {
        text: 'Total'
      }
    ],
    rows: areas.map(area => {
      return [{
        text: area
      }, {
        text: 0
      }, {
        text: 0
      }, {
        text: 0
      }, {
        text: 0
      }, {
        text: 0
      }]
    })
  }
}
