const boom = require('boom')
const service = require('../services')
const SummaryView = require('../models/summary-view')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      try {
        const { warnings } = await service.getFloods()

        return h.view('summary', new SummaryView(warnings))
      } catch (err) {
        return boom.badRequest('Summary handler caught error', err)
      }
    }
  }
}
