import { describe, test, expect, afterEach, vi } from 'vitest'
import data from './data/index.js'

// Shared by the local-cache and Redis-cache service tests.
// getModules is called lazily because the Redis test only loads the modules once the server has started.
export function servicesSuite (getModules) {
  describe('Services', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    test('getFloods', async () => {
      const { services, http } = getModules()
      vi.spyOn(http, 'getJson').mockResolvedValue(data.getFloods)
      const floods = await services.getFloods()
      expect(floods.warnings.length).toBe(57)
    })

    test('getFloodsPlus', async () => {
      const { services, http } = getModules()
      vi.spyOn(http, 'getJson').mockResolvedValue(data.getFloodsPlus)
      const floods = await services.getFloodsPlus()
      expect(floods.warnings.length).toBe(57)
    })

    test('getHistoricFloods', async () => {
      const { services, http } = getModules()
      vi.spyOn(http, 'getJson').mockResolvedValue(data.getHistoricFloods)
      const historicFloods = await services.getHistoricFloods()
      expect(historicFloods.warnings.length).toBe(67)
    })

    test('getAllAreas', async () => {
      const { services, http } = getModules()
      vi.spyOn(http, 'getJson').mockResolvedValue(data.targetAreas)
      const areas = await services.getAllAreas()
      expect(areas.areas.length).toBe(14)
      expect(areas.areas[0].name).toBe('Cumbria and Lancashire')
      expect(areas.areas[13].name).toBe('Yorkshire')
      expect(areas.targetAreas.length).toBe(100)
      expect(areas.targetAreas[0].ta_code).toBe('011WACN5')
      expect(areas.targetAreas[99].ta_code).toBe('122FWF526')
    })

    test('updateWarning', async () => {
      const { services, http } = getModules()
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
}
