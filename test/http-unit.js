describe('HTTP Module', () => {
  let http
  let wreckMock

  beforeEach(() => {
    jest.resetModules()

    // Mock config before requiring http
    jest.doMock('../server/config', () => ({
      apiKey: 'test-key',
      proxy: null
    }))

    // Mock wreck before requiring http
    wreckMock = {
      get: jest.fn(),
      post: jest.fn()
    }

    jest.doMock('@hapi/wreck', () => ({
      defaults: jest.fn(() => wreckMock)
    }))

    jest.doMock('https-proxy-agent', () => ({
      HttpsProxyAgent: jest.fn()
    }))

    http = require('../server/http')
  })

  afterEach(() => {
    jest.dontMock('../server/config')
    jest.dontMock('@hapi/wreck')
    jest.dontMock('https-proxy-agent')
  })

  describe('getJson', () => {
    it('should return payload when status is 200', async () => {
      const expectedPayload = { data: 'test' }
      wreckMock.get.mockResolvedValueOnce({
        res: { statusCode: 200 },
        payload: expectedPayload
      })

      const result = await http.getJson('http://example.com/api')

      expect(result).toEqual(expectedPayload)
      expect(wreckMock.get).toHaveBeenCalledWith(
        'http://example.com/api',
        expect.objectContaining({
          json: true,
          headers: { 'x-api-key': 'test-key' }
        })
      )
    })

    it('should throw error when status is not 200', async () => {
      wreckMock.get.mockResolvedValueOnce({
        res: { statusCode: 500 },
        payload: null
      })

      await expect(http.getJson('http://example.com/api')).rejects.toThrow(
        'Requested resource returned a non 200 status code'
      )
    })

    it('should handle 404 status', async () => {
      wreckMock.get.mockResolvedValueOnce({
        res: { statusCode: 404 },
        payload: null
      })

      await expect(http.getJson('http://example.com/api')).rejects.toThrow(
        'Requested resource returned a non 200 status code'
      )
    })

    it('should handle 201 status', async () => {
      wreckMock.get.mockResolvedValueOnce({
        res: { statusCode: 201 },
        payload: null
      })

      await expect(http.getJson('http://example.com/api')).rejects.toThrow()
    })

    it('should handle ext parameter', async () => {
      const expectedPayload = { data: 'test' }
      wreckMock.get.mockResolvedValueOnce({
        res: { statusCode: 200 },
        payload: expectedPayload
      })

      const result = await http.getJson('http://example.com/api', true)

      expect(result).toEqual(expectedPayload)
      // No proxy is configured, so external requests fall back to the regular client
      expect(wreckMock.get).toHaveBeenCalledTimes(1)
    })

    it('should include x-api-key header', async () => {
      const expectedPayload = { data: 'test' }
      wreckMock.get.mockResolvedValueOnce({
        res: { statusCode: 200 },
        payload: expectedPayload
      })

      await http.getJson('http://example.com/api')

      expect(wreckMock.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': 'test-key'
          })
        })
      )
    })
  })

  describe('postJson', () => {
    it('should return payload when status is 200', async () => {
      const expectedPayload = { result: 'success' }
      const postPayload = { key: 'value' }
      wreckMock.post.mockResolvedValueOnce({
        res: { statusCode: 200 },
        payload: expectedPayload
      })

      const result = await http.postJson('http://example.com/api', postPayload)

      expect(result).toEqual(expectedPayload)
      expect(wreckMock.post).toHaveBeenCalledWith(
        'http://example.com/api',
        expect.objectContaining({
          json: true,
          payload: postPayload,
          headers: { 'x-api-key': 'test-key' }
        })
      )
    })

    it('should throw error when status is not 200', async () => {
      wreckMock.post.mockResolvedValueOnce({
        res: { statusCode: 500 },
        payload: null
      })

      await expect(http.postJson('http://example.com/api', {})).rejects.toThrow(
        'Requested resource returned a non 200 status code'
      )
    })

    it('should handle ext parameter', async () => {
      const expectedPayload = { result: 'success' }
      wreckMock.post.mockResolvedValueOnce({
        res: { statusCode: 200 },
        payload: expectedPayload
      })

      const result = await http.postJson('http://example.com/api', {}, true)

      expect(result).toEqual(expectedPayload)
      // No proxy is configured, so external requests fall back to the regular client
      expect(wreckMock.post).toHaveBeenCalledTimes(1)
    })

    it('should handle different status codes', async () => {
      const statusCodes = [201, 204, 400, 401, 403, 404, 502, 503]

      for (const statusCode of statusCodes) {
        wreckMock.post.mockResolvedValueOnce({
          res: { statusCode },
          payload: null
        })

        await expect(http.postJson('http://example.com/api', {})).rejects.toThrow(
          'Requested resource returned a non 200 status code'
        )
      }
    })

    it('should send correct payload structure', async () => {
      const postPayload = { username: 'test', email: 'test@example.com' }
      wreckMock.post.mockResolvedValueOnce({
        res: { statusCode: 200 },
        payload: { success: true }
      })

      await http.postJson('http://example.com/api', postPayload)

      expect(wreckMock.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          payload: postPayload
        })
      )
    })

    it('should include json flag', async () => {
      wreckMock.post.mockResolvedValueOnce({
        res: { statusCode: 200 },
        payload: {}
      })

      await http.postJson('http://example.com/api', {})

      expect(wreckMock.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          json: true
        })
      )
    })
  })
})

