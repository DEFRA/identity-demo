const config = require('../config')

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return config
    },
    options: {
      auth: false
    }
  }
]
