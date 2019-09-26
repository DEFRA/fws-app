const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const services = require('../server/services')
const http = require('../server/http')

const sinon = require('sinon').createSandbox()

lab.experiment('Services', () => {
  lab.beforeEach(() => {
    // setup mocks
    // sinon.stub(http, 'getJson').callsFake(async () => {
    //   return Promise.resolve({})
    // })
  })

  lab.afterEach(() => {
    sinon.restore()
  })

  lab.test('Services: ', async () => {
    const floods = await services.getFloods()
    console.log(floods)
  })
})
