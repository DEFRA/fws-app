const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const proxyquire = require('proxyquire').noCallThru()

lab.experiment('HTTP (with proxyquire)', () => {
  lab.experiment('getJson', () => {
    lab.test('should successfully fetch JSON data with 200 status', async () => {
      const testUrl = 'https://api.example.com/test'
      const expectedPayload = { warnings: [], data: 'test' }

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({
            res: { statusCode: 200 },
            payload: expectedPayload
          }),
          post: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      const result = await http.getJson(testUrl)

      Code.expect(result).to.equal(expectedPayload)
    })

    lab.test('should include x-api-key header in request', async () => {
      const testUrl = 'https://api.example.com/test'
      const config = require('../server/config')
      let capturedOptions = null

      const wreckStub = {
        defaults: () => ({
          get: (url, options) => {
            capturedOptions = options
            return Promise.resolve({
              res: { statusCode: 200 },
              payload: {}
            })
          },
          post: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await http.getJson(testUrl)

      Code.expect(capturedOptions).to.exist()
      Code.expect(capturedOptions.headers).to.exist()
      Code.expect(capturedOptions.headers['x-api-key']).to.equal(config.apiKey)
      Code.expect(capturedOptions.json).to.be.true()
    })

    lab.test('should throw error when status code is not 200', async () => {
      const testUrl = 'https://api.example.com/test'

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({
            res: { statusCode: 404 },
            payload: { error: 'Not Found' }
          }),
          post: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.getJson(testUrl))
        .to.reject(Error, 'Requested resource returned a non 200 status code')
    })

    lab.test('should throw error when status code is 500', async () => {
      const testUrl = 'https://api.example.com/test'

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({
            res: { statusCode: 500 },
            payload: { error: 'Internal Server Error' }
          }),
          post: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.getJson(testUrl))
        .to.reject(Error, 'Requested resource returned a non 200 status code')
    })

    lab.test('should throw error when status code is 401', async () => {
      const testUrl = 'https://api.example.com/test'

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({
            res: { statusCode: 401 },
            payload: { error: 'Unauthorized' }
          }),
          post: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.getJson(testUrl))
        .to.reject(Error, 'Requested resource returned a non 200 status code')
    })

    lab.test('should handle network errors', async () => {
      const testUrl = 'https://api.example.com/test'
      const networkError = new Error('Network timeout')

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.reject(networkError),
          post: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.getJson(testUrl))
        .to.reject(Error, 'Network timeout')
    })

    lab.test('should handle timeout errors', async () => {
      const testUrl = 'https://api.example.com/test'
      const timeoutError = new Error('Request timeout')
      timeoutError.code = 'ETIMEDOUT'

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.reject(timeoutError),
          post: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.getJson(testUrl))
        .to.reject(Error, 'Request timeout')
    })

    lab.test('should handle connection refused errors', async () => {
      const testUrl = 'https://api.example.com/test'
      const connError = new Error('connect ECONNREFUSED')
      connError.code = 'ECONNREFUSED'

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.reject(connError),
          post: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.getJson(testUrl))
        .to.reject(Error, 'connect ECONNREFUSED')
    })
  })

  lab.experiment('postJson', () => {
    lab.test('should successfully post JSON data with 200 status', async () => {
      const testUrl = 'https://api.example.com/test'
      const testPayload = { action: 'update', value: 'test' }
      const expectedResponse = { success: true, id: '123' }

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: () => Promise.resolve({
            res: { statusCode: 200 },
            payload: expectedResponse
          })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      const result = await http.postJson(testUrl, testPayload)

      Code.expect(result).to.equal(expectedResponse)
    })

    lab.test('should include x-api-key header and payload in request', async () => {
      const testUrl = 'https://api.example.com/test'
      const testPayload = { action: 'update', value: 'test' }
      const config = require('../server/config')
      let capturedOptions = null

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: (url, options) => {
            capturedOptions = options
            return Promise.resolve({
              res: { statusCode: 200 },
              payload: {}
            })
          }
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await http.postJson(testUrl, testPayload)

      Code.expect(capturedOptions).to.exist()
      Code.expect(capturedOptions.headers).to.exist()
      Code.expect(capturedOptions.headers['x-api-key']).to.equal(config.apiKey)
      Code.expect(capturedOptions.json).to.be.true()
      Code.expect(capturedOptions.payload).to.equal(testPayload)
    })

    lab.test('should handle empty payload', async () => {
      const testUrl = 'https://api.example.com/test'
      const emptyPayload = {}
      let capturedOptions = null

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: (url, options) => {
            capturedOptions = options
            return Promise.resolve({
              res: { statusCode: 200 },
              payload: { success: true }
            })
          }
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await http.postJson(testUrl, emptyPayload)

      Code.expect(capturedOptions.payload).to.equal(emptyPayload)
    })

    lab.test('should throw error when status code is not 200', async () => {
      const testUrl = 'https://api.example.com/test'
      const testPayload = { action: 'update' }

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: () => Promise.resolve({
            res: { statusCode: 400 },
            payload: { error: 'Bad Request' }
          })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.postJson(testUrl, testPayload))
        .to.reject(Error, 'Requested resource returned a non 200 status code')
    })

    lab.test('should throw error when status code is 500', async () => {
      const testUrl = 'https://api.example.com/test'
      const testPayload = { action: 'update' }

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: () => Promise.resolve({
            res: { statusCode: 500 },
            payload: { error: 'Internal Server Error' }
          })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.postJson(testUrl, testPayload))
        .to.reject(Error, 'Requested resource returned a non 200 status code')
    })

    lab.test('should throw error when status code is 403', async () => {
      const testUrl = 'https://api.example.com/test'
      const testPayload = { action: 'update' }

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: () => Promise.resolve({
            res: { statusCode: 403 },
            payload: { error: 'Forbidden' }
          })
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.postJson(testUrl, testPayload))
        .to.reject(Error, 'Requested resource returned a non 200 status code')
    })

    lab.test('should handle network errors', async () => {
      const testUrl = 'https://api.example.com/test'
      const testPayload = { action: 'update' }
      const networkError = new Error('Network failure')

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: () => Promise.reject(networkError)
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.postJson(testUrl, testPayload))
        .to.reject(Error, 'Network failure')
    })

    lab.test('should handle timeout errors', async () => {
      const testUrl = 'https://api.example.com/test'
      const testPayload = { action: 'update' }
      const timeoutError = new Error('Request timeout')
      timeoutError.code = 'ETIMEDOUT'

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: () => Promise.reject(timeoutError)
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.postJson(testUrl, testPayload))
        .to.reject(Error, 'Request timeout')
    })

    lab.test('should handle connection refused errors', async () => {
      const testUrl = 'https://api.example.com/test'
      const testPayload = { action: 'update' }
      const connError = new Error('connect ECONNREFUSED')
      connError.code = 'ECONNREFUSED'

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: () => Promise.reject(connError)
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await Code.expect(http.postJson(testUrl, testPayload))
        .to.reject(Error, 'connect ECONNREFUSED')
    })

    lab.test('should handle complex payloads', async () => {
      const testUrl = 'https://api.example.com/test'
      const complexPayload = {
        warning: {
          id: '123',
          severity: 'high',
          message: 'Test warning',
          coordinates: [1.23, 4.56],
          metadata: {
            source: 'test',
            timestamp: new Date().toISOString()
          }
        }
      }

      let capturedOptions = null

      const wreckStub = {
        defaults: () => ({
          get: () => Promise.resolve({ res: { statusCode: 200 }, payload: {} }),
          post: (url, options) => {
            capturedOptions = options
            return Promise.resolve({
              res: { statusCode: 200 },
              payload: { success: true }
            })
          }
        })
      }

      const http = proxyquire('../server/http', {
        '@hapi/wreck': wreckStub
      })

      await http.postJson(testUrl, complexPayload)

      Code.expect(capturedOptions.payload).to.equal(complexPayload)
    })
  })
})
