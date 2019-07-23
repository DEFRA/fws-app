const joi = require('joi')
const boom = require('boom')
const UpdateWarningView = require('../models/update-warning-view')

module.exports = [{
  method: 'GET',
  path: '/target-area/{code}/edit',
  options: {
    handler: async (request, h) => {
      try {
        const { code } = request.params
        const { server } = request

        const [
          { targetAreas },
          { warnings }
        ] = await Promise.all([
          server.methods.flood.getAllAreas(),
          server.methods.flood.getFloods()
        ])

        const targetArea = targetAreas.find(ta => ta.ta_code === code)
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
        const { server } = request
        const { severity, situation } = request.payload
        const { id, email, displayName: name } = request.auth.credentials.profile
        const profile = { id, email, name }
        const flood = server.methods.flood

        await flood.updateWarning(code, severity, situation, profile)

        // Clear caches
        await Promise.all([
          flood.getFloods.cache.drop(),
          flood.getHistoricFloods.cache.drop(code)
        ])

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
        severity: joi.number().required().valid(1, 2, 3, 4),
        situation: joi.string().required().max(999)
      }
    }
  }
}]
