const composeServer = require('../server')
const services = require('../server/services')

const mock = require('./mock')
const mocks = {}
const data = require('./data')

const setMocks = () => {
  console.log('Mocking server')
  mocks.getFloods = mock.replace(services, 'getFloods', mock.makePromise(null, data.getFloods))
  mocks.getHistoricFloods = mock.replace(services, 'getHistoricFloods', mock.makePromise(null, data.getHistoricFloods))
  mocks.getAllAreas = mock.replace(services, 'getAllAreas', mock.makePromise(null, data.getAllAreas))
  mocks.updateWarning = mock.replace(services, 'updateWarning', mock.makePromise())
}

const setErrorMocks = async () => {
  console.log('Mocking server with errors')
  mocks.getFloods = mock.replace(services, 'getFloods', mock.makePromise(new Error('Failed to get floods')))
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
  start: async (err = false) => {
    console.log('Starting server')
    err ? setErrorMocks() : setMocks()
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
