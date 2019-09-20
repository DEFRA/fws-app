const Joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const UpdateWarningView = require('../models/update-warning-view')

module.exports = [{
  method: 'GET',
  path: '/target-area/{code}/edit',
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
      mode: 'required',
      scope: '+manage:warnings'
    },
    validate: {
      params: Joi.object({
        code: Joi.string().required()
      })
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
      mode: 'required',
      scope: '+manage:warnings'
    },
    validate: {
      params: Joi.object({
        code: Joi.string().required()
      }),
      payload: Joi.object({
        severity: Joi.number().required().valid(1, 2, 3, 4),
        situation: Joi.string().required().max(999)
      })
    }
  }
}]
