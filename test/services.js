const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const sinon = require('sinon')
const data = require('./data')
const services = require('../server/services')
const http = require('../server/http')

let httpStubs = []

lab.experiment('Services', () => {
  lab.afterEach(() => {
    httpStubs.forEach(stub => stub.restore())
    httpStubs = []
  })

  lab.test('Services: getFloods', async () => {
    httpStubs.push(sinon.stub(http, 'getJson').resolves(data.getFloods))
    const floods = await services.getFloods()
    Code.expect(floods.warnings.length).to.equal(57)
  })

  lab.test('Services: getFloodsPlus', async () => {
    httpStubs.push(sinon.stub(http, 'getJson').resolves(data.getFloodsPlus))
    const floods = await services.getFloodsPlus()
    Code.expect(floods.warnings.length).to.equal(57)
  })

  lab.test('Services: getHistoricFloods', async () => {
    httpStubs.push(sinon.stub(http, 'getJson').resolves(data.getHistoricFloods))
    const historicFloods = await services.getHistoricFloods()
    Code.expect(historicFloods.warnings.length).to.equal(67)
  })

  lab.test('Services: getAllAreas', async () => {
    httpStubs.push(sinon.stub(http, 'getJson').resolves(data.targetAreas))
    const areas = await services.getAllAreas()
    Code.expect(areas.areas.length).to.equal(14)
    Code.expect(areas.areas[0].name).to.equal('Cumbria and Lancashire')
    Code.expect(areas.areas[13].name).to.equal('Yorkshire')
    Code.expect(areas.targetAreas.length).to.equal(100)
    Code.expect(areas.targetAreas[0].ta_code).to.equal('011WACN5')
    Code.expect(areas.targetAreas[99].ta_code).to.equal('122FWF526')
  })

  lab.test('Services: updateWarning', async () => {
    httpStubs.push(sinon.stub(http, 'postJson').callsFake((url, payload, ext) => {
      Code.expect(payload.bodyXml).to.include('<TargetAreaCode><![CDATA[test]]></TargetAreaCode>')
      Code.expect(payload.bodyXml).to.include('<SeverityLevel>1</SeverityLevel>')
      Code.expect(payload.bodyXml).to.include('<InternetSituation><![CDATA[Test situation]]></InternetSituation>')
      Code.expect(payload.profile.id).to.equal('test')
      Code.expect(payload.profile.name).to.equal('John Smith')
      Code.expect(payload.profile.email).to.equal('john.smith@defra.net')
      return Promise.resolve({})
    }))

    await services.updateWarning('test', 1, 'Test situation', { id: 'test', name: 'John Smith', email: 'john.smith@defra.net' })
  })
})
