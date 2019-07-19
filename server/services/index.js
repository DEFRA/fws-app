const moment = require('moment-timezone')
const http = require('../http')
const config = require('../config')
const { groupBy } = require('../helpers')
const targetAreas = require('../services/areas.json').items
const grouped = groupBy(targetAreas, 'eaAreaName')
const areas = Object.keys(grouped).sort().map(name => ({ name }))

const service = {
  async getFloods () {
    return http.getJson(`${config.api}/fwis.json`, true)
  },

  async getHistoricFloods (code) {
    const { warnings } = await service.getFloods()
    return warnings.filter(w => w.attr.taCode === code)
  },

  async getAllAreas () {
    return Promise.resolve(areas)
  },

  async findTargetAreas (query, area) {
    const result = targetAreas.filter(a => {
      if (area) {
        if (a.eaAreaName !== area) {
          return false
        }
      }

      if (query) {
        if (!a.label.includes(query) && !a.fwdCode.includes(query)) {
          return false
        }
      }

      return true
    })

    return Promise.resolve(result)
  },

  async getTargetArea (code) {
    return Promise.resolve(targetAreas.find(ta => ta.fwdCode === code))
  },

  async updateWarning (code, severity, situation, profile) {
    const approved = moment.tz('Europe/London').format('DD/MM/YYYY HH:mm')

    const bodyXml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <WarningMessage xmlns="http://www.environment-agency.gov.uk/XMLSchemas/EAFWD" approved="${approved}" requestId="" language="English">
        <TargetAreaCode><![CDATA[${code}]]></TargetAreaCode>
        <SeverityLevel>${severity}</SeverityLevel>
        <InternetSituation><![CDATA[${situation}]]></InternetSituation>
        <FWISGroupedTACodes />
      </WarningMessage>
      `

    return http.postJson(`${config.api}/message`, { bodyXml, profile }, true)
  }
}

module.exports = service
