const hapi = require('@hapi/hapi')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    host: config.host,
    port: config.port,
    routes: {
      auth: {
        mode: 'required'
      },
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(require('./plugins/auth'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/log-errors'))
  await server.register(require('./plugins/logging'))
  await server.register(require('blipp'))

  return server
}

module.exports = createServer
