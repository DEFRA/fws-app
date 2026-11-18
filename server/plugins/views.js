import { createRequire } from 'node:module'
import nunjucks from 'nunjucks'
import vision from '@hapi/vision'
import config from '../config.js'

// standard's parser does not support JSON import attributes yet
const pkg = createRequire(import.meta.url)('../../package.json')

export default {
  plugin: vision,
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
          const env = nunjucks.configure(options.path, {
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
    path: [
      'server/views',
      'node_modules/govuk-frontend/dist/govuk',
      'node_modules/govuk-frontend/dist/govuk/components'
    ],
    isCached: !config.isDev,
    context: {
      appVersion: pkg.version,
      assetPath: '/assets',
      serviceName: 'FWIS',
      pageTitle: 'Flood Warning Information System',
      analyticsAccount: config.analyticsAccount
    }
  }
}
