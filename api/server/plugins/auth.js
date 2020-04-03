const jwt = require('hapi-auth-jwt2')
const jwksRsa = require('jwks-rsa')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server, options) => {
      const { auth0Domain } = options

      await server.register(jwt)

      const validate = async (decoded, request) => {
        const namespace = 'https://defra.net'

        if (decoded && decoded.sub) {
          const authz = decoded[`${namespace}/authz`]
          const userId = decoded[`${namespace}/userId`]
          const { tenantId } = request.params

          if (Array.isArray(authz)) {
            if (tenantId) {
              const tenant = authz.find(t => t.tenantId === +tenantId)

              return {
                isValid: true,
                credentials: {
                  userId,
                  tenant,
                  scope: tenant && tenant.permissions,
                  token: decoded
                }
              }
            } else {
              return {
                isValid: true,
                credentials: {
                  userId,
                  scope: [],
                  token: decoded
                }
              }
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
          jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
        }),
        verifyOptions: {
          audience: 'https://defra.auth0.com',
          issuer: `https://${auth0Domain}/`,
          algorithms: ['RS256']
        },
        validate
      })

      server.auth.default('jwt')
    }
  }
}
