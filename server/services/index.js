const util = require('../http')
const config = require('../config')
const { groupBy } = require('../helpers')
const targetAreas = require('../services/areas.json').items
const grouped = groupBy(targetAreas, 'eaAreaName')
const areas = Object.keys(grouped).sort().map(name => ({ name }))

const service = {
  async getFloods () {
    return util.getJson(`${config.api}/fwis.json`, true)
  },

  async getHistoricFloods (code) {
    const { warnings } = await service.getFloods()
    return warnings.filter(w => w.attr.taCode === code)
  },

  async getAllAreas () {
    return Promise.resolve(areas)
  },

  async findTargetAreas (query, area) {
    const hasSearchParam = query !== undefined || area !== undefined
    const result = hasSearchParam ? targetAreas.filter(a => {
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
    }) : []

    return Promise.resolve(result)
  },

  async getTargetArea (code) {
    return Promise.resolve(targetAreas.find(ta => ta.fwdCode === code))
  },

  async updateWarning (id, severity, situation) {
    return Promise.resolve(true)
  }
}

module.exports = service
