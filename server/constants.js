const severities = [
  {
    value: '1',
    name: 'Flood Alert',
    pluralisedName: 'Flood Alerts',
    image: 'FloodAlert.png',
    isActive: true
  }, {
    value: '2',
    name: 'Flood Warning',
    pluralisedName: 'Flood Warnings',
    image: 'FloodWarning.png',
    isActive: true
  }, {
    value: '3',
    name: 'Severe Flood Warning',
    pluralisedName: 'Severe Flood Warnings',
    image: 'SevereFloodWarning.png',
    isActive: true
  }, {
    value: '4',
    name: 'Warning no Longer in Force',
    pluralisedName: 'Warnings no Longer in Force',
    image: 'WarningsNoLongerInForce.png',
    isActive: false
  }]

module.exports = {
  dateFormat: 'DD/MM/YYYY h:mma',
  longDateFormat: 'dddd D MMMM YYYY [at] h:mma',
  severities
}
