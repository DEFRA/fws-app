const moment = require('moment-timezone')
const http = require('../http')
const config = require('../config')
const { groupBy, sortByMultiple } = require('../helpers')

const service = {
  async getFloods () {
    return http.getJson(`${config.api}/fwis.json`, true)
  },

  async getFloodsPlus () {
    return http.getJson(`${config.api}/fwis-plus.json`, true)
  },

  async getHistoricFloods (code) {
    return http.getJson(`${config.api}/historical-messages/${code}`, true)
  },

  async getAllAreas () {
    let targetAreas = await http.getJson(`${config.api}/target-areas.json`, true)
    const sorter = sortByMultiple('owner_area', 'ta_name')
    targetAreas = targetAreas.sort(sorter)

    const grouped = groupBy(targetAreas, 'owner_area')
    const areas = Object.keys(grouped).sort().map(name => ({ name }))
    return { areas, targetAreas }
  },

  async updateWarning (code, severity, situation, profile) {
    const approved = moment.tz('Europe/London').format('DD/MM/YYYY HH:mm:ss')

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
