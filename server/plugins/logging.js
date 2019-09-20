const config = require('../config')

module.exports = {
  plugin: require('@hapi/good'),
  options: {
    ops: {
      interval: 60000
    },
    reporters: {
      console: [
        {
          module: '@hapi/good-squeeze',
          name: 'Squeeze',
          args: [
            {
              log: config.isProd ? 'error' : '*',
              error: config.isProd ? 'error' : '*',
              response: config.isProd ? 'error' : '*',
              request: config.isProd ? 'error' : '*'
            }
          ]
        },
        {
          module: '@hapi/good-console'
        },
        'stdout'
      ]
    }
  }
}
