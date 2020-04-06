const joi = require('@hapi/joi')
const envs = ['dev', 'test', 'prod']

// Define config schema
const schema = joi.object().keys({
  host: joi.string().default('localhost'),
  port: joi.number().default(3001),
  env: joi.string().valid(...envs).default(envs[0]),
  name: joi.string().required(),
  domain: joi.string().required(),
  audience: joi.string().required()
})

// Build config
const config = {
  host: process.env.HOST,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  name: process.env.NAME,
  domain: process.env.DOMAIN,
  audience: process.env.AUDIENCE
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

value.isDev = value.env === 'dev'
value.isTest = value.env === 'test'
value.isProd = value.env === 'prod'

module.exports = value
