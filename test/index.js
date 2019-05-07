const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const createServer = require('../server')
const fwisService = require('../server/services/fwis')
const wsService = require('../server/services/web-socket')

lab.experiment('Web test', () => {
  let server

  // Create server before the tests
  lab.before(async () => {
    server = await createServer()
  })

  // Stop server after the tests.
  lab.after(async () => {
    await server.stop()
  })

  lab.test('GET / route works', async () => {
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

    let fwisStub = sinon.stub(fwisService, 'get')
    fwisStub.returns(fwisJsonData)

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.headers['content-type']).to.include('text/html')
    fwisStub.reset()
  })

  lab.test('GET /api/update-warnings route works', async () => {
    const wsJsonData = {}

    let wsStub = sinon.stub(wsService, 'publishWarnings')
    wsStub.returns(wsJsonData)

    const options = {
      method: 'POST',
      url: '/api/update-warnings'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.headers['content-type']).to.include('text/html')
    wsStub.reset()
  })

  lab.test('GET / route fails ', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(500)
  })
})
