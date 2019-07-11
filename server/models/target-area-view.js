const moment = require('moment-timezone')
const { dateFormat } = require('../constants')

class TargetAreaView {
  constructor (targetArea, warnings, historicWarnings) {
    this.targetArea = targetArea
    this.warnings = warnings
    this.historicWarnings = historicWarnings

    if (warnings && warnings.length) {
      this.warningsTable = this.getTargetAreaWarningsView()
    }

    if (historicWarnings && historicWarnings.length) {
      this.historicWarningsTable = this.getTargetAreaHistoricWarningsView()
    }
  }

  getTargetAreaWarningsView () {
    const head = [
      {
        text: 'Severity',
        classes: 'govuk-table__header',
        attributes: { valign: 'center', colspan: 2 }
      },
      {
        text: 'Severity Changed',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      }, {
        text: 'Situation Changed',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      }, {
        text: 'Time Message Received',
        classes: 'govuk-table__header center',
        attributes: { valign: 'center' }
      }, {
        text: 'Situation',
        classes: 'govuk-table__header govuk-!-width-one-half'
      }
    ]

    const rows = this.warnings.map(warning => {
      const severityIconLocation = '/assets/images/' + warning.attr.severity.replace(/ /g, '') + '.png'
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
          text: moment(warning.attr.severityChanged).format(dateFormat),
          attributes: { valign: 'center' },
          classes: 'govuk-body-s center'
        },
        {
          text: moment(warning.attr.situationChanged).format(dateFormat),
          attributes: { valign: 'center' },
          classes: 'govuk-body-s center'
        }, {
          text: moment(warning.attr.timeMessageReceived).format(dateFormat),
          attributes: { valign: 'center' },
          classes: 'govuk-body-s center'
        }, {
          html: `<small>${warning.situation}</small>`,
          attributes: { valign: 'center' }
        }
      ]
    })

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
      }, {
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
      const severityIconLocation = '/assets/images/' + warning.attr.severity.replace(/ /g, '') + '.png'
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
