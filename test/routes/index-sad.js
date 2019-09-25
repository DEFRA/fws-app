const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const composeServer = require('../server')

lab.experiment(('All basic routes'), () => {
  let server
  lab.before(async () => {
    server = await composeServer.start(true)
  })

  lab.after(() => {
    composeServer.stop()
  })

  const urls = [{
    url: '/',
    code: 500,
    text: ['<h1 class="govuk-heading-xl">Sorry, there is a problem with the service</h1>']
  }, {
    url: '/area',
    code: 500,
    text: ['<h1 class="govuk-heading-xl">Sorry, there is a problem with the service</h1>']
  }, {
    url: '/area/Cumbria%20and%20Lancashire',
    code: 500,
    text: ['<h1 class="govuk-heading-xl">Sorry, there is a problem with the service</h1>'],
  }, {
    url: '/target-area',
    code: 500,
    text: ['<h1 class="govuk-heading-xl">Sorry, there is a problem with the service</h1>']
  }, {
    url: '/target-area/011FWFNC1D',
    code: 500,
    text: ['<h1 class="govuk-heading-xl">Sorry, there is a problem with the service</h1>']
  }, {
    url: '/sdgfdfsgds',
    code: 404,
    text: ['Page not found']
  }, {
    url: '/target-area/011FWFNC1D/edit',
    code: 401, // denied
    text: ['']
  }, {
    method: 'POST',
    url: '/target-area/011FWFNC1D/edit',
    code: 401 // denied
  }]

  urls.forEach(item => {
    lab.test(`Sad route: ${item.url} returns ${item.code}`, async () => {
      const response = await server.inject({
        method: item.method || 'GET',
        url: item.url
      })
      Code.expect(response.statusCode).to.equal(item.code)
      if (item.text && item.text.length > 0) {
        item.text.forEach(text => {
          Code.expect(response.payload).to.include(text)
        })
      }
    })
  })
})
