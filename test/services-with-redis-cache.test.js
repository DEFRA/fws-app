import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import data from './data/index.js'
import composeServer from './server.js'

let http
let services

describe('Services', () => {
  beforeAll(async () => {
    composeServer.initRedisCache()
    // Start the server ensuring that the server method mocks in this file are used rather than those in ./server.js.
    await composeServer.start(false, false)
    // Import after initRedisCache so that the freshly loaded modules are the ones the server uses.
    services = (await import('../server/services/index.js')).default
    http = (await import('../server/http.js')).default
  })

  afterAll(async () => {
    await composeServer.stop()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('Services: getFloods', async () => {
    vi.spyOn(http, 'getJson').mockResolvedValue(data.getFloods)
    const floods = await services.getFloods()
    expect(floods.warnings.length).toBe(57)
  })

  test('Services: getFloodsPlus', async () => {
    vi.spyOn(http, 'getJson').mockResolvedValue(data.getFloodsPlus)
    const floods = await services.getFloodsPlus()
    expect(floods.warnings.length).toBe(57)
  })

  test('Services: getHistoricFloods', async () => {
    vi.spyOn(http, 'getJson').mockResolvedValue(data.getHistoricFloods)
    const historicFloods = await services.getHistoricFloods()
    expect(historicFloods.warnings.length).toBe(67)
  })

  test('Services: getAllAreas', async () => {
    vi.spyOn(http, 'getJson').mockResolvedValue(data.targetAreas)
    const areas = await services.getAllAreas()
    expect(areas.areas.length).toBe(14)
    expect(areas.areas[0].name).toBe('Cumbria and Lancashire')
    expect(areas.areas[13].name).toBe('Yorkshire')
    expect(areas.targetAreas.length).toBe(100)
    expect(areas.targetAreas[0].ta_code).toBe('011WACN5')
    expect(areas.targetAreas[99].ta_code).toBe('122FWF526')
  })

  test('Services: updateWarning', async () => {
    const postJson = vi.spyOn(http, 'postJson').mockResolvedValue({})
    const profile = { id: 'test', name: 'John Smith', email: 'john.smith@defra.net' }

    await services.updateWarning('test', 1, 'Test situation', profile)

    expect(postJson).toHaveBeenCalledOnce()
    const [, payload] = postJson.mock.calls[0]
    expect(payload.bodyXml).toContain('<TargetAreaCode><![CDATA[test]]></TargetAreaCode>')
    expect(payload.bodyXml).toContain('<SeverityLevel>1</SeverityLevel>')
    expect(payload.bodyXml).toContain('<InternetSituation><![CDATA[Test situation]]></InternetSituation>')
    expect(payload.profile).toEqual(profile)
  })
})
