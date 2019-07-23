const boom = require('boom')
const SummaryView = require('../models/summary-view')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      try {
        const { server } = request
        const { warnings } = await server.methods.flood.getFloods()

        return h.view('summary', new SummaryView(warnings))
      } catch (err) {
        return boom.badRequest('Summary handler caught error', err)
      }
    }
  }
}
