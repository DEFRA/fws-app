// Force tests to use server object cache by default
// To achieve full test coverage for Redis connectivity, the initRedisCache function
// can be used to connect to a containerised Redis instance.
process.env.LOCAL_CACHE = true

const sinon = require('sinon')
const data = require('./data')

let composeServer = require('../server')
const services = require('../server/services')

let server
let stubs = []

module.exports = {
  initRedisCache: () => {
    delete require.cache[require.resolve('../server')]
    delete require.cache[require.resolve('../server/services')]
    process.env.LOCAL_CACHE = false

    // Load the server and services modules so
    // that they use the current value of
    // process.env.LOCAL_CACHE.
    composeServer = require('../server')
  },
  start: async (err = false, useMocks = true) => {
    console.log('Starting server')
    // When testing server method configuration, useMocks must
    // be set to false so that the mocks in this file do not
    // override the mocks in the server method configuration test
    // files.
    if (useMocks) {
      if (err) {
        console.log('Mocking server with errors')
        stubs.push(sinon.stub(services, 'getFloods').rejects(new Error('Failed to get floods')))
        stubs.push(sinon.stub(services, 'getFloodsPlus').rejects(new Error('Failed to get floods plus')))
        stubs.push(sinon.stub(services, 'getHistoricFloods').rejects(new Error('Failed to get historic floods')))
        stubs.push(sinon.stub(services, 'getAllAreas').rejects(new Error('Failed to get all areas')))
        stubs.push(sinon.stub(services, 'updateWarning').rejects(new Error('Failed to update warning')))
      } else {
        console.log('Mocking server')
        stubs.push(sinon.stub(services, 'getFloods').resolves(data.getFloods))
        stubs.push(sinon.stub(services, 'getFloodsPlus').resolves(data.getFloodsPlus))
        stubs.push(sinon.stub(services, 'getHistoricFloods').resolves(data.getHistoricFloods))
        stubs.push(sinon.stub(services, 'getAllAreas').resolves(data.getAllAreas))
        stubs.push(sinon.stub(services, 'updateWarning').resolves())
      }
    }

    server = await composeServer()
    await server.initialize()
    return server
  },
  stop: () => {
    console.log('Stopping server')
    stubs.forEach(stub => stub.restore())
    stubs = []
    return server.stop()
  },
  getStubs: () => stubs
}
