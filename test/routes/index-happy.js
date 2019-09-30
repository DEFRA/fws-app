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
      'Summary</h2>',
      // test order of warning severity headers
      '<thead class="govuk-table__head">\n    <tr class="govuk-table__row">\n    \n      <th scope="col" class="govuk-table__header">Environment agency area</th>\n    \n      <th scope="col" class="govuk-table__header center">Severe flood warnings</th>\n    \n      <th scope="col" class="govuk-table__header center">Flood warnings</th>\n    \n      <th scope="col" class="govuk-table__header center">Flood alerts</th>\n    \n      <th scope="col" class="govuk-table__header center">Warnings no longer in force</th>\n    \n      <th scope="col" class="govuk-table__header center">Area total</th>\n    \n    </tr>\n  </thead>'
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
      '<tr class="govuk-table__row">\n        \n          \n          \n          <td class="govuk-table__cell" valign="center"\n          ><img src="/assets/images/SevereFloodWarning.png" class="flooding-icons" alt="Flooding Icon"></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell" valign="center"\n          >Severe flood warning</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >1</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          ><a href="/target-area/012WAFEL">River Calder</a></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >012WAFEL</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >20/09/2019 10:52am</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >20/09/2019 10:52am</td>\n          \n        \n        </tr>\n      \n    \n      \n        <tr class="govuk-table__row">\n        \n          \n          \n          <td class="govuk-table__cell noborder" valign="center"\n          ><img src="/assets/images/FloodWarning.png" class="flooding-icons" alt="Flooding Icon"></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell noborder" valign="center"\n          >Flood warning</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center noborder" valign="center"\n          >2</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          ><a href="/target-area/012FWFY2C">River Wenning at High Bentham, comprising Lane Foot Cottages to the Sewage Works</a></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >012FWFY2C</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >20/09/2019 10:52am</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >20/09/2019 10:52am</td>\n          \n        \n        </tr>\n      \n    \n      \n        <tr class="govuk-table__row">\n        \n          \n          \n          <td class="govuk-table__cell"\n          ></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell"\n          ></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell"\n          ></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          ><a href="/target-area/012FWFY3C">River Wenning at Low Bentham, comprising Burton Rd, Collingwood Drive and Main St near Victoria Hall</a></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >012FWFY3C</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >20/09/2019 10:52am</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >20/09/2019 10:52am</td>\n          \n        \n        </tr>\n      \n    \n      \n        <tr class="govuk-table__row">\n        \n          \n          \n          <td class="govuk-table__cell" valign="center"\n          ><img src="/assets/images/FloodAlert.png" class="flooding-icons" alt="Flooding Icon"></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell" valign="center"\n          >Flood alert</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >1</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          ><a href="/target-area/012FWFY1A">River Ribble at Settle, around Holmehead, Watershed Mill and Sowarth Field Ind Est</a></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >012FWFY1A</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >20/09/2019 10:52am</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >20/09/2019 10:52am</td>\n          \n        \n        </tr>\n      \n    \n      \n        <tr class="govuk-table__row">\n        \n          \n          \n          <td class="govuk-table__cell" valign="center"\n          ><img src="/assets/images/WarningsNoLongerInForce.png" class="flooding-icons" alt="Flooding Icon"></td>\n          \n        \n          \n          \n          <td class="govuk-table__cell" valign="center"\n          >Warning no longer in force</td>\n          \n        \n          \n          \n          <td class="govuk-table__cell center" valign="center"\n          >0</td>'
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
      '<select class="govuk-select" id="severity" name="severity" required>\n              <option value="">Please select</option>\n              \n              <option value="1" selected>Flood alert</option>\n              \n              <option value="4" >Warning no longer in force</option>\n              \n            </select>'
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
      '<select class="govuk-select" id="severity" name="severity" required>\n              <option value="">Please select</option>\n              \n              <option value="2" >Flood warning</option>\n              \n              <option value="3" >Severe flood warning</option>\n              \n              <option value="4" >Warning no longer in force</option>\n              \n            </select>'
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