describe('HTTP Module with Proxy Configuration', () => {
  it('should initialize wreckExt when proxy is configured', () => {
    jest.resetModules()

    const wreckMock = {
      get: jest.fn(),
      post: jest.fn()
    }

    const HttpsProxyAgentMock = jest.fn()

    jest.doMock('../server/config', () => ({
      apiKey: 'test-key',
      proxy: 'http://proxy.example.com:8080'
    }))

    jest.doMock('@hapi/wreck', () => ({
      defaults: jest.fn(() => wreckMock)
    }))

    jest.doMock('https-proxy-agent', () => ({
      HttpsProxyAgent: HttpsProxyAgentMock
    }))

    require('../server/http')

    // Verify that wreck.defaults was called twice - once for regular wreck, once for wreckExt
    const wreck = require('@hapi/wreck')
    expect(wreck.defaults).toHaveBeenCalledTimes(2)
    expect(wreck.defaults).toHaveBeenNthCalledWith(1, { timeout: 30000 })
    expect(HttpsProxyAgentMock).toHaveBeenCalledWith('http://proxy.example.com:8080')
    expect(wreck.defaults).toHaveBeenNthCalledWith(2, {
      timeout: 30000,
      agent: HttpsProxyAgentMock.mock.instances[0]
    })

    jest.dontMock('../server/config')
    jest.dontMock('@hapi/wreck')
    jest.dontMock('https-proxy-agent')
  })

  it('should use regular wreck for non-proxy requests when proxy is configured', async () => {
    jest.resetModules()

    const regularWreckMock = {
      get: jest.fn(),
      post: jest.fn()
    }

    const proxyWreckMock = {
      get: jest.fn(),
      post: jest.fn()
    }

    const HttpsProxyAgentMock = jest.fn()

    jest.doMock('../server/config', () => ({
      apiKey: 'test-key',
      proxy: 'http://proxy.example.com:8080'
    }))

    jest.doMock('@hapi/wreck', () => ({
      defaults: jest.fn((opts) => {
        return opts.agent ? proxyWreckMock : regularWreckMock
      })
    }))

    jest.doMock('https-proxy-agent', () => ({
      HttpsProxyAgent: HttpsProxyAgentMock
    }))

    const http = require('../server/http')

    regularWreckMock.get.mockResolvedValueOnce({
      res: { statusCode: 200 },
      payload: { data: 'test-get' }
    })
    regularWreckMock.post.mockResolvedValueOnce({
      res: { statusCode: 200 },
      payload: { data: 'test-post' }
    })

    await http.getJson('http://example.com/api', false)
    await http.postJson('http://example.com/api', { test: 'data' }, false)

    expect(regularWreckMock.get).toHaveBeenCalledWith(
      'http://example.com/api',
      expect.objectContaining({
        json: true,
        headers: { 'x-api-key': 'test-key' }
      })
    )
    expect(regularWreckMock.post).toHaveBeenCalledWith(
      'http://example.com/api',
      expect.objectContaining({
        json: true,
        payload: { test: 'data' },
        headers: { 'x-api-key': 'test-key' }
      })
    )
    expect(proxyWreckMock.get).not.toHaveBeenCalled()
    expect(proxyWreckMock.post).not.toHaveBeenCalled()

    jest.dontMock('../server/config')
    jest.dontMock('@hapi/wreck')
    jest.dontMock('https-proxy-agent')
  })

  it('should use proxy wreck for proxy requests when proxy is configured', async () => {
    jest.resetModules()

    const regularWreckMock = {
      get: jest.fn(),
      post: jest.fn()
    }

    const proxyWreckMock = {
      get: jest.fn(),
      post: jest.fn()
    }

    const HttpsProxyAgentMock = jest.fn()

    jest.doMock('../server/config', () => ({
      apiKey: 'test-key',
      proxy: 'http://proxy.example.com:8080'
    }))

    jest.doMock('@hapi/wreck', () => ({
      defaults: jest.fn((opts) => {
        return opts.agent ? proxyWreckMock : regularWreckMock
      })
    }))

    jest.doMock('https-proxy-agent', () => ({
      HttpsProxyAgent: HttpsProxyAgentMock
    }))

    const http = require('../server/http')

    proxyWreckMock.get.mockResolvedValueOnce({
      res: { statusCode: 200 },
      payload: { data: 'test-get' }
    })
    proxyWreckMock.post.mockResolvedValueOnce({
      res: { statusCode: 200 },
      payload: { data: 'test-post' }
    })

    await http.getJson('http://example.com/api', true)
    await http.postJson('http://example.com/api', { test: 'data' }, true)

    expect(proxyWreckMock.get).toHaveBeenCalledWith(
      'http://example.com/api',
      expect.objectContaining({
        json: true,
        headers: { 'x-api-key': 'test-key' }
      })
    )
    expect(proxyWreckMock.post).toHaveBeenCalledWith(
      'http://example.com/api',
      expect.objectContaining({
        json: true,
        payload: { test: 'data' },
        headers: { 'x-api-key': 'test-key' }
      })
    )
    expect(regularWreckMock.get).not.toHaveBeenCalled()
    expect(regularWreckMock.post).not.toHaveBeenCalled()

    jest.dontMock('../server/config')
    jest.dontMock('@hapi/wreck')
    jest.dontMock('https-proxy-agent')
  })
})
