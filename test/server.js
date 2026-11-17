import { vi } from 'vitest'
import data from './data/index.js'

// The server and services modules are imported lazily so that they pick up the
// current value of process.env.LOCAL_CACHE (set to true by default in vitest.config.js).
// To achieve full test coverage for Redis connectivity, the initRedisCache function
// can be used to connect to a containerised Redis instance.
const spies = []
let server

const loadModules = async () => {
  const { default: composeServer } = await import('../server/index.js')
  const { default: services } = await import('../server/services/index.js')
  return { composeServer, services }
}

const spy = (services, name) => {
  const s = vi.spyOn(services, name)
  spies.push(s)
  return s
}

const setMocks = (services) => {
  console.log('Mocking server')
  spy(services, 'getFloods').mockResolvedValue(data.getFloods)
  spy(services, 'getFloodsPlus').mockResolvedValue(data.getFloodsPlus)
  spy(services, 'getHistoricFloods').mockResolvedValue(data.getHistoricFloods)
  spy(services, 'getAllAreas').mockResolvedValue(data.getAllAreas)
  spy(services, 'updateWarning').mockResolvedValue()
}

const setErrorMocks = (services) => {
  console.log('Mocking server with errors')
  spy(services, 'getFloods').mockRejectedValue(new Error('Failed to get floods'))
  spy(services, 'getFloodsPlus').mockRejectedValue(new Error('Failed to get floods plus'))
  spy(services, 'getHistoricFloods').mockRejectedValue(new Error('Failed to get historic floods'))
  spy(services, 'getAllAreas').mockRejectedValue(new Error('Failed to get all areas'))
  spy(services, 'updateWarning').mockRejectedValue(new Error('Failed to update warning'))
}

const clearMocks = () => {
  spies.splice(0).forEach(s => s.mockRestore())
}

export default {
  initRedisCache: () => {
    process.env.LOCAL_CACHE = 'false'

    // Discard cached modules so that the server and services
    // are loaded again using the new LOCAL_CACHE value.
    vi.resetModules()
  },
  start: async (err = false, useMocks = true) => {
    console.log('Starting server')
    const { composeServer, services } = await loadModules()
    // When testing server method configuration, useMocks must
    // be set to false so that the mocks in this file do not
    // override the mocks in the server method configuration test
    // files.
    if (useMocks) {
      err ? setErrorMocks(services) : setMocks(services)
    }
    server = await composeServer()
    await server.initialize()
    return server
  },
  stop: async () => {
    console.log('Stopping server')
    clearMocks()
    await server.stop()
  }
}
