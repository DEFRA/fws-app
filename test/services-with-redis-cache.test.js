import { describe, beforeAll, afterAll } from 'vitest'
import { servicesSuite } from './services-suite.js'
import composeServer from './server.js'

let modules

describe('with Redis cache', () => {
  beforeAll(async () => {
    composeServer.initRedisCache()
    // Start the server ensuring that the server method mocks in ./server.js are not applied.
    await composeServer.start(false, false)
    // Import after initRedisCache so that the freshly loaded modules are the ones the server uses.
    modules = {
      services: (await import('../server/services/index.js')).default,
      http: (await import('../server/http.js')).default
    }
  })

  afterAll(async () => {
    await composeServer.stop()
  })

  servicesSuite(() => modules)
})
