const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const data = require('./data')
const services = require('../server/services')
const http = require('../server/http')
const mock = require('./mock')
const mocks = {}

lab.experiment('Services', () => {
  lab.beforeEach(() => {
    // mocks.getJson = mock.replace(http, 'getJson', mock.makePromise(null, {}))
    // mocks.postJson = mock.replace(http, 'postJson', mock.makePromise(null, {}))
  })
  lab.afterEach(() => {
    Object.keys(mocks).forEach((key) => {
      mocks[key].revert()
    })
  })

  lab.test('Services: getFloods', async () => {
    mocks.getJson = mock.replace(http, 'getJson', mock.makePromise(null, data.getFloods))
    const floods = await services.getFloods()
    Code.expect(floods.warnings.length).to.equal(57)
  })

  lab.test('Services: getFloodsPlus', async () => {
    mocks.getJson = mock.replace(http, 'getJson', mock.makePromise(null, data.getFloodsPlus))
    const floods = await services.getFloodsPlus()
    Code.expect(floods.warnings.length).to.equal(57)
  })

  lab.test('Services: getHistoricFloods', async () => {
    mocks.getJson = mock.replace(http, 'getJson', mock.makePromise(null, data.getHistoricFloods))
    const historicFloods = await services.getHistoricFloods()
    Code.expect(historicFloods.warnings.length).to.equal(67)
  })

  lab.test('Services: getAllAreas', async () => {
    mocks.getJson = mock.replace(http, 'getJson', mock.makePromise(null, data.targetAreas))
    const areas = await services.getAllAreas()
    Code.expect(areas.areas.length).to.equal(14)
    Code.expect(areas.areas[0].name).to.equal('Cumbria and Lancashire')
    Code.expect(areas.areas[13].name).to.equal('Yorkshire')
    Code.expect(areas.targetAreas.length).to.equal(100)
    Code.expect(areas.targetAreas[0].ta_code).to.equal('011WACN5')
    Code.expect(areas.targetAreas[99].ta_code).to.equal('122FWF526')
  })

  lab.test('Services: updateWarning', async () => {
    mocks.postJson = mock.replace(http, 'postJson', (url, payload, ext) => {
      Code.expect(payload.bodyXml).to.include('<TargetAreaCode><![CDATA[test]]></TargetAreaCode>')
      Code.expect(payload.bodyXml).to.include('<SeverityLevel>1</SeverityLevel>')
      Code.expect(payload.bodyXml).to.include('<InternetSituation><![CDATA[Test situation]]></InternetSituation>')
      Code.expect(payload.profile.id).to.equal('test')
      Code.expect(payload.profile.name).to.equal('John Smith')
      Code.expect(payload.profile.email).to.equal('john.smith@defra.net')
      return new Promise((resolve, reject) => {
        resolve({})
      })
    })

    await services.updateWarning('test', 1, 'Test situation', { id: 'test', name: 'John Smith', email: 'john.smith@defra.net' })
  })
})
