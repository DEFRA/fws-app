const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')

lab.experiment('Config.js', () => {
  lab.test('Config.js error thrown', async () => {
    const oldConfigCache = require.cache[require.resolve('../server/config')]
    delete require.cache[require.resolve('../server/config')]

    const oldUrl = process.env.FWS_API_URL
    process.env.FWS_API_URL = 'sfsdfs'

    const err = Code.expect(() => {
      require('../server/config')
    }).to.throw()

    Code.expect(err.message).to.equal('The server config is invalid. "api" must be a valid uri')

    // return state
    require.cache[require.resolve('../server/config')] = oldConfigCache
    process.env.FWS_API_URL = oldUrl
  })
})
