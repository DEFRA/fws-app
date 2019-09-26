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

  // Each test config:
  /*
  {
    url: '',
    code: 200,
    auth: {
      strategy: 'azure-legacy',
      credentials: {
        scope: ''
      }
    },
    text: [
      'test'
    ]
  }
  */

  const preLoginCredentials = {
    profile: {
      displayName: 'Smith, John',
      email: 'john.smith@defra.net',
      raw: {
        roles: '["FWISAdmin"]'
      }
    }
  }

  const postLoginCredentials = {
    scope: ['manage:warnings'],
    isAdmin: true,
    profile: {
      id: 'test',
      displayName: 'Smith, John',
      email: 'john.smith@defra.net'
    }
  }

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
    url: '/target-area?query=appleby&area=',
    code: 200,
    text: [
      'Appleby, Holme and Chapel Street and Cherry Row'
    ]
  }, {
    url: '/target-area?query=coast&area=',
    code: 200,
    text: [
      'Coast at Duddon estuary'
    ]
  }, {
    url: '/target-area?query=&area=Cumbria+and+Lancashire',
    code: 200,
    text: [
      'Coast at Duddon estuary'
    ]
  }, {
    url: '/target-area?query=coast&area=Cumbria+and+Lancashire',
    code: 200,
    text: [
      'Coast at Duddon estuary'
    ]
  }, {
    url: '/target-area?query=sdfdsfsdfsdf&area=',
    code: 200,
    text: [
      'No results found'
    ]
  }, {
    url: '/target-area?query=coast&area=Cumbria+and+Lancashire',
    code: 200,
    text: [
      'Coast at Duddon estuary'
    ]
  }, {
    url: '/target-area?query=coast&area=East+Anglia',
    code: 200,
    text: [
      'No results found'
    ]
  }, {
    url: '/target-area?query=&area=East+Anglia',
    code: 200,
    text: [
      'No results found'
    ]
  }, {
    url: '/target-area?query=011FWFNC1D&area=',
    code: 200,
    text: [
      'Appleby, Holme and Chapel Street and Cherry Row'
    ]
  }, {
    url: '/target-area/011FWFNC1D',
    code: 200,
    text: [
      'Appleby, Holme and Chapel Street and Cherry Row (011FWFNC1D)</h2>',
      '<p>There are no warnings currently in force for Appleby, Holme and Chapel Street and Cherry Row</p>',
      'Login'
    ]
  }, {
    url: '/target-area/011WACN6',
    code: 200,
    text: [
      'Coast at North Morecambe Bay'
    ]
  }, {
    url: '/target-area/011WACN6',
    code: 200,
    text: [
      'Coast at North Morecambe Bay',
      'Edit the current warning',
      'Smith, John',
      'Logout'
    ],
    auth: {
      strategy: 'azure-legacy',
      credentials: postLoginCredentials
    }
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
  }, {
    url: '/target-area/011FWFNC1D/edit',
    auth: {
      strategy: 'azure-legacy',
      credentials: {
        scope: ['']
      }
    },
    code: 403
  }, {
    url: '/target-area/011FWFNC1D/edit',
    auth: {
      strategy: 'azure-legacy',
      credentials: postLoginCredentials
    },
    code: 200,
    text: [
      'Cumbria and Lancashire',
      'Appleby, Holme and Chapel Street and Cherry Row (011FWFNC1D)'
    ]
  }, {
    url: '/target-area/011WACN5/edit',
    auth: {
      strategy: 'azure-legacy',
      credentials: postLoginCredentials
    },
    code: 200,
    text: [
      'Cumbria and Lancashire',
      'Coast at Barrow in Furness (011WACN5)',
      'Smith, John'
    ]
  }, {
    url: '/target-area/011WACN6/edit',
    auth: {
      strategy: 'azure-legacy',
      credentials: postLoginCredentials
    },
    code: 200,
    text: [
      'Cumbria and Lancashire',
      'Coast at North Morecambe Bay (011WACN6)'
    ]
  }, {
    url: '/login',
    auth: {
      strategy: 'azure-legacy',
      credentials: preLoginCredentials
    },
    code: 302
  }, {
    url: '/login',
    auth: {
      strategy: 'azure-legacy',
      credentials: {
        profile: {
          displayName: 'Smith, John',
          email: 'john.smith@defra.net',
          raw: {}
        }
      }
    },
    code: 302
  }, {
    method: 'POST',
    url: '/target-area/011FWFNC1D/edit',
    code: 302,
    payload: {
      severity: 1,
      situation: 'test situation'
    },
    auth: {
      strategy: 'azure-legacy',
      credentials: postLoginCredentials
    }
  }]

  urls.forEach(item => {
    lab.test(`Happy route: ${item.url} returns ${item.code}`, async () => {
      const response = await server.inject({
        method: item.method || 'GET',
        url: item.url,
        auth: item.auth,
        payload: item.payload
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
