const boom = require('@hapi/boom')
const SeverityView = require('../models/severity-view')

module.exports = {
  method: 'GET',
  path: '/severity-view',
  options: {
    handler: async (request, h) => {
      try {
        const { server } = request
        const { warnings } = await server.methods.flood.getFloods()
        return h.view('severity-view', new SeverityView(warnings))
      } catch (err) {
        return boom.badRequest('Summary handler caught error', err)
      }
    }
  }
}
