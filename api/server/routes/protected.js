const { name } = require('../config')
const accessScope = `${name.toLowerCase()}:access:user-account`
// => 'elm:access:user-account' or 'grants:access:user-account'
const deleteScope = `${name.toLowerCase()}:delete:something`
// => 'elm:delete:something' or 'grants:delete:something'

module.exports = [
  {
    method: 'GET',
    path: '/protected',
    handler: (request, h) => {
      return {
        ok: 200,
        timestamp: new Date()
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
    method: 'DELETE',
    path: '/protected',
    handler: (request, h) => {
      return {
        ok: 200,
        timestamp: new Date()
      }
    },
    options: {
      auth: {
        access: {
          scope: [deleteScope]
        }
      }
    }
  }
]
