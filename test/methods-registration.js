const registerServerMethods = require('../server/services/methods')
const mockServer = {
  method: jest.fn()
}

jest.mock('../server/config', () => ({
  localCache: true
}))

describe('Services Methods - Cache Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register server methods when LOCAL_CACHE is true', () => {
    registerServerMethods(mockServer)

    expect(mockServer.method).toHaveBeenCalled()
    expect(mockServer.method).toHaveBeenCalledWith(
      'flood.getFloods',
      expect.any(Function),
      expect.any(Object)
    )
  })

  it('should register getFloodPlus method', () => {
    registerServerMethods(mockServer)

    const floodsPlusCalls = mockServer.method.mock.calls.filter(
      call => call[0] === 'flood.getFloodsPlus'
    )
    expect(floodsPlusCalls.length).toBe(1)
  })

  it('should register getHistoricFloods method', () => {
    registerServerMethods(mockServer)

    const historicCalls = mockServer.method.mock.calls.filter(
      call => call[0] === 'flood.getHistoricFloods'
    )
    expect(historicCalls.length).toBe(1)
  })

  it('should register getAllAreas method', () => {
    registerServerMethods(mockServer)

    const areasCalls = mockServer.method.mock.calls.filter(
      call => call[0] === 'flood.getAllAreas'
    )
    expect(areasCalls.length).toBe(1)
  })

  it('should register updateWarning method', () => {
    registerServerMethods(mockServer)

    const updateCalls = mockServer.method.mock.calls.filter(
      call => call[0] === 'flood.updateWarning'
    )
    expect(updateCalls.length).toBe(1)
  })

  it('should configure cache with undefined for local cache', () => {
    registerServerMethods(mockServer)

    const getFloodsCall = mockServer.method.mock.calls.find(
      call => call[0] === 'flood.getFloods'
    )
    const options = getFloodsCall[2]
    expect(options.cache.cache).toBeUndefined()
  })

  it('should configure methods with correct cache expiration', () => {
    registerServerMethods(mockServer)

    const getFloodsCall = mockServer.method.mock.calls.find(
      call => call[0] === 'flood.getFloods'
    )
    const options = getFloodsCall[2]
    expect(options.cache.expiresIn).toBe(1 * 60 * 1000)
  })

  it('should use the redis cache for cached methods when LOCAL_CACHE is false', () => {
    jest.resetModules()
    jest.doMock('../server/config', () => ({ localCache: false }))
    jest.doMock('../server/services', () => ({}))
    require('../server/services/methods')(mockServer)

    const cacheNames = Object.fromEntries(
      mockServer.method.mock.calls.map(([name, , options]) => [name, options?.cache?.cache])
    )
    expect(cacheNames).toEqual({
      'flood.getFloods': 'redis_cache',
      'flood.getFloodsPlus': 'redis_cache',
      'flood.getHistoricFloods': 'redis_cache',
      'flood.getAllAreas': 'redis_cache',
      'flood.updateWarning': undefined
    })
  })
})
