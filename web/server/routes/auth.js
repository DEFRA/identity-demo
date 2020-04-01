const boom = require('@hapi/boom')
const config = require('../config')
// const { roles } = require('../models/roles')

module.exports = [
  {
    method: 'get',
    path: '/login',
    options: {
      auth: 'oidc',
      handler: async (request, h) => {
        if (!request.auth.isAuthenticated) {
          const message = request.auth.error && request.auth.error.message
          return boom.unauthorized(`Authentication failed due to: ${message}`)
        }

        const credentials = request.auth.credentials
        const redirectTo = credentials.query && credentials.query.redirectTo
        return h.redirect(redirectTo || '/account')
      }
    }
  },
  {
    method: 'get',
    path: '/logout',
    options: {
      auth: false,
      handler: function (request, h) {
        return h.redirect('/').unstate('oidc')
      }
    }
  }
]
