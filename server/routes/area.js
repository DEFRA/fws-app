const AreaView = require('../models/area-view')
const fwisService = require('../services/fwis')

module.exports = {
  method: 'GET',
  path: '/area/{id?}',
  options: {
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const data = await fwisService.get()

        return h.view('area', new AreaView(data, request.url.href, id))
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }
}
