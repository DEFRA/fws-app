const routes = [].concat(
  require('../routes/auth'),
  require('../routes/summary'),
  require('../routes/area'),
  require('../routes/target-area'),
  require('../routes/target-area-search'),
  require('../routes/update-warning'),
  require('../routes/public'),
  require('../routes/severity-view'),
  require('../routes/status')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
