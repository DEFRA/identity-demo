const hapi = require('@hapi/hapi')
const config = require('./config')
const { clientId, clientSecret, discoveryUrl, callbackUrl } = config.auth

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
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
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/views'))
  await server.register({
    plugin: require('./plugins/auth'),
    options: { clientId, clientSecret, discoveryUrl, callbackUrl }
  })

  server.auth.strategy('oidc', 'oidc', {
    password: 'cookie_encryption_password_secure'
  })

  server.auth.default('oidc')

  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/logging'))
  await server.register(require('blipp'))

  // Add auth credentials to the page context
  server.ext('onPreResponse', (request, h) => {
    const response = request.response

    if (response.variety === 'view') {
      const ctx = response.source.context || {}
      const meta = ctx.meta || {}

      // Set the auth object
      // onto the top level context
      ctx.auth = request.auth

      const headerNavigation = []
      if (ctx.auth.isAuthenticated) {
        headerNavigation.push({
          href: '/logout',
          text: 'Logout'
        })
      } else {
        headerNavigation.push({
          href: '/login',
          text: 'Login'
        })
      }

      ctx.headerNavigation = headerNavigation

      // Set some common context
      // variables under the `meta` namespace
      meta.url = request.url.href
      meta.redirectTo = encodeURIComponent(request.path + (request.url.search || ''))
      meta.timestamp = new Date()

      ctx.meta = meta
      response.source.context = ctx
    }

    return h.continue
  })

  return server
}

module.exports = createServer
