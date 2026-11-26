const { URL } = require('url')

jest.mock('../server/pino', () => ({
  trace: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn()
}))

const loggingPlugin = require('../server/plugins/logging')

const HOST = 'https://example.gov.uk'

describe('logging plugin', () => {
  it('req serializer with query', () => {
    const req = {
      url: new URL('/some/url', HOST),
      method: 'get',
      query: {
        q: 'hi'
      }
    }

    const actual = loggingPlugin.options.serializers.req(req)

    expect(actual).toEqual({
      url: '/some/url',
      method: 'GET',
      query: {
        q: 'hi'
      }
    })
  })
  it('req serializer with empty query', () => {
    const req = {
      url: new URL('/some/url', HOST),
      method: 'get',
      header: {
        'x-api-key': '12345'
      },
      query: {}
    }

    const actual = loggingPlugin.options.serializers.req(req)

    expect(actual).toEqual({
      url: '/some/url',
      method: 'GET',
      query: undefined
    })
  })
  it('req serializer without query', () => {
    const req = {
      url: new URL('/some/url', HOST),
      method: 'get',
      header: {
        'x-api-key': '12345'
      }
    }

    const actual = loggingPlugin.options.serializers.req(req)

    expect(actual).toEqual({
      url: '/some/url',
      method: 'GET',
      query: undefined
    })
  })

  it('res serializer', () => {
    const res = {
      statusCode: 200,
      header: {
        'x-api-key': '12345'
      }
    }

    const actual = loggingPlugin.options.serializers.res(res)

    expect(actual).toEqual({
      statusCode: 200
    })
  })

  it('err serializer', () => {
    const err = new TypeError('Something went boom')
    err.code = 'BOOM_0001'

    const actual = loggingPlugin.options.serializers.err(err)

    expect(actual).toEqual({
      name: 'TypeError',
      message: 'Something went boom',
      stack: err.stack,
      code: 'BOOM_0001'
    })
  })
})
