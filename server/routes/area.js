const boom = require('@hapi/boom')
const AreaView = require('../models/area-view')

module.exports = {
  method: 'GET',
  path: '/area/{id?}',
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
