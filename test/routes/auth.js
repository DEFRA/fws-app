const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const proxyquire = require('proxyquire').noCallThru()

lab.experiment('Auth route handler', () => {
  let authRoutes
  let boomMessages

  lab.before(() => {
    boomMessages = []
    authRoutes = proxyquire('../../server/routes/auth', {
      '@hapi/boom': {
        unauthorized: (msg) => {
          boomMessages.push(msg)
          const err = new Error(msg)
          err.isBoom = true
          err.output = { statusCode: 401 }
          return err
        }
      },
      '../config': {
        adClientId: 'test',
        adClientSecret: 'test',
        adTenant: 'test',
        cookiePassword: 'test',
        isSecure: false,
        forceHttps: false,
        homePage: 'http://localhost:3000'
      }
    })
  })

  const mockH = {
    redirect: (url) => ({ redirected: true, url }),
    unstate: () => {}
  }

  const mockRequest = (authOverrides) => ({
    auth: {
      isAuthenticated: false,
      error: null,
      credentials: {},
      ...authOverrides
    },
    server: {
      app: {
        redirectCache: {
          get: async () => null,
          drop: async () => {}
        }
      }
    },
    state: {},
    cookieAuth: { set: () => {} }
  })

  lab.test('Login handler returns 401 when authentication fails with an error message', async () => {
    boomMessages.length = 0
    const handler = authRoutes[0].options.handler
    const request = mockRequest({ error: { message: 'access_denied' } })
    const result = await handler(request, mockH)
    Code.expect(result.isBoom).to.be.true()
    Code.expect(result.output.statusCode).to.equal(401)
    Code.expect(boomMessages[0]).to.include('access_denied')
  })

  lab.test('Login handler returns 401 when authentication fails with no error object', async () => {
    boomMessages.length = 0
    const handler = authRoutes[0].options.handler
    const request = mockRequest({ error: null })
    const result = await handler(request, mockH)
    Code.expect(result.isBoom).to.be.true()
    Code.expect(result.output.statusCode).to.equal(401)
    Code.expect(boomMessages[0]).to.include('null')
  })

  lab.experiment('Login handler redirect token', () => {
    const makeAuthenticatedRequest = (state, cacheGetResult) => {
      const dropCalls = []
      return {
        request: {
          auth: {
            isAuthenticated: true,
            error: null,
            credentials: {
              profile: {
                id: 'user-1',
                email: 'user@example.com',
                displayName: 'Test User',
                raw: {}
              }
            }
          },
          server: {
            app: {
              redirectCache: {
                get: async () => cacheGetResult,
                drop: async (key) => { dropCalls.push(key) }
              }
            }
          },
          state,
          cookieAuth: { set: () => {} }
        },
        dropCalls
      }
    }

    lab.test('redirects to stored path and drops token when valid redirect token is present', async () => {
      const handler = authRoutes[0].options.handler
      const { request, dropCalls } = makeAuthenticatedRequest(
        { redirectToken: 'test-token-uuid' },
        '/target-area'
      )
      const result = await handler(request, mockH)
      Code.expect(result.url).to.equal('/target-area')
      Code.expect(dropCalls).to.equal(['test-token-uuid'])
    })

    lab.test('falls back to / when stored path does not start with /', async () => {
      const handler = authRoutes[0].options.handler
      const { request, dropCalls } = makeAuthenticatedRequest(
        { redirectToken: 'test-token-uuid' },
        'https://example.com'
      )
      const result = await handler(request, mockH)
      Code.expect(result.url).to.equal('/')
      Code.expect(dropCalls).to.equal(['test-token-uuid'])
    })

    lab.test('falls back to / and does not drop token when cache returns nothing', async () => {
      const handler = authRoutes[0].options.handler
      const { request, dropCalls } = makeAuthenticatedRequest(
        { redirectToken: 'test-token-uuid' },
        null
      )
      const result = await handler(request, mockH)
      Code.expect(result.url).to.equal('/')
      Code.expect(dropCalls).to.be.empty()
    })

    lab.test('falls back to / and logs a warning when cache throws', async () => {
      const handler = authRoutes[0].options.handler
      const logCalls = []
      const request = {
        auth: {
          isAuthenticated: true,
          error: null,
          credentials: {
            profile: {
              id: 'user-1',
              email: 'user@example.com',
              displayName: 'Test User',
              raw: {}
            }
          }
        },
        server: {
          app: {
            redirectCache: {
              get: async () => { throw new Error('Redis unavailable') },
              drop: async () => {}
            }
          }
        },
        state: { redirectToken: 'test-token-uuid' },
        cookieAuth: { set: () => {} },
        log: (level, data) => { logCalls.push({ level, data }) }
      }
      const result = await handler(request, mockH)
      Code.expect(result.url).to.equal('/')
      Code.expect(logCalls).to.have.length(1)
      Code.expect(logCalls[0].level).to.equal('warn')
      Code.expect(logCalls[0].data.message).to.equal('Failed to resolve redirect token')
      Code.expect(logCalls[0].data.err).to.equal('Redis unavailable')
    })
  })
})
