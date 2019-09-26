const boom = require('@hapi/boom')
const AreaView = require('../models/area-view')

module.exports = {
  method: 'GET',
  path: '/area/{id?}',
  options: {
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const { server } = request
        const { warnings } = await server.methods.flood.getFloods()
        const areaView = new AreaView(warnings, id)

        areaView.redirectTo = request.path

        return h.view('area', areaView)
      } catch (err) {
        return boom.badRequest('Area handler caught error', err)
      }
    }
  }
}
