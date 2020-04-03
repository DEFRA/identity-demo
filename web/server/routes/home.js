module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.view('home')
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  }
]
