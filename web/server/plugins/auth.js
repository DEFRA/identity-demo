const Hoek = require('@hapi/hoek')
const { Issuer } = require('openid-client')

const COOKIE_DEFAULTS = {
  isSameSite: 'Lax',
  path: '/',
  ttl: 3600 * 1000,
  encoding: 'iron',
  isSecure: false,
  clearInvalid: true
}

const PLUGIN_DEFAULTS = {
  cookie: 'oidc',
  scope: 'openid profile'
}

const scheme = ({ cookieName, callbackUrl, scope, client }) => (server, options) => {
  const schemeConfig = Hoek.applyToDefaults(COOKIE_DEFAULTS, options)

  server.state(cookieName, schemeConfig)

  return {
    authenticate: async (request, h) => {
      const oidc = request.state[cookieName]

      if (oidc) {
        const { credentials, artifacts } = oidc
        return h.authenticated({ credentials, artifacts })
      }

      const state = request.route.path

      h.state(cookieName, { state })

      const redirectUrl = client.authorizationUrl({
        redirect_uri: callbackUrl,
        scope,
        state
      })

      // return h.response(`<html><head><meta http-equiv="refresh" content="0;URL='${redirectUrl}'"></head><body></body></html>`).takeover()
      return h.redirect(redirectUrl).takeover()
    }
  }
}

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server, options) => {
      const config = Hoek.applyToDefaults(PLUGIN_DEFAULTS, options)

      // Validate config
      if (!config.clientId || !config.clientSecret) throw new Error('You must provide a clientId and a clientSecret')
      if (!config.callbackUrl) throw new Error('You must provide a callbackUrl')
      if (!config.discoveryUrl) throw new Error('You must provide a discoveryUrl')

      const cookieName = config.cookie
      const issuer = await Issuer.discover(config.discoveryUrl)
      const client = new issuer.Client({
        client_id: config.clientId,
        client_secret: config.clientSecret
      })

      server.route({
        method: 'GET',
        path: new URL(config.callbackUrl).pathname,
        handler: async (request, h) => {
          const cookie = request.state[cookieName]
          const { state } = cookie

          try {
            const token = await client.callback(
              config.callbackUrl, request.query, { state }
            )

            const userInfos = await client.userinfo(token)

            h.state(cookieName, { credentials: token, artifacts: userInfos })

            return h.redirect(state).takeover()
          } catch (err) {
            request.log(['error', 'auth'], err.error_description)
            throw err
          }
        },
        options: {
          auth: false
        }
      })

      server.auth.scheme('oidc', scheme({
        cookieName, callbackUrl: config.callbackUrl, scope: config.scope, client
      }))
    }
  }
}
