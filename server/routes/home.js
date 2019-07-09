const Fwis = require('../models/fwis')
const Area = require('../models/area-view')
const fwisService = require('../services/fwis')
const HomeView = require('../models/home-view')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      try {
        const data = await fwisService.get()
        const fwis = new Fwis(data)

        return h.view('index', new HomeView(fwis))
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }
}
