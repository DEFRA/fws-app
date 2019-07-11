const routes = [].concat(
  require('../routes/home'),
  require('../routes/area'),
  require('../routes/target-area'),
  require('../routes/target-area-search'),
  require('../routes/public')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
