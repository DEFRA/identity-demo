module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.view('home', {
        title: 'Hello',
        message: 'World'
      })
    },
    options: {
      auth: {
        mode: 'optional'
      }
    }
  }
]
