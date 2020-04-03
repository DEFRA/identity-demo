module.exports = [
  {
    method: 'GET',
    path: '/account',
    handler: (request, h) => {
      return h.view('account')
    }
  }
]
