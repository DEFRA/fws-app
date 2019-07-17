const joi = require('joi')
const boom = require('boom')
const service = require('../services')
const UpdateWarningView = require('../models/update-warning-view')

module.exports = [{
  method: 'GET',
  path: '/target-area/{code}/edit',
  options: {
    handler: async (request, h) => {
      try {
        const { code } = request.params
        const targetArea = await service.getTargetArea(code)
        const { warnings } = await service.getFloods()
        const targetAreaWarning = warnings.find(w => w.attr.taCode === code)

        return h.view('update-warning', new UpdateWarningView(targetArea, targetAreaWarning))
      } catch (err) {
        return boom.badRequest('Update warning caught error', err)
      }
    },
    auth: {
      scope: '+manage:warnings'
    },
    validate: {
      params: {
        code: joi.string().required()
      }
    }
  }
}, {
  method: 'POST',
  path: '/target-area/{code}/edit',
  options: {
    handler: async (request, h) => {
      try {
        const { code } = request.params
        const { severity, situation } = request.payload

        await service.updateWarning(code, severity, situation)

        return h.redirect(`/target-area/${code}`)
      } catch (err) {
        console.error(err)
        throw err
      }
    },
    auth: {
      scope: '+manage:warnings'
    },
    validate: {
      params: {
        code: joi.string().required()
      },
      payload: {
        severity: joi.string().required().valid('1', '2', '3', '4', '5'),
        situation: joi.string().required().max(999)
      }
    }
  }
}]
