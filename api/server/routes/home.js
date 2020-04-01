module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        hello: 'world'
      }
    },
    options: {
      auth: false
    }
  }
]
