import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import composeServer from '../server.js'
import config from '../../server/config.js'

describe('Training Env banner', () => {
  let server
  let originalEnv

  beforeAll(async () => {
    originalEnv = config.env
    config.env = 'tra'
    server = await composeServer.start()
  })

  afterAll(async () => {
    config.env = originalEnv
    await composeServer.stop()
  })

  test('shows the training environment banner', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.payload).toContain('This application version is for training only')
    expect(response.payload).toContain('govuk-header-blue')
    expect(response.payload).toContain('govuk-footer-blue')
    expect(response.statusCode).toBe(200)
  })
})
