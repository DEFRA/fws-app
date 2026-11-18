import boom from '@hapi/boom'
import AreaView from '../models/area-view.js'

export default {
  method: 'GET',
  path: '/area/{id?}',
  options: {
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const { server } = request
        const { warnings } = await server.methods.flood.getFloods()
        return h.view('area', new AreaView(warnings, id))
      } catch (err) {
        return boom.badRequest('Area handler caught error', err)
      }
    }
  }
}
