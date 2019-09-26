const boom = require('@hapi/boom')
const config = require('../config')

module.exports = [{
  method: 'GET',
  path: '/login',
  options: {
    auth: 'azure-legacy',
    handler: (request, h) => {
      if (!request.auth.isAuthenticated) {
        const message = request.auth.error && request.auth.error.message
        return boom.unauthorized(`Authentication failed due to: ${message}`)
      }

      const { profile } = request.auth.credentials
      const roles = []
      const scope = []

      if (profile.raw.roles) {
        roles.push(...JSON.parse(profile.raw.roles))
      }

      const isAdmin = roles.includes('FWISAdmin')

      if (isAdmin) {
        scope.push('manage:warnings')
      }

      request.cookieAuth.set({
        scope,
        isAdmin,
        roles,
        profile
      })

      return h.redirect(request.auth.credentials.query && request.auth.credentials.query.redirectTo ? request.auth.credentials.query.redirectTo : '/')
    }
  }
}, {
  method: 'GET',
  path: '/logout',
  options: {
    handler: function (request, h) {
      request.cookieAuth.clear()
      return h.redirect(`https://login.microsoftonline.com/${config.adTenant}/oauth2/v2.0/logout?post_logout_redirect_uri=${config.homePage}`)
    }
  }
}]
