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

  lab.test('Config.js redirectTokenTtlMs is derived from redirectTokenTtl', () => {
    const config = require('../server/config')
    Code.expect(config.redirectTokenTtlMs).to.equal(config.redirectTokenTtl * 60 * 1000)
  })

  lab.test('Config.js error thrown when REDIRECT_TOKEN_TTL_MINUTES exceeds maximum', () => {
    const oldConfigCache = require.cache[require.resolve('../server/config')]
    delete require.cache[require.resolve('../server/config')]

    const oldTtl = process.env.REDIRECT_TOKEN_TTL_MINUTES
    process.env.REDIRECT_TOKEN_TTL_MINUTES = '16'

    const err = Code.expect(() => {
      require('../server/config')
    }).to.throw()

    Code.expect(err.message).to.include('"redirectTokenTtl" must be less than or equal to 15')

    require.cache[require.resolve('../server/config')] = oldConfigCache

    if (oldTtl) {
      process.env.REDIRECT_TOKEN_TTL_MINUTES = oldTtl
    } else {
      delete process.env.REDIRECT_TOKEN_TTL_MINUTES
    }
  })
})
