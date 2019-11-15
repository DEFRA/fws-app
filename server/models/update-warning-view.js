const { severities } = require('../constants')

class UpdateWarningView {
  constructor (targetArea, warning, payload, errors) {
    this.targetArea = targetArea

    let severityValue
    let situationValue

    if (payload) {
      severityValue = '' + payload.severity
      situationValue = payload.situation
    } else if (warning) {
      severityValue = warning.attr.severityValue
      situationValue = warning.situation
    }

    // For Alert Areas, only show "Flood Alert" and "WNLIF"
    // For Warning Areas, only show "Severe Flood Warning",
    // "Flood Warning" and "WNLIF"
    const isFloodAlertArea = targetArea.ta_code.charAt(4).toLowerCase() !== 'w'
    const categorySeverities = isFloodAlertArea
      ? severities.filter(obj => { return obj.value === '1' || obj.value === '4' })
      : severities.filter(obj => { return obj.value === '2' || obj.value === '3' || obj.value === '4' })

    categorySeverities.sort((a, b) => {
      return parseInt(a.value, 10) - parseInt(b.value, 10)
    })

    const options = categorySeverities.map(severity => {
      const value = severity.value
      const text = severity.name
      const selected = warning
        ? severityValue === severity.value
        : false

      return {
        value, selected, text
      }
    })

    // Prepare nunjucks model data

    // Situation textarea
    const situationTextarea = {
      name: 'situation',
      id: 'situation',
      label: {
        text: 'Situation'
      },
      value: situationValue,
      rows: 10
    }

    if (errors && errors.situation) {
      situationTextarea.errorMessage = {
        text: errors.situation
      }
    }

    this.situationTextarea = situationTextarea

    // Severity select
    const severitySelect = {
      id: 'severity',
      name: 'severity',
      label: {
        text: 'Severity'
      },
      items: options
    }

    if (errors && errors.severity) {
      severitySelect.errorMessage = {
        text: errors.severity
      }
    }

    this.severitySelect = severitySelect

    this.hideRefresh = true
  }
}

module.exports = UpdateWarningView
