const joi = require('@hapi/joi')
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
          return h.view('target-area-search', new TargetAreaSearchView(areas, query, area, filteredTargetAreas, warnings))
        } else {
          return h.view('target-area-search', new TargetAreaSearchView(areas))
        }
      } catch (err) {
        return boom.badRequest('Target Area search handler caught error', err)
      }
    },
    validate: {
      query: joi.object({
        query: joi.string().allow(''),
        area: joi.string().allow('')
      })
    }
  }
}
