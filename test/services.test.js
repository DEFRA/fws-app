import { describe } from 'vitest'
import { servicesSuite } from './services-suite.js'
import services from '../server/services/index.js'
import http from '../server/http.js'

describe('with local cache', () => {
  servicesSuite(() => ({ services, http }))
})
