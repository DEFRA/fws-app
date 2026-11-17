import hapiPino from 'hapi-pino'
import pino from '../pino.js'

export default {
  plugin: hapiPino,
  options: {
    instance: pino,
    wrapSerializers: false,
    serializers: {
      req: req => ({
        method: req.method.toUpperCase(),
        url: req.url.pathname,
        query: Object.keys(req.query || {}).length ? req.query : undefined
      }),
      res: res => ({
        statusCode: res?.statusCode
      }),
      err: ({ name, message, stack, code }) => ({
        name,
        code,
        message,
        stack
      })
    },
    logRequestComplete: true,
    ignorePaths: [
      '/favicon.ico'
    ],
    ignoreTags: [
      'asset'
    ]
  }
}
