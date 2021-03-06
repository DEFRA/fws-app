/*
* Add an `onPreResponse` listener to return error pages
*/

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode

          const model = {
            hideRefresh: true
          }

          // In the event of 401
          // return the `401` view
          if (statusCode === 401) {
            return h.view('401', model).code(401)
          }

          // In the event of 403
          // return the `403` view
          if (statusCode === 403) {
            return h.view('403', model).code(403)
          }

          // In the event of 404
          // return the `404` view
          if (statusCode === 404) {
            return h.view('404', model).code(404)
          }

          request.log('error', {
            statusCode: statusCode,
            message: response.message,
            stack: response.data ? response.data.stack : response.stack
          })

          // The return the `500` view
          return h.view('500', model).code(500)
        }
        return h.continue
      })
    }
  }
}
