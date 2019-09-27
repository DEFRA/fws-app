const boom = require('@hapi/boom')
const SeverityView = require('../models/severity-view')

module.exports = {
  method: 'GET',
  path: '/severity-view',
  options: {
    ext: {
      onPreAuth: {
        method: (request, h) => {
          // Set login redirect cookie
          h.state('login-redirect', request.path)
          return h.continue
        }
      }
    },
    handler: async (request, h) => {
      try {
        const { server } = request
        const { warnings } = await server.methods.flood.getFloods()

        return h.view('severity-view', new SeverityView(warnings))
      } catch (err) {
        return boom.badRequest('Severity View handler caught error', err)
      }
    }
  }
}
