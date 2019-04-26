const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const createServer = require('../server')

lab.experiment('Web test', () => {
  let server

  // Create server before the tests
  lab.before(async () => {
    server = await createServer()
  })

  lab.test('GET / route works', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.headers['content-type']).to.include('text/html')
    Code.expect(response.payload).to.include('<h2 class="govuk-heading-l">Summary</h2>')
  })

  lab.test('GET / route works', async () => {
    const options = {
      method: 'GET',
      url: '/#Area'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.headers['content-type']).to.include('text/html')
    console.log(response)
    Code.expect(response.payload).to.include('<h2 class="govuk-heading-l">Area View</h2>')
  })
})
