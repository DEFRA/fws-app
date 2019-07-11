const joi = require('joi')
const fwisService = require('../services/fwis')
const TargetAreaView = require('../models/target-area-view')

module.exports = {
  method: 'GET',
  path: '/target-area/{id}',
  options: {
    handler: async (request, h) => {
      try {
        const { id } = request.params
        const targetArea = await fwisService.getTargetArea(id)
        const { warnings } = await fwisService.get()
        const targetAreaWarnings = warnings.filter(w => w.attr.taCode === id)
        const historicWarnings = targetAreaWarnings

        return h.view('target-area', new TargetAreaView(targetArea, targetAreaWarnings, historicWarnings))
      } catch (err) {
        console.error(err)
        throw err
      }
    },
    validate: {
      params: {
        id: joi.string().required()
      }
    }
  }
}
