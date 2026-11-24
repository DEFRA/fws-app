describe('Config.js', () => {
  const oldUrl = process.env.FWS_API_URL

  afterEach(() => {
    process.env.FWS_API_URL = oldUrl
  })

  it('Config.js error thrown', () => {
    process.env.FWS_API_URL = 'sfsdfs'

    jest.isolateModules(() => {
      expect(() => {
        require('../server/config')
      }).toThrow('The server config is invalid. "api" must be a valid uri')
    })
  })
})
