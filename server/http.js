const config = require('./config')

// Timeout is high to accomodate the use of lambda backend functions
const timeout = 30 * 1000

const wreck = require('@hapi/wreck').defaults({
  timeout
})

module.exports = {
  getJson: function (url) {
    return wreck
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
  postJson: function (url, payload) {
    return wreck
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
