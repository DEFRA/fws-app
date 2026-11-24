const composeServer = require('./server')

describe('Update Warning Route - Branch Coverage', () => {
  let server

  beforeAll(async () => {
    server = await composeServer.start()
  })

  afterAll(async () => {
    await composeServer.stop()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const postLoginCredentials = {
    scope: ['manage:warnings'],
    isAdmin: true,
    profile: {
      id: 'test',
      displayName: 'Smith, John',
      email: 'john.smith@defra.net'
    }
  }

  // Profile object as transformed by the route handler
  const expectedProfile = {
    id: 'test',
    name: 'Smith, John',
    email: 'john.smith@defra.net'
  }

  it('should handle no severity selected', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: '',
        situation: 'test situation'
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Enter a valid severity')
  })

  it('should handle no situation entered', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 2,
        situation: ''
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Enter a valid situation')
  })

  it('should handle situation with special characters and call updateWarning', async () => {
    const updateSpy = jest.spyOn(server.methods.flood, 'updateWarning')
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 2,
        situation: "Test with special chars: <>&\"'"
      }
    })
    expect(response.statusCode).toBe(302)
    expect(updateSpy).toHaveBeenCalledWith('011FWFNC1D', 2, "Test with special chars: <>&\"'", expectedProfile)
  })

  it('should validate severity is numeric', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 'invalid',
        situation: 'test'
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Enter a valid severity')
  })

  it('should handle GET request to edit page', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/target-area/011WACN6/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('011WACN6')
  })

  it('should deny access without manage:warnings scope', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: {
          scope: ['other:scope'],
          isAdmin: false,
          profile: {
            id: 'test',
            displayName: 'Smith, John',
            email: 'john.smith@defra.net'
          }
        }
      },
      payload: {
        severity: 2,
        situation: 'test'
      }
    })
    expect(response.statusCode).toBe(403)
  })

  it('should validate severity value is in allowed range', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 99,
        situation: 'test'
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Enter a valid severity')
  })

  it('should handle GET request with authentication', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      }
    })
    expect(response.statusCode).toBe(200)
  })

  it('should update warning with valid data and invalidate caches', async () => {
    const updateSpy = jest.spyOn(server.methods.flood, 'updateWarning')
    const getFloodsDropSpy = jest.spyOn(server.methods.flood.getFloods.cache, 'drop')
    const getFloodsPlusDropSpy = jest.spyOn(server.methods.flood.getFloodsPlus.cache, 'drop')
    const getHistoricFloodsDropSpy = jest.spyOn(server.methods.flood.getHistoricFloods.cache, 'drop')

    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011WACN6/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 2,
        situation: 'New test situation'
      }
    })

    expect(response.statusCode).toBe(302)
    expect(updateSpy).toHaveBeenCalledWith('011WACN6', 2, 'New test situation', expectedProfile)
    expect(getFloodsDropSpy).toHaveBeenCalled()
    expect(getFloodsPlusDropSpy).toHaveBeenCalled()
    expect(getHistoricFloodsDropSpy).toHaveBeenCalledWith('011WACN6')
  })

  it('should update warning with severity 1 and invalidate caches', async () => {
    const updateSpy = jest.spyOn(server.methods.flood, 'updateWarning')
    const getFloodsDropSpy = jest.spyOn(server.methods.flood.getFloods.cache, 'drop')
    const getFloodsPlusDropSpy = jest.spyOn(server.methods.flood.getFloodsPlus.cache, 'drop')
    const getHistoricFloodsDropSpy = jest.spyOn(server.methods.flood.getHistoricFloods.cache, 'drop')

    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011WACN6/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 1,
        situation: 'Different test situation'
      }
    })

    expect(response.statusCode).toBe(302)
    expect(updateSpy).toHaveBeenCalledWith('011WACN6', 1, 'Different test situation', expectedProfile)
    expect(getFloodsDropSpy).toHaveBeenCalled()
    expect(getFloodsPlusDropSpy).toHaveBeenCalled()
    expect(getHistoricFloodsDropSpy).toHaveBeenCalledWith('011WACN6')
  })

  it('should update warning with severity 3 and invalidate caches', async () => {
    const updateSpy = jest.spyOn(server.methods.flood, 'updateWarning')
    const getFloodsDropSpy = jest.spyOn(server.methods.flood.getFloods.cache, 'drop')
    const getFloodsPlusDropSpy = jest.spyOn(server.methods.flood.getFloodsPlus.cache, 'drop')
    const getHistoricFloodsDropSpy = jest.spyOn(server.methods.flood.getHistoricFloods.cache, 'drop')

    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011WACN6/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 3,
        situation: 'Severe situation'
      }
    })

    expect(response.statusCode).toBe(302)
    expect(updateSpy).toHaveBeenCalledWith('011WACN6', 3, 'Severe situation', expectedProfile)
    expect(getFloodsDropSpy).toHaveBeenCalled()
    expect(getFloodsPlusDropSpy).toHaveBeenCalled()
    expect(getHistoricFloodsDropSpy).toHaveBeenCalledWith('011WACN6')
  })

  it('should update warning with severity 4 and invalidate caches', async () => {
    const updateSpy = jest.spyOn(server.methods.flood, 'updateWarning')
    const getFloodsDropSpy = jest.spyOn(server.methods.flood.getFloods.cache, 'drop')
    const getFloodsPlusDropSpy = jest.spyOn(server.methods.flood.getFloodsPlus.cache, 'drop')
    const getHistoricFloodsDropSpy = jest.spyOn(server.methods.flood.getHistoricFloods.cache, 'drop')

    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011WACN6/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 4,
        situation: 'No longer in force'
      }
    })

    expect(response.statusCode).toBe(302)
    expect(updateSpy).toHaveBeenCalledWith('011WACN6', 4, 'No longer in force', expectedProfile)
    expect(getFloodsDropSpy).toHaveBeenCalled()
    expect(getFloodsPlusDropSpy).toHaveBeenCalled()
    expect(getHistoricFloodsDropSpy).toHaveBeenCalledWith('011WACN6')
  })

  it('should validate severity at lower boundary', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 0,
        situation: 'test'
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Enter a valid severity')
  })

  it('should validate severity at upper boundary', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 5,
        situation: 'test'
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Enter a valid severity')
  })

  it('should validate severity is required', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        situation: 'test'
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Enter a valid severity')
  })

  it('should validate situation is required', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011FWFNC1D/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 2
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Enter a valid situation')
  })

  it('should update warning with long situation text and invalidate caches', async () => {
    const longSituation = 'A'.repeat(500)
    const updateSpy = jest.spyOn(server.methods.flood, 'updateWarning')
    const getFloodsDropSpy = jest.spyOn(server.methods.flood.getFloods.cache, 'drop')
    const getFloodsPlusDropSpy = jest.spyOn(server.methods.flood.getFloodsPlus.cache, 'drop')
    const getHistoricFloodsDropSpy = jest.spyOn(server.methods.flood.getHistoricFloods.cache, 'drop')

    const response = await server.inject({
      method: 'POST',
      url: '/target-area/011WACN6/edit',
      auth: {
        strategy: 'azure-legacy',
        credentials: postLoginCredentials
      },
      payload: {
        severity: 2,
        situation: longSituation
      }
    })

    expect(response.statusCode).toBe(302)
    expect(updateSpy).toHaveBeenCalledWith('011WACN6', 2, longSituation, expectedProfile)
    expect(getFloodsDropSpy).toHaveBeenCalled()
    expect(getFloodsPlusDropSpy).toHaveBeenCalled()
    expect(getHistoricFloodsDropSpy).toHaveBeenCalledWith('011WACN6')
  })
})
