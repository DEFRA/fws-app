const boom = require('@hapi/boom')
const SummaryView = require('../models/summary-view')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      try {
        const { server } = request
        const { warnings } = await server.methods.flood.getFloods()
        const summaryView = new SummaryView(warnings)
        summaryView.redirectTo = request.path
        return h.view('summary', summaryView)
      } catch (err) {
        return boom.badRequest('Summary handler caught error', err)
      }
    }
  }
}
