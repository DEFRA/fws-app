const joi = require('joi')
const boom = require('boom')
const service = require('../services')
const TargetAreaSearchView = require('../models/target-area-search-view')

module.exports = {
  method: 'GET',
  path: '/target-area',
  options: {
    handler: async (request, h) => {
      try {
        const { query, area } = request.query
        const areas = await service.getAllAreas()
        const hasSearchParam = query !== undefined || area !== undefined

        if (hasSearchParam) {
          const { warnings } = await service.getFloods()
          const targetAreas = await service.findTargetAreas(query, area)

          return h.view('target-area-search', new TargetAreaSearchView(
            areas, targetAreas, warnings, query, area
          ))
        } else {
          return h.view('target-area-search', new TargetAreaSearchView(areas))
        }
      } catch (err) {
        return boom.badRequest('Target Area search handler caught error', err)
      }
    },
    validate: {
      query: {
        query: joi.string().allow(''),
        area: joi.string().allow('')
      }
    }
  }
}
