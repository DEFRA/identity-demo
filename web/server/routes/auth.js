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
      const { credentials, artifacts } = request.auth

      request.cookieAuth.set({
        token: artifacts,
        profile: credentials.profile
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
