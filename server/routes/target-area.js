const joi = require('joi')
const TargetAreaView = require('../models/target-area-view')
const fwisService = require('../services/fwis')

module.exports = {
  method: 'GET',
  path: '/target-area/{id}',
  options: {
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const data = await fwisService.getTargetArea(id)

        return h.view('target-area', new TargetAreaView(data))
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }
}
