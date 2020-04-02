module.exports = [
  {
    method: 'GET',
    path: '/robots.txt',
    handler: {
      file: 'server/public/static/robots.txt'
    },
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/assets/all.js',
    handler: {
      file: 'node_modules/govuk-frontend/govuk/all.js'
    },
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/assets/{path*}',
    handler: {
      directory: {
        path: [
          'server/public/static',
          'server/public/build',
          'node_modules/govuk-frontend/govuk/assets'
        ]
      }
    },
    options: {
      auth: false
    }
  }
]
