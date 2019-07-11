const path = require('path')
const nunjucks = require('nunjucks')
const config = require('../config')
const pkg = require('../../package.json')

module.exports = {
  plugin: require('vision'),
  options: {
    engines: {
      html: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)

          return (context) => {
            return template.render(context)
          }
        },
        prepare: (options, next) => {
          const nunjucksPath = path.join(options.relativeTo || process.cwd(), options.path)
          const env = nunjucks.configure([
            nunjucksPath,
            'node_modules/govuk-frontend/',
            'node_modules/govuk-frontend/components/'
          ], {
            autoescape: true,
            watch: false
          })

          // env.addFilter('format-date', function (date, format = '') {
          //   return moment(date).format(format)
          // })

          options.compileOptions.environment = env

          return next()
        }
      }
    },
    path: '../views',
    relativeTo: __dirname,
    isCached: !config.isDev,
    context: {
      appVersion: pkg.version,
      assetPath: '/assets',
      serviceName: 'FWIS',
      pageTitle: 'Flood Digital Management Console',
      analyticsAccount: config.analyticsAccount
    }
  }
}
