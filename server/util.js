const config = require('./config')
const HttpsProxyAgent = require('https-proxy-agent')

const wreck = require('wreck').defaults({
  timeout: 10000
})
let wreckExt
if (config.proxy) {
  wreckExt = require('wreck').defaults({
    timeout: 20000, // TODO: this needs to be reduced at some point
    agent: new HttpsProxyAgent(config.proxy)
  })
}

module.exports = {
  getJson: function (url, ext = false) {
    console.log('Hitting: ' + url)
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
        // console.log('Warnings count: ' + response.payload.warnings.length || 0)
        // console.log(JSON.stringify(response.payload))
        return response.payload
      })
  }
}
