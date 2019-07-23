const moment = require('moment-timezone')
const { dateFormat, severities } = require('../constants')

class TargetAreaView {
  constructor (targetArea, warning, historicWarnings, { allowEdit }) {
    this.targetArea = targetArea
    this.warning = warning
    this.allowEdit = allowEdit
    this.historicWarnings = historicWarnings

    if (warning) {
      this.warningTable = this.getTargetAreaWarningView()
    }

    if (historicWarnings && historicWarnings.length) {
      this.historicWarningsTable = this.getTargetAreaHistoricWarningsView()
    }
  }

  getTargetAreaWarningView () {
    const head = [
      {
        text: 'Severity',
        classes: 'govuk-table__header',
        attributes: { valign: 'center', colspan: 2 }
      },
      {
        text: 'Situation',
        classes: 'govuk-table__header govuk-!-width-one-half'
      },
      {
        text: 'Severity changed',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      },
      {
        text: 'Situation changed',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      },
      {
        text: 'Time message received',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      }
    ]

    const warning = this.warning
    const severity = severities.find(s => s.value === warning.attr.severityValue)
    const severityIconLocation = '/assets/images/' + severity.image
    const rows = [[
      {
        html: `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`,
        attributes: { valign: 'center' }
      },
      {
        text: warning.attr.severity,
        attributes: { valign: 'center' },
        classes: 'center'
      },
      {
        text: warning.situation,
        attributes: { valign: 'center', style: 'font-size: smaller' }
      },
      {
        text: moment(warning.attr.severityChanged).format(dateFormat),
        attributes: { valign: 'center' },
        classes: 'govuk-body-s center'
      },
      {
        text: moment(warning.attr.situationChanged).format(dateFormat),
        attributes: { valign: 'center' },
        classes: 'govuk-body-s center'
      },
      {
        text: moment(warning.attr.timeMessageReceived).format(dateFormat),
        attributes: { valign: 'center' },
        classes: 'govuk-body-s center'
      }
    ]]

    return {
      head,
      rows
    }
  }

  getTargetAreaHistoricWarningsView () {
    const head = [
      {
        text: 'Severity',
        classes: 'govuk-table__header',
        attributes: { valign: 'center', colspan: 2 }
      },
      {
        text: 'Situation',
        classes: 'govuk-table__header govuk-!-width-two-thirds',
        attributes: { valign: 'center' }
      },
      {
        text: 'Time Message Received',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      }
    ]

    const rows = this.historicWarnings.map(warning => {
      const severity = severities.find(s => s.value === warning.attr.severityValue)
      const severityIconLocation = '/assets/images/' + severity.image
      return [
        {
          html: `<img src="${severityIconLocation}" class="flooding-icons" alt="Flooding Icon">`,
          attributes: { valign: 'center' }
        },
        {
          text: warning.attr.severity,
          classes: 'center',
          attributes: { valign: 'center' }
        },
        {
          html: `<small>${warning.situation}</small>`,
          attributes: { valign: 'center' }
        },
        {
          text: moment(warning.attr.timeMessageReceived).format(dateFormat),
          attributes: { valign: 'center' },
          classes: 'govuk-body-s center'
        }
      ]
    })

    return {
      head,
      rows
    }
  }
}

module.exports = TargetAreaView
