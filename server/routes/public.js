module.exports = [{
  method: 'GET',
  path: '/robots.txt',
  options: {
    handler: {
      file: 'server/public/static/robots.txt'
    }
  }
}, {
  method: 'GET',
  path: '/assets/all.js',
  options: {
    handler: {
      file: 'node_modules/govuk-frontend/all.js'
    }
  }
}, {
  method: 'GET',
  path: '/assets/{path*}',
  options: {
    handler: {
      directory: {
        path: [
          'server/public/static',
          'server/public/build',
          'node_modules/govuk-frontend/assets',
          'node_modules/govuk-frontend/components',
          'node_modules/nunjucks/browser'
        ]
      }
    }
  }
}, {
  method: 'GET',
  path: '/views/{path*}',
  options: {
    handler: {
      directory: {
        path: [
          'client/templates',
          'node_modules/govuk-frontend/components'
        ]
      }
    }
  }
}]
