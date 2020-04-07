const jwksRsa = require('jwks-rsa')
const jwt = require('hapi-auth-jwt2')
const { audience, domain } = require('../config')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server, options) => {
      await server.register(jwt)

      const validate = async (decoded, request) => {
        const namespace = 'https://defra.com'

        if (decoded && decoded.sub) {
          const permissions = decoded[`${namespace}/permissions`]
          const roles = decoded[`${namespace}/roles`]

          return {
            isValid: true,
            credentials: {
              permissions,
              roles,
              scope: permissions,
              token: decoded
            }
          }
        }

        return {
          isValid: false
        }
      }

      server.auth.strategy('jwt', 'jwt', {
        complete: true,
        // Verify the Access Token against the remote Auth0 JWKS
        key: jwksRsa.hapiJwt2KeyAsync({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${domain}/.well-known/jwks.json`
        }),
        verifyOptions: {
          audience: audience,
          issuer: `https://${domain}/`,
          algorithms: ['RS256']
        },
        validate
      })

      server.auth.default('jwt')
    }
  }
}
