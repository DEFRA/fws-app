module.exports = [{
  method: 'GET',
  path: '/favicon.ico',
  options: {
    handler: {
      file: 'server/public/static/images/icons/favicon.ico'
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
          'server/public/build'
        ]
      }
    }
  }
}]
