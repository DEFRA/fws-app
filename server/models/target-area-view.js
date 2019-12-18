const { severities } = require('../constants')
const { formatUTCDate } = require('../helpers')

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
        text: 'Time of change',
        attributes: { valign: 'center' },
        classes: 'govuk-table__header center'
      },
      {
        text: 'Source',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
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
        text: severity.name,
        attributes: { valign: 'center' },
        classes: 'center'
      },
      {
        text: warning.situation,
        attributes: { valign: 'center', style: 'font-size: smaller' }
      },
      {
        text: formatUTCDate(warning.attr.severityChanged),
        attributes: { valign: 'center' },
        classes: 'govuk-body-s center'
      },
      {
        text: formatUTCDate(warning.attr.situationChanged),
        attributes: { valign: 'center' },
        classes: 'govuk-body-s center'
      },
      {
        text: formatUTCDate(warning.attr.timeMessageReceived),
        attributes: { valign: 'center' },
        classes: 'govuk-body-s center'
      },
      {
        text: warning.attr.createdByName || 'FWS',
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
        text: 'Time of change',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      },
      {
        text: 'Source',
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
          text: severity.name,
          classes: 'center',
          attributes: { valign: 'center' }
        },
        {
          text: warning.situation,
          attributes: { valign: 'center', style: 'font-size: smaller' }
        },
        {
          text: formatUTCDate(warning.attr.timeMessageReceived),
          attributes: { valign: 'center' },
          classes: 'govuk-body-s center'
        },
        {
          text: warning.attr.createdByName || 'FWS',
          attributes: { valign: 'center' },
          classes: 'govuk-body-s center'
        }
      ]
    })

    return {
      head,
      rows,
      classes: 'historic-warnings collapsed'
    }
  }
}

module.exports = TargetAreaView
