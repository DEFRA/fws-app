const boom = require('boom')
const AreaView = require('../models/area-view')
const service = require('../services')

module.exports = {
  method: 'GET',
  path: '/area/{id?}',
  options: {
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const { warnings } = await service.getFloods()

        return h.view('area', new AreaView(warnings, id))
      } catch (err) {
        return boom.badRequest('Area handler caught error', err)
      }
    }
  }
}
