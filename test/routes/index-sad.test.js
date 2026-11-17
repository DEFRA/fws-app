import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import composeServer from '../server.js'

describe('All basic routes', () => {
  let server
  beforeAll(async () => {
    server = await composeServer.start(true)
  })

  afterAll(async () => {
    await composeServer.stop()
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
    text: ['<h1 class="govuk-heading-xl">Sorry, there is a problem with the service</h1>']
  }, {
    url: '/target-area',
    code: 500,
    text: ['<h1 class="govuk-heading-xl">Sorry, there is a problem with the service</h1>']
  }, {
    url: '/target-area/011FWFNC1D',
    code: 500,
    text: ['<h1 class="govuk-heading-xl">Sorry, there is a problem with the service</h1>']
  }, {
    url: '/severity-view',
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
    url: '/target-area/011FWFNC1D/edit',
    code: 500,
    text: [''],
    auth: {
      strategy: 'azure-legacy',
      credentials: {
        scope: ['manage:warnings'],
        isAdmin: true
      }
    }
  }, {
    method: 'POST',
    url: '/target-area/011FWFNC1D/edit',
    code: 401 // denied
  }, {
    method: 'POST',
    url: '/target-area/011FWFNC1D/edit',
    code: 500,
    payload: {
      severity: 1,
      situation: 'test situation'
    },
    auth: {
      strategy: 'azure-legacy',
      credentials: {
        scope: ['manage:warnings'],
        isAdmin: true,
        profile: {
          id: 'test',
          displayName: 'Smith, John',
          email: 'john.smith@defra.net'
        }
      }
    }
  }, {
    method: 'POST',
    url: '/target-area/011FWFNC1D/edit',
    code: 403,
    payload: {
      severity: 3,
      situation: 'test situation'
    },
    auth: {
      strategy: 'azure-legacy',
      credentials: {
        scope: [''], // No manage warnings in scope of logged in user so returns 403
        isAdmin: true,
        profile: {
          id: 'test',
          displayName: 'Smith, John',
          email: 'john.smith@defra.net'
        }
      }
    }
  }]

  test.each(urls.map(u => ({ method: 'GET', ...u })))('$method $url returns $code', async (item) => {
    const response = await server.inject({
      method: item.method,
      url: item.url,
      auth: item.auth,
      payload: item.payload
    })
    expect(response.statusCode).toBe(item.code)
    ;(item.text || []).forEach(text => expect(response.payload).toContain(text))
  })
})
