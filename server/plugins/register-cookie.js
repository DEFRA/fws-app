
const config = require('../config')

exports.plugin = {
  name: 'register-cookie',
  register: (server, options) => {
    // Cookie used to notify login of where the user originated from
    server.state('login-redirect', {
      ttl: 60 * 60 * 1000,
      isSecure: config.homePage.startsWith('https'),
      path: '/',
      isSameSite: false,
      isHttpOnly: false,
      encoding: 'base64',
      clearInvalid: true,
      strictHeader: true
    })
  }
}
