const moment = require('moment')

class TargetAreaView {
  constructor (targetArea) {
    this.targetArea = targetArea
    this.updateTime = moment
      .tz('Europe/London')
      .format('dddd D MMMM YYYY [at] h:mma')
  }
}

module.exports = TargetAreaView
