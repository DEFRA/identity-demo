module.exports = [
  {
    method: 'GET',
    path: '/protected',
    handler: (request, h) => {
      return h.view('home', {
        title: 'Hello',
        message: 'World'
      })
    }
  }
]
