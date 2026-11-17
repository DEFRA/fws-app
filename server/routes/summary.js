import boom from '@hapi/boom'
import SummaryView from '../models/summary-view.js'

export default {
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
