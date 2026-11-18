import { describe, test, expect, vi, afterEach } from 'vitest'

describe('Config.js', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  test('Config.js error thrown', async () => {
    vi.stubEnv('FWS_API_URL', 'sfsdfs')
    vi.resetModules()

    await expect(import('../server/config.js'))
      .rejects.toThrow('The server config is invalid. "api" must be a valid uri')
  })
})
