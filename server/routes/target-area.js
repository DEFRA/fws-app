import joi from 'joi'
import boom from '@hapi/boom'
import TargetAreaView from '../models/target-area-view.js'

export default {
  method: 'GET',
  path: '/target-area/{code}',
  options: {
    handler: async (request, h) => {
      try {
        const { code } = request.params
        const { server, auth } = request

        const [
          { targetAreas },
          { warnings },
          { warnings: historicWarnings }
        ] = await Promise.all([
          server.methods.flood.getAllAreas(),
          server.methods.flood.getFloodsPlus(),
          server.methods.flood.getHistoricFloods(code)
        ])

        const targetArea = targetAreas.find(ta => ta.ta_code === code)
        const targetAreaWarning = warnings.find(w => w.attr.taCode === code)
        const allowEdit = auth.isAuthenticated && auth.credentials.isAdmin

        if (!targetArea) {
          return boom.notFound('No target area found')
        }

        return h.view('target-area', new TargetAreaView(targetArea, targetAreaWarning, historicWarnings, { allowEdit }))
      } catch (err) {
        return boom.badRequest('Target area handler caught error', err)
      }
    },
    validate: {
      params: joi.object({
        code: joi.string().required()
      })
    }
  }
}
