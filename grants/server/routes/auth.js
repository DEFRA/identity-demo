// const boom = require('@hapi/boom')
// const config = require('../config')
// const { callbackUrl } = config.auth
// const callbackPath = new URL(callbackUrl).pathname
// const shortId = () => Math.random().toString(36).substring(2)

// module.exports = [
//   {
//     method: 'get',
//     path: '/login',
//     options: {
//       auth: false,
//       handler: async (request, h) => {
//         const client = request.oidc.client

//         const state = shortId()
//         const scope = 'openid profile'
//         const callbackUrl = config.auth.callbackUrl

//         const redirectUrl = client.authorizationUrl({
//           redirect_uri: callbackUrl,
//           scope,
//           state
//         })

//         h.state('oidc', { state })

//         return h.redirect(redirectUrl).takeover()
//       }
//     }
//   },
//   {
//     method: 'GET',
//     path: callbackPath,
//     handler: async (request, h) => {
//       const cookie = request.state.oidc
//       const { state } = cookie

//       try {
//         const client = request.oidc.client
//         const token = await client.callback(callbackUrl, request.query, { state })
//         const profile = await client.userinfo(token)

//         h.unstate('oidc')
//         request.cookieAuth.set({ token, profile })

//         return h.redirect('/account')
//       } catch (err) {
//         request.log(['error', 'auth'], err)
//         return boom.unauthorized(err && err.message)
//       }
//     },
//     options: {
//       auth: false
//     }
//   },
//   {
//     method: 'get',
//     path: '/logout',
//     options: {
//       auth: false,
//       handler: function (request, h) {
//         request.cookieAuth.clear()
//         return h.redirect('/')
//       }
//     }
//   }
// ]
