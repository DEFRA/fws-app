const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const UpdateWarningView = require('../models/update-warning-view')

module.exports = [{
  method: 'GET',
  path: '/target-area/{code}/edit',
  options: {
    handler: async (request, h) => {
      try {
        const { code } = request.params
        const { server } = request

        return await createView(server, code, h)
      } catch (err) {
        return boom.badRequest('Update warning caught error', err)
      }
    },
    auth: {
      mode: 'required',
      scope: '+manage:warnings'
    },
    validate: {
      params: joi.object({
        code: joi.string().required()
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
          flood.getFloodsPlus.cache.drop(),
          flood.getHistoricFloods.cache.drop(code)
        ])

        return h.redirect(`/target-area/${code}`)
      } catch (err) {
        return boom.badRequest('Failed to update warning', err)
      }
    },
    auth: {
      mode: 'required',
      scope: '+manage:warnings'
    },
    validate: {
      params: joi.object({
        code: joi.string().required()
      }),
      payload: joi.object({
        severity: joi.number().required().valid(1, 2, 3, 4),
        situation: joi.string().required().replace(/(\r\n|\n|\r)/g, '').max(990)
      }),
      failAction: async (request, h, err) => {
        const { code } = request.params
        const { server } = request

        const situationUpdate = request.payload.situation

        return createView(server, code, h, situationUpdate, err)
      }
    }
  }
}]

async function createView (server, code, h, situationUpdate, err) {
  const [{ targetAreas }, { warnings }] = await Promise.all([
    server.methods.flood.getAllAreas(),
    server.methods.flood.getFloodsPlus()
  ])
  const targetArea = targetAreas.find(ta => ta.ta_code === code)
  const targetAreaWarning = warnings.find(w => w.attr.taCode === code)

  if (err) {
    return h.view('update-warning', new UpdateWarningView(
      targetArea,
      targetAreaWarning,
      err,
      situationUpdate), {
    }).takeover()
  } else {
    return h.view('update-warning', new UpdateWarningView(
      targetArea,
      targetAreaWarning))
  }
}
