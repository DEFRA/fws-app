const { severities } = require('../constants')

class UpdateWarningView {
  constructor (targetArea, warning) {
    this.targetArea = targetArea
    this.warning = warning

    const isFloodAlertArea = targetArea.ta_code.charAt(4).toLowerCase() !== 'w'

    // For Alert Areas, only show "Flood Alert" and "WNLIF"
    // For Warning Areas, only show "Severe Flood Warning",
    // "Flood Warning" and "WNLIF"
    const categorySeverities = isFloodAlertArea
      ? [severities[0], severities[3]]
      : [severities[1], severities[2], severities[3]]

    this.options = categorySeverities.map(severity => {
      const value = severity.value
      const text = severity.name
      const selected = warning
        ? warning.attr.severityValue === severity.value
        : false

      return {
        value, selected, text
      }
    })

    this.situation = warning && warning.situation
    this.hideRefresh = true
  }
}

module.exports = UpdateWarningView
