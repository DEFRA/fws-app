import { describe, test, expect, beforeAll, vi } from 'vitest'

vi.mock('../server/pino.js', () => ({ default: {} }))
vi.mock('hapi-pino', () => ({ default: {} }))

const HOST = 'https://example.gov.uk'

describe('logging plugin', () => {
  let loggingPlugin

  beforeAll(async () => {
    loggingPlugin = (await import('../server/plugins/logging.js')).default
  })

  test('req serializer with query', async () => {
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
  test('req serializer with empty query', async () => {
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
  test('req serializer without query', async () => {
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

  test('res serializer', async () => {
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

  test('err serializer', async () => {
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
