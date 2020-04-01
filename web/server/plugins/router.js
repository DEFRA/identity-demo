const routes = [].concat(
  require('../routes/home'),
  require('../routes/auth'),
  require('../routes/account'),
  require('../routes/protected'),
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
