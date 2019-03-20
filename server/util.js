const config = require('./config')
const HttpsProxyAgent = require('https-proxy-agent')

const wreck = require('wreck').defaults({
  timeout: 10000
})
let wreckExt
if (config.proxy) {
  wreckExt = require('wreck').defaults({
    timeout: 10000,
    agent: new HttpsProxyAgent(config.proxy)
  })
}

module.exports = {
  getJson: function (url, ext = false) {
    const thisWreck = (ext && wreckExt) ? wreckExt : wreck
    return thisWreck.get(url, {
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
  }
}
