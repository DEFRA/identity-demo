const boom = require('@hapi/boom')
const wreck = require('@hapi/wreck')
const { api, name } = require('../config')

const accessScope = `${name.toLowerCase()}:access:user-account`
// => 'elm:access:user-account' or 'grants:access:user-account'
const deleteScope = `${name.toLowerCase()}:delete:something`
// => 'elm:delete:something' or 'grants:delete:something'

module.exports = [
  {
    method: 'GET',
    path: '/account',
    handler: (request, h) => {
      return h.view('account')
    },
    options: {
      auth: {
        access: {
          scope: [accessScope]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/account/access',
    handler: async (request, h) => {
      try {
        const token = request.auth.credentials.token.access_token
        const { payload } = await wreck.get(`${api}/protected`, {
          json: true,
          headers: {
            Authorization: token
          }
        })

        return h.view('account', { apiGetResponse: payload })
      } catch (err) {
        return boom.badRequest('An error occurred calling the API', err)
      }
    },
    options: {
      auth: {
        access: {
          scope: [accessScope]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/account/delete',
    handler: async (request, h) => {
      try {
        const token = request.auth.credentials.token.access_token
        const { payload } = await wreck.delete(`${api}/protected`, {
          json: true,
          headers: {
            Authorization: token
          }
        })

        return h.view('account', { apiDeleteResponse: payload })
      } catch (err) {
        return boom.badRequest('An error occurred calling the API', err)
      }
    },
    options: {
      // Ordinarily we would have this route with delete access scope
      // but we want to let it through to prove it fails at the API level
      auth: {
        access: {
          scope: [accessScope]
        }
      }
    }
  }
]
