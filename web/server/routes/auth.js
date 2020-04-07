const boom = require('@hapi/boom')

module.exports = [
  {
    method: 'GET',
    path: '/login',
    handler: async (request, h) => {
      if (!request.auth.isAuthenticated) {
        return boom.unauthorized('Authentication failed: ' + request.auth.error.message)
      }

      console.log('authenticated', request.auth.credentials)

      // Set the session
      const { credentials, artifacts: token } = request.auth
      const { displayName, email, id } = credentials.profile
      const namespace = 'https://defra.com'
      const raw = credentials.profile.raw
      const roles = raw[`${namespace}/roles`]
      const permissions = raw[`${namespace}/permissions`]
      const profile = { displayName, email, id, roles, permissions }

      request.cookieAuth.set({
        token,
        profile,
        scope: permissions
      })

      // Set cookie to expire at the same time as the token
      // TODO: Get refreshTokens isssuing?
      request.cookieAuth.ttl(request.auth.credentials.expiresIn * 1000)

      return h.redirect('/account')
    },
    options: {
      auth: {
        strategy: 'auth0'
      }
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
      auth: {
        mode: 'try',
        strategy: 'session'
      }
    }
  }
]
