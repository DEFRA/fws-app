import boom from '@hapi/boom'
import SeverityView from '../models/severity-view.js'

export default {
  method: 'GET',
  path: '/severity-view',
  options: {
    handler: async (request, h) => {
      try {
        const { server } = request
        const { warnings } = await server.methods.flood.getFloods()
        return h.view('severity-view', new SeverityView(warnings))
      } catch (err) {
        return boom.badRequest('Severity view handler caught error', err)
      }
    }
  }
}
