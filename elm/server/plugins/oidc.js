const boom = require('@hapi/boom')
const { Issuer } = require('openid-client')
const shortId = () => Math.random().toString(36).substring(2)

module.exports = {
  plugin: {
    name: 'oidc',
    register: async (server, options) => {
      // Validate config
      if (!options.clientId) throw new Error('You must provide a clientId')
      if (!options.clientSecret) throw new Error('You must provide a clientSecret')
      if (!options.callbackUrl) throw new Error('You must provide a callbackUrl')
      if (!options.discoveryUrl) throw new Error('You must provide a discoveryUrl')

      const callbackUrl = options.callbackUrl
      const callbackPath = new URL(options.callbackUrl).pathname

      const issuer = await Issuer.discover(options.discoveryUrl)
      const client = new issuer.Client({
        client_id: options.clientId,
        client_secret: options.clientSecret
      })

      // // Decorate
      // server.decorate('request', 'oidc', { client, issuer })
      // server.decorate('server', 'oidc', { client, issuer })

      // Used to store temp state during login
      server.state('oidc', {
        path: '/',
        isSecure: false,
        isHttpOnly: true,
        clearInvalid: true,
        strictHeader: true,
        isSameSite: 'Lax',
        encoding: 'iron',
        password: 'fjaslhfnbv9uv84ffadvmnb4lafuisdshva'
      })

      server.route([
        {
          method: 'get',
          path: '/login',
          handler: async (request, h) => {
            const state = shortId()
            const scope = 'openid profile permissions roles'

            const redirectUrl = client.authorizationUrl({
              redirect_uri: callbackUrl,
              scope,
              state
            })

            h.state('oidc', { state })

            return h.redirect(redirectUrl).takeover()
          },
          options: {
            auth: false
          }
        },
        {
          method: 'GET',
          path: callbackPath,
          handler: async (request, h) => {
            const cookie = request.state.oidc
            const { state } = cookie

            try {
              const token = await client.callback(callbackUrl, request.query, { state })
              const profile = await client.userinfo(token)

              h.unstate('oidc')
              request.cookieAuth.set({ token, profile })

              return h.redirect('/account')
            } catch (err) {
              request.log(['error', 'auth'], err)
              return boom.unauthorized(err && err.message)
            }
          },
          options: {
            auth: false
          }
        },
        {
          method: 'get',
          path: '/logout',
          handler: function (request, h) {
            request.cookieAuth.clear()
            return h.redirect('/')
          },
          options: {
            auth: false
          }
        }
      ])
    }
  }
}
