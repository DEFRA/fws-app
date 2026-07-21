const boom = require('@hapi/boom')
const config = require('../config')

module.exports = [{
  method: 'GET',
  path: '/login',
  options: {
    auth: 'azure-legacy',
    handler: async (request, h) => {
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
        profile: {
          id: profile.id,
          email: profile.email,
          displayName: profile.displayName
        }
      })

      // Retrieve the pre-login destination from Redis using the token stored
      // in the HttpOnly cookie, then clear both the cookie (h.unstate) and the
      // Redis key (drop) so the token cannot be replayed.
      const token = request.state.redirectToken
      h.unstate('redirectToken')
      let redirectPath = '/'
if (token) {
  try {
    const stored = await request.server.app.redirectCache.get(token)
    if (stored) {
      await request.server.app.redirectCache.drop(token)
      // Defense-in-depth: the stored value always comes from request.path
      // (a Hapi-parsed relative path), but guard against future regressions.
      redirectPath = stored.startsWith('/') ? stored : '/'
    }
  } catch (err) {
    request.log('warn', { message: 'Failed to resolve redirect token', err: err.message })
  }
}
      return h.redirect(redirectPath)
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
