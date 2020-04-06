module.exports = {
  method: 'GET',
  path: '/protected',
  handler: (request, h) => {
    return {
      ok: 200,
      timestamp: new Date()
    }
  }
}
