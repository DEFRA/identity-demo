const boom = require('@hapi/boom')
const wreck = require('@hapi/wreck')
const { api } = require('../config')

module.exports = [
  {
    method: 'GET',
    path: '/account',
    handler: (request, h) => {
      return h.view('account')
    }
  },
  {
    method: 'POST',
    path: '/account',
    handler: async (request, h) => {
      try {
        const token = request.auth.credentials.token.access_token
        const { payload } = await wreck.get(`${api}/protected`, {
          json: true,
          headers: {
            Authorization: token
          }
        })

        return h.view('account', { apiResponse: payload })
      } catch (err) {
        return boom.badRequest('An error occurred calling the API', err)
      }
    }
  }
]
