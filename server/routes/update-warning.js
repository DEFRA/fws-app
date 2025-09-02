const joi = require('joi')
const boom = require('@hapi/boom')
const UpdateWarningView = require('../models/update-warning-view')

const errorMessages = {
  severity: {
    '*': 'Enter a valid severity'
  },
  situation: {
    '*': 'Enter a valid situation',
    'string.max': 'Situation must be 1100 characters or fewer'
  }
}

function mapErrors (errors) {
  const map = {}

  errors.forEach(error => {
    const contextKey = error.path[0]
    const messages = errorMessages[contextKey]
    map[contextKey] = messages[error.type] || messages['*']
  })

  return map
}

module.exports = [{
  method: 'GET',
  path: '/target-area/{code}/edit',
  options: {
    handler: async (request, h) => {
      try {
        const { code } = request.params
        const { server } = request
        const { targetArea, targetAreaWarning } = await getFloodData(server, code)

        return h.view('update-warning', new UpdateWarningView(
          targetArea,
          targetAreaWarning))
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
        const { payload, params } = request
        const { code } = params
        const { server } = request
        const { severity, situation } = request.payload
        const { id, email, displayName: name } = request.auth.credentials.profile
        const profile = { id, email, name }
        const flood = server.methods.flood
        const { targetArea, targetAreaWarning } = await getFloodData(server, code)

        if (targetAreaWarning) {
          // Situation must be updated when severity is updated
          const situationChanged = situation !== targetAreaWarning.situation
          const severityChanged = severity !== parseInt(targetAreaWarning.attr.severityValue, 10)

          if (!severityChanged && !situationChanged) {
            return h.redirect(`/target-area/${code}`)
          } else if (severityChanged && !situationChanged) {
            const errors = {
              situation: 'Situation must be updated when severity is updated'
            }

            return h.view('update-warning', new UpdateWarningView(
              targetArea,
              targetAreaWarning,
              payload,
              errors))
          }
        }

        await flood.updateWarning(code, severity, situation, profile)

        // Clear caches
        await Promise.all([
          flood.getFloods.cache.drop(),
          flood.getFloodsPlus.cache.drop(),
          flood.getHistoricFloods.cache.drop(code)
        ])

        return h.redirect(`/target-area/${code}`)
      } catch (err) {
        if (err.data.payload.errorMessage === '[500] ValidationError: "situation" length must be less than or equal to 1100 characters long') {
          const errors = {
            situation: 'Situation length must be less than or equal to 1100 characters long'
          }
          const { targetArea, targetAreaWarning } = await getFloodData(request.server, request.params.code)
          return h.view('update-warning', new UpdateWarningView(
            targetArea,
            targetAreaWarning,
            request.payload,
            errors))
        } else {
          return boom.badRequest('Failed to update warning', err)
        }
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
        situation: joi.string().required().max(1100)
      }),
      failAction: async (request, h, err) => {
        const { payload, params } = request
        const { code } = params
        const { server } = request
        const { targetArea, targetAreaWarning } = await getFloodData(server, code)
        const errors = mapErrors(err.details)

        return h.view('update-warning', new UpdateWarningView(
          targetArea,
          targetAreaWarning,
          payload,
          errors)).takeover()
      }
    }
  }
}]

async function getFloodData (server, code) {
  const [{ targetAreas }, { warnings }] = await Promise.all([
    server.methods.flood.getAllAreas(),
    server.methods.flood.getFloodsPlus()
  ])
  const targetArea = targetAreas.find(ta => ta.ta_code === code)
  const targetAreaWarning = warnings.find(w => w.attr.taCode === code)

  return {
    targetArea,
    targetAreaWarning
  }
}
