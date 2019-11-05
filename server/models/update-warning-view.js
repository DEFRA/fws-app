const { severities } = require('../constants')

class UpdateWarningView {
  constructor (targetArea, warning, err, situationUpdate) {
    this.targetArea = targetArea
    this.warning = warning
    this.situationUpdate = situationUpdate
    this.err = err
    this.severity = warning && warning.attr ? warning.attr.severityValue : undefined
    this.situation = warning && warning.situation
    this.situationTextArea = this.populateTextArea()

    const isFloodAlertArea = targetArea.ta_code.charAt(4).toLowerCase() !== 'w'

    // For Alert Areas, only show "Flood Alert" and "WNLIF"
    // For Warning Areas, only show "Severe Flood Warning",
    // "Flood Warning" and "WNLIF"
    const categorySeverities = isFloodAlertArea
      ? severities.filter(obj => { return obj.value === '1' || obj.value === '4' })
      : severities.filter(obj => { return obj.value === '2' || obj.value === '3' || obj.value === '4' })

    categorySeverities.sort((a, b) => {
      return parseInt(a.value, 10) - parseInt(b.value, 10)
    })

    this.options = categorySeverities.map(severity => {
      const value = severity.value
      const text = severity.name
      const selected = warning
        ? warning.attr.severityValue === severity.value
        : false

      return {
        value, selected, text, err
      }
    })
    this.hideRefresh = true
  }

  populateTextArea () {
    const textAreaContents = this.situationUpdate
      ? this.situationUpdate
      : this.situation
    const textArea = {
      name: 'situation',
      id: 'situation',
      label: {
        text: 'Situation'
      },
      value: textAreaContents,
      rows: 10
    }

    if (this.err) {
      textArea.errorMessage = { text: 'Situation must be 990 characters or fewer' }
    }
    return textArea
  }
}

module.exports = UpdateWarningView
