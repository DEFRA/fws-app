const routes = [].concat(
  require('../routes/home'),
  require('../routes/area'),
  require('../routes/target-area'),
  require('../routes/target-area-search'),
  require('../routes/about'),
  require('../routes/public'),
  require('../routes/api/update-warnings')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
