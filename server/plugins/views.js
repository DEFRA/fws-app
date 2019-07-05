const path = require('path')
const nunjucks = require('nunjucks')
const config = require('../config')
const pkg = require('../../package.json')
const analyticsAccount = config.analyticsAccount

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
          const clientTemplatesPath = path.join(options.relativeTo || process.cwd(), '../../client/templates')
          options.compileOptions.environment = nunjucks.configure([
            // path.join(options.relativeTo || process.cwd(), options.path),
            nunjucksPath,
            clientTemplatesPath,
            'node_modules/govuk-frontend/',
            'node_modules/govuk-frontend/components/'
          ], {
            autoescape: true,
            watch: false
          })

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
      serviceName: 'FWApp',
      pageTitle: 'FWApp - GOV.UK',
      analyticsAccount: analyticsAccount
    }
  }
}
