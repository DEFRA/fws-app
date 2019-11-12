const { severities } = require('../constants')

class UpdateWarningView {
  constructor (targetArea, warning, err, situationUpdate, currentSeverity) {
    this.targetArea = targetArea
    this.warning = warning
    this.currentSeverity = currentSeverity
    this.situationUpdate = situationUpdate
    this.err = err
    this.severity = warning && warning.attr ? warning.attr.severityValue : undefined
    this.situation = warning && warning.situation
    this.situationTextArea = this.populateTextArea()
    this.severitySelect = this.populateSeverity()

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
      // console.log('NW : ', this.err)
      textArea.errorMessage = {
        text: 'Situation must be 990 characters or fewer'
      }
    }
    return textArea
  }

  populateSeverity () {
    const severity = this.currentSeverity
      ? this.currentSeverity
      : this.severity

    const severitySelect = {
      id: 'severity',
      name: 'severity',
      label: {
        text: 'Severity'
      },
      items: [
        {
          value: 'Please Select',
          text: 'Please Select'
        },
        {
          value: '2',
          text: 'Flood warning'
        },
        {
          value: '3',
          text: 'Severe flood warning'
        },
        {
          value: '4',
          text: 'Warning no longer in force'
        }
      ]
    }

    severitySelect.items.forEach(item => { if (item.value === severity) item.selected = true })

    if (this.err) {
      severitySelect.errorMessage = {
        text: 'Please select a Severity'
      }
    }
    return severitySelect
  }
}

module.exports = UpdateWarningView
