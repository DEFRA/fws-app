const composeServer = require('../server')
const services = require('../server/services')

const mock = require('./mock')
const mocks = require('./mocks')
const data = require('./data')

const setMocks = () => {
  console.log('Mocking server')
  mocks.getFloods = mock.replace(services, 'getFloods', mock.makePromise(null, data.getFloods))
  mocks.getHistoricFloods = mock.replace(services, 'getHistoricFloods', mock.makePromise(null, data.getHistoricFloods))
  mocks.getAllAreas = mock.replace(services, 'getAllAreas', mock.makePromise(null, data.getAllAreas))
  mocks.updateWarning = mock.replace(services, 'updateWarning', mock.makePromise(null, data.updateWarning))
}

const setErrorMocks = () => {
  console.log('Error mocking server')
  mocks.getFloods = mock.replace(services, 'getFloods', mock.makePromise(new Error('Failed to get floods')))
  mocks.getHistoricFloods = mock.replace(services, 'getHistoricFloods', mock.makePromise(new Error('Failed to get historic floods')))
  mocks.getAllAreas = mock.replace(services, 'getAllAreas', mock.makePromise(new Error('Failed to get all areas')))
  mocks.updateWarning = mock.replace(services, 'updateWarning', mock.makePromise(new Error('Failed to update warning')))
}

let server

module.exports = {
  start: async () => {
    console.log('Creating server')
    setMocks()
    server = await composeServer()
    return server
  },
  stop: () => {
    console.log('Stopping server')
    return server.stop()
  },
  setErrorMocks: setErrorMocks
}
