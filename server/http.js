const config = require('./config')
const HttpsProxyAgent = require('https-proxy-agent')

// Timeout is high to accomodate the use of lambda backend functions
const timeout = 30 * 1000

const wreck = require('@hapi/wreck').defaults({
  timeout: timeout
})
let wreckExt
if (config.proxy) {
  wreckExt = require('@hapi/wreck').defaults({
    timeout: timeout,
    agent: new HttpsProxyAgent(config.proxy)
  })
}

module.exports = {
  getJson: function (url, ext = false) {
    const thisWreck = (ext && wreckExt) ? wreckExt : wreck
    return thisWreck
      .get(url, {
        json: true,
        headers: {
          'x-api-key': config.apiKey
        }
      })
      .then(response => {
        if (response.res.statusCode !== 200) {
          throw new Error('Requested resource returned a non 200 status code')
        }
        return response.payload
      })
  },
  postJson: function (url, payload, ext = false) {
    const thisWreck = (ext && wreckExt) ? wreckExt : wreck
    return thisWreck
      .post(url, {
        json: true,
        payload,
        headers: {
          'x-api-key': config.apiKey
        }
      })
      .then(response => {
        if (response.res.statusCode !== 200) {
          throw new Error('Requested resource returned a non 200 status code')
        }
        return response.payload
      })
  }
}
