const boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/status',
  options: {
    handler: async (_request, h) => {
      try {
        const status = {
          uptime: process.uptime(),
          status: 'OK',
          timestamp: new Date().toISOString()
        }
        const response = h.response(status)
        response.code(200)
        response.header('Content-Type', 'application/json')
        return response
      } catch (err) {
        return boom.badRequest('Status handler caught error: ', err)
      }
    }
  }
}
