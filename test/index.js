const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const createServer = require('../server')
const service = require('../server/services')

lab.experiment('Web test', () => {
  let server
  let sandbox

  // Create server before the tests.
  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  // Stop server after the tests.
  lab.after(async () => {
    await server.stop()
  })

  // Use a Sinon sandbox to manage spies, stubs and mocks for each test.
  lab.beforeEach(async () => {
    sandbox = sinon.createSandbox()
  })

  lab.afterEach(async () => {
    sandbox.restore()
  })

  lab.test('1 - GET / route works', async () => {
    const fwisJsonData = {
      warnings: [
        {
          situation: ' Flood Alert ',
          attr: { taId: 5765,
            taCode: '013WATDEE',
            taName: 'Dee Estuary from Parkgate to Chester',
            taDescription: 'Areas at risk include Parkgate, Neston and Puddington, continuing to Blacon and Saltney, Chester',
            quickDial: '205002',
            version: '1',
            state: 'A',
            taCategory: 'Flood Alert',
            ownerArea: 'Greater Manchester, Merseyside and Cheshire',
            createdDate: '2019-02-12T13:31:51.631Z',
            lastModifiedDate: '2019-02-12T13:31:51.631Z',
            situationChanged: '2019-04-24T10:31:00.000Z',
            severityChanged: '2019-04-24T10:31:00.000Z',
            timeMessageReceived: '2019-04-24T14:25:11.532Z',
            severityValue: '2',
            severity: 'Flood Warning'
          }
        }
      ]
    }

    const fwisStub = sandbox.stub(service, 'get')
    fwisStub.returns(fwisJsonData)

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.headers['content-type']).to.include('text/html')
  })

  lab.test('3 - GET / route fails simulating service not available ', async () => {
    const fwisStub = sandbox.stub(service, 'get')
    fwisStub.returns(null)

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(500)
  })

  lab.test('4 - GET / route fails with empty warning data', async () => {
    const fwisJsonData = {}

    const fwisStub = sandbox.stub(service, 'get')
    fwisStub.returns(fwisJsonData)

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(500)
    Code.expect(response.headers['content-type']).to.include('text/html')
  })
})
