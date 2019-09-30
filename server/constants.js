const severities = [
  {
    value: '3',
    name: 'Severe flood warning',
    pluralisedName: 'Severe flood warnings',
    image: 'SevereFloodWarning.png',
    isActive: true
  }, {
    value: '2',
    name: 'Flood warning',
    pluralisedName: 'Flood warnings',
    image: 'FloodWarning.png',
    isActive: true
  }, {
    value: '1',
    name: 'Flood alert',
    pluralisedName: 'Flood alerts',
    image: 'FloodAlert.png',
    isActive: true
  }, {
    value: '4',
    name: 'Warning no longer in force',
    pluralisedName: 'Warnings no longer in force',
    image: 'WarningsNoLongerInForce.png',
    isActive: false
  }
]

module.exports = {
  dateFormat: 'DD/MM/YYYY h:mma',
  longDateFormat: 'dddd D MMMM YYYY [at] h:mma',
  severities
}
