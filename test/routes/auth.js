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
})
