const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const composeServer = require('./server')

lab.experiment(('All basic routes'), () => {
  let server
  lab.before(async () => {
    server = await composeServer.start()
  })

  lab.after(() => {
    composeServer.stop()
  })

  lab.test('1st test fml', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })
    Code.expect(response.statusCode).to.equal(200)
  })
})
