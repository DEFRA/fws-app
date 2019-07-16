const joi = require('joi')
const boom = require('boom')
const service = require('../services')
const TargetAreaView = require('../models/target-area-view')

module.exports = {
  method: 'GET',
  path: '/target-area/{code}',
  options: {
    handler: async (request, h) => {
      try {
        const { code } = request.params
        const targetArea = await service.getTargetArea(code)
        const { warnings } = await service.getFloods()
        const targetAreaWarning = warnings.find(w => w.attr.taCode === code)
        const historicWarnings = await service.getHistoricFloods(code)

        return h.view('target-area', new TargetAreaView(targetArea,
          targetAreaWarning, historicWarnings, { allowEdit: true }))
      } catch (err) {
        return boom.badRequest('Target area handler caught error', err)
      }
    },
    validate: {
      params: {
        code: joi.string().required()
      }
    }
  }
}
