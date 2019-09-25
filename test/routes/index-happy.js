const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Code = require('@hapi/code')
const composeServer = require('../server')

lab.experiment(('All basic routes'), () => {
  let server
  lab.before(async () => {
    server = await composeServer.start()
  })

  lab.after(() => {
    composeServer.stop()
  })

  const urls = [{
    url: '/',
    code: 200,
    text: [
      'Flood Digital Management Console</h1>',
      'Summary</h2>'
    ]
  }, {
    url: '/area',
    code: 200,
    text: [
      'Area view</h2>'
    ]
  }, {
    url: '/area/Cumbria%20and%20Lancashire',
    code: 200,
    text: [
      'Cumbria and Lancashire',
      'Area view</h2>'
    ]
  }, {
    url: '/target-area',
    code: 200,
    text: [
      'Search</h2>'
    ]
  }, {
    url: '/target-area/011FWFNC1D',
    code: 200,
    text: [
      'Appleby, Holme and Chapel Street and Cherry Row (011FWFNC1D)</h2>',
      '<p>There are no warnings currently in force for Appleby, Holme and Chapel Street and Cherry Row</p>'
    ]
  }, {
    url: '/target-area/sdfdsf',
    code: 404,
    text: ['Page not found']
  }, {
    url: '/login',
    code: 302
  }, {
    url: '/logout',
    code: 302
  }]

  urls.forEach(item => {
    lab.test(`Happy route: ${item.url} returns ${item.code}`, async () => {
      const response = await server.inject({
        method: 'GET',
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
