// Force tests to use server object cache by default
// To achieve full test coverage for Redis connectivity, the initRedisCache function
// can be used to connect to a containerised Redis instance.
process.env.LOCAL_CACHE = true

const mock = require('./mock')
const mocks = {}
const data = require('./data')

let composeServer = require('../server')
let services = require('../server/services')

const setMocks = () => {
  console.log('Mocking server')
  mocks.getFloods = mock.replace(services, 'getFloods', mock.makePromise(null, data.getFloods))
  mocks.getFloodPlus = mock.replace(services, 'getFloodsPlus', mock.makePromise(null, data.getFloodsPlus))
  mocks.getHistoricFloods = mock.replace(services, 'getHistoricFloods', mock.makePromise(null, data.getHistoricFloods))
  mocks.getAllAreas = mock.replace(services, 'getAllAreas', mock.makePromise(null, data.getAllAreas))
  mocks.updateWarning = mock.replace(services, 'updateWarning', mock.makePromise())
}

const setErrorMocks = async () => {
  console.log('Mocking server with errors')
  mocks.getFloods = mock.replace(services, 'getFloods', mock.makePromise(new Error('Failed to get floods')))
  mocks.getFloodsPlus = mock.replace(services, 'getFloodsPlus', mock.makePromise(new Error('Failed to get floods plus')))
  mocks.getHistoricFloods = mock.replace(services, 'getHistoricFloods', mock.makePromise(new Error('Failed to get historic floods')))
  mocks.getAllAreas = mock.replace(services, 'getAllAreas', mock.makePromise(new Error('Failed to get all areas')))
  mocks.updateWarning = mock.replace(services, 'updateWarning', mock.makePromise(new Error('Failed to update warning')))
}

const clearMocks = () => {
  Object.keys(mocks).forEach((key) => {
    mocks[key].revert()
  })
}

let server

module.exports = {
  initRedisCache: () => {
    delete require.cache[require.resolve('../server')]
    delete require.cache[require.resolve('../server/services')]
    process.env.LOCAL_CACHE = false

    // Load the server and services modules so
    // that they use the current value of
    // process.env.LOCAL_CACHE.
    composeServer = require('../server')
    services = require('../server/services')
  },
  start: async (err = false, useMocks = true) => {
    console.log('Starting server')
    // When testing server method configuration, useMocks must
    // be set to false so that the mocks in this file do not
    // override the mocks in the server method configuration test
    // files.
    if (useMocks) {
      err ? setErrorMocks() : setMocks()
    }
    server = await composeServer()
    await server.initialize()
    return server
  },
  stop: () => {
    console.log('Stopping server')
    clearMocks()
    return server.stop()
  }
}
