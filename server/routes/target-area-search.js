const Joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const { getTargetAreaFilter } = require('../helpers')
const TargetAreaSearchView = require('../models/target-area-search-view')

module.exports = {
  method: 'GET',
  path: '/target-area',
  options: {
    handler: async (request, h) => {
      try {
        const { query, area } = request.query
        const { server } = request
        const { areas, targetAreas } = await server.methods.flood.getAllAreas()
        const hasSearchParam = query !== undefined || area !== undefined

        if (hasSearchParam) {
          const { warnings } = await server.methods.flood.getFloods()
          const filter = getTargetAreaFilter(query, area)
          const filteredTargetAreas = targetAreas.filter(filter)
          const targetAreaSearchView = new TargetAreaSearchView(areas, filteredTargetAreas, warnings, query, area)
          targetAreaSearchView.redirectTo = request.path + request.url.search
          return h.view('target-area-search', targetAreaSearchView)
        } else {
          const targetAreaSearchView = new TargetAreaSearchView(areas)
          targetAreaSearchView.redirectTo = request.path + request.url.search
          return h.view('target-area-search', new TargetAreaSearchView(areas))
        }
      } catch (err) {
        return boom.badRequest('Target Area search handler caught error', err)
      }
    },
    validate: {
      query: Joi.object({
        query: Joi.string().allow(''),
        area: Joi.string().allow('')
      })
    }
  }
}
