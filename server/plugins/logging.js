const pino = require('../pino')

module.exports = {
  plugin: require('hapi-pino'),
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
        statusCode: res?.output?.statusCode
      }),
      err: ({ name, message, stack, code }) => ({
        name,
        code,
        message,
        stack
      })
    },
    logRequestComplete: false,
    ignorePaths: [
      '/favicon.ico'
    ],
    ignoreTags: [
      'asset'
    ]
  }
}
