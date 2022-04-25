const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const composeServer = require('../server')
const config = require('../../server/config')

lab.experiment(('Training Env banner'), () => {
  let server

  lab.before(async () => {
    config.env = 'tra'
    server = await composeServer.start()
  })

  lab.after(() => {
    composeServer.stop()
  })

  const urls = [{
    url: '/',
    code: 200,
    text: [
      'This application version is for training only'
    ]
  }, {
    url: '/',
    code: 200,
    text: [
      'govuk-header-blue'
    ]
  }, {
    url: '/',
    code: 200,
    text: [
      'govuk-footer-blue'
    ]
  }]

  urls.forEach(item => {
    lab.test(`Training banner test: ${item.url} returns ${item.code}`, async () => {
      const response = await server.inject({
        method: item.method || 'GET',
        url: item.url,
        auth: item.auth,
        payload: item.payload
      })
      Code.expect(response.statusCode).to.equal(item.code)
      if (item.text && item.text.length > 0) {
        item.text.forEach(text => {
          Code.expect(response.payload).to.include(text)
        })
      }
    })
  })
})
