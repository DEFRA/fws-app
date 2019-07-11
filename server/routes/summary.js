const Fwis = require('../models/fwis')
const service = require('../services')
const HomeView = require('../models/home-view')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      try {
        const data = await service.getFloods()
        const fwis = new Fwis(data)

        return h.view('summary', new HomeView(fwis))
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }
}
