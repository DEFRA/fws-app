const data = require('./data')
const services = require('../server/services')
const http = require('../server/http')

describe('Services', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Services: getFloods', async () => {
    jest.spyOn(http, 'getJson').mockResolvedValue(data.getFloods)
    const floods = await services.getFloods()
    expect(floods.warnings.length).toBe(57)
  })

  it('Services: getFloodsPlus', async () => {
    jest.spyOn(http, 'getJson').mockResolvedValue(data.getFloodsPlus)
    const floods = await services.getFloodsPlus()
    expect(floods.warnings.length).toBe(57)
  })

  it('Services: getHistoricFloods', async () => {
    jest.spyOn(http, 'getJson').mockResolvedValue(data.getHistoricFloods)
    const historicFloods = await services.getHistoricFloods()
    expect(historicFloods.warnings.length).toBe(67)
  })

  it('Services: getAllAreas', async () => {
    jest.spyOn(http, 'getJson').mockResolvedValue(data.targetAreas)
    const areas = await services.getAllAreas()
    expect(areas.areas.length).toBe(14)
    expect(areas.areas[0].name).toBe('Cumbria and Lancashire')
    expect(areas.areas[13].name).toBe('Yorkshire')
    expect(areas.targetAreas.length).toBe(100)
    expect(areas.targetAreas[0].ta_code).toBe('011WACN5')
    expect(areas.targetAreas[99].ta_code).toBe('122FWF526')
  })

  it('Services: updateWarning', async () => {
    jest.spyOn(http, 'postJson').mockImplementation((url, payload, ext) => {
      expect(payload.bodyXml).toContain('<TargetAreaCode><![CDATA[test]]></TargetAreaCode>')
      expect(payload.bodyXml).toContain('<SeverityLevel>1</SeverityLevel>')
      expect(payload.bodyXml).toContain('<InternetSituation><![CDATA[Test situation]]></InternetSituation>')
      expect(payload.profile.id).toBe('test')
      expect(payload.profile.name).toBe('John Smith')
      expect(payload.profile.email).toBe('john.smith@defra.net')
      return Promise.resolve({})
    })

    await services.updateWarning('test', 1, 'Test situation', { id: 'test', name: 'John Smith', email: 'john.smith@defra.net' })
    expect(http.postJson).toHaveBeenCalledTimes(1)
  })
})
