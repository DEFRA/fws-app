const composeServer = require('../server')
const config = require('../../server/config')

describe('Training Env banner', () => {
  let server

  beforeAll(async () => {
    config.env = 'tra'
    server = await composeServer.start()
  })

  afterAll(async () => {
    await composeServer.stop()
  })

  it('trainning env', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.payload).toContain('This application version is for training only')
    expect(response.payload).toContain('govuk-header-blue')
    expect(response.payload).toContain('govuk-footer-blue')
    expect(response.statusCode).toBe(200)
  })
})
