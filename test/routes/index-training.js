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

  lab.test('trainning env', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    Code.expect(response.payload).to.contain('This application version is for training only')
    Code.expect(response.payload).to.contain('govuk-header-blue')
    Code.expect(response.payload).to.contain('govuk-footer-blue')
    Code.expect(response.statusCode).to.equal(200)
  })
})
