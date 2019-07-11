const joi = require('joi')
const fwisService = require('../services/fwis')
const TargetAreaSearchView = require('../models/target-area-search-view')

module.exports = {
  method: 'GET',
  path: '/target-area',
  options: {
    handler: async (request, h) => {
      try {
        const { query, area } = request.query
        const areas = await fwisService.getAllAreas()
        const targetAreas = await fwisService.findTargetAreas(query, area)
        const { warnings } = await fwisService.get()
        const url = request.url.href
        const viewModel = new TargetAreaSearchView(targetAreas, warnings, areas, {
          url,
          query,
          area
        })

        return h.view('target-area-search', viewModel)
      } catch (err) {
        console.error(err)
        throw err
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
