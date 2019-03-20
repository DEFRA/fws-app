const util = require('../util')
const config = require('../config')

module.exports = {
  get: () => {
    return util.getJson(`${config.api}/fwis.json`)
  }
}
