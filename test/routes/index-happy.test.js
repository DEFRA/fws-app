import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import composeServer from '../server.js'

describe('All basic routes', () => {
  let server
  beforeAll(async () => {
    server = await composeServer.start()
  })

  afterAll(async () => {
    await composeServer.stop()
  })

  // Wraps strings that must all appear in the response, in the order given
  const inOrder = (...parts) => ({ inOrder: parts })

  const expectText = (payload, text) => {
    if (text.inOrder) {
      let from = 0
      text.inOrder.forEach(part => {
        const index = payload.indexOf(part, from)
        expect(index, `expected "${part}" after position ${from}`).toBeGreaterThanOrEqual(0)
        from = index + part.length
      })
    } else {
      expect(payload).toContain(text)
    }
  }

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
      'Flood Warning Information System</h1>',
      'Summary</h2>',
      // test order of warning severity headers
      inOrder('>Environment agency area</th>', '>Severe flood warnings</th>', '>Flood warnings</th>', '>Flood alerts</th>', '>Warnings no longer in force</th>', '>Area total</th>')
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
      'Area view</h2>',
      // tests order of severities
      inOrder(
        '/assets/images/SevereFloodWarning.png', '>Severe flood warning</td>', '/target-area/012WAFEL',
        '/assets/images/FloodWarning.png', '>Flood warning</td>', '/target-area/012FWFY2C', '/target-area/012FWFY3C',
        '/assets/images/FloodAlert.png', '>Flood alert</td>', '/target-area/012FWFY1A',
        '/assets/images/WarningsNoLongerInForce.png', '>Warning no longer in force</td>'
      )
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
      'Coast at North Morecambe Bay (011WACN6)',
      inOrder('<select class="govuk-select" id="severity" name="severity">', '<option value="1" selected>Flood alert</option>', '<option value="4">Warning no longer in force</option>', '</select>')
    ]
  }, {
    url: '/target-area/011FWFNC1D/edit',
    auth: {
      strategy: 'azure-legacy',
      credentials: postLoginCredentials
    },
    code: 200,
    text: [
      'Cumbria and Lancashire',
      'Appleby, Holme and Chapel Street and Cherry Row (011FWFNC1D)',
      inOrder('<select class="govuk-select" id="severity" name="severity">', '<option value="2">Flood warning</option>', '<option value="3">Severe flood warning</option>', '<option value="4">Warning no longer in force</option>', '</select>')
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
  }, {
    url: '/severity-view',
    code: 200,
    text: [
      'Severity view</h2>'
    ]
  }, {
    method: 'POST',
    url: '/target-area/011FWFNC1D/edit',
    code: 200,
    payload: {
      severity: 3,
      situation: ''
    },
    auth: {
      strategy: 'azure-legacy',
      credentials: postLoginCredentials
    },
    text: ['Enter a valid situation']
  }, {
    method: 'POST',
    url: '/target-area/011FWFNC1D/edit',
    code: 200,
    payload: {
      severity: 3,
      situation: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.'
    },
    auth: {
      strategy: 'azure-legacy',
      credentials: postLoginCredentials
    },
    text: ['Situation must be 1100 characters or fewer']
  }, {
    method: 'POST',
    url: '/target-area/011FWFNC1D/edit',
    code: 200,
    payload: {
      severity: 6,
      situation: 'Tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.'
    },
    auth: {
      strategy: 'azure-legacy',
      credentials: postLoginCredentials
    },
    text: ['Enter a valid severity']
  }, {
    method: 'GET',
    url: '/robots.txt',
    code: 200,
    text: ['Disallow: /']
  }, {
    method: 'GET',
    url: '/status',
    code: 200,
    text: ['"status":"OK"']
  }]

  test.each(urls.map(u => ({ method: 'GET', ...u })))('$method $url returns $code', async (item) => {
    const response = await server.inject({
      method: item.method,
      url: item.url,
      auth: item.auth,
      payload: item.payload
    })
    expect(response.statusCode).toBe(item.code)
    ;(item.text || []).forEach(text => expectText(response.payload, text))
  })
})
