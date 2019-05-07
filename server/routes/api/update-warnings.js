const ws = require('../../services/web-socket')

module.exports = {
  method: 'POST',
  path: '/api/update-warnings',
  options: {
    handler: async (request, h) => {
      try {
        console.log('update-warnings signal received')
        await ws.publishWarnings(request.server)
        return 'OK'
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}
