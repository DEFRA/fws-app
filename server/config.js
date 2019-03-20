const joi = require('joi')

// Define config schema
const schema = {
  port: joi.number().default(3000),
  env: joi.string().valid('dev', 'tst', 'prd').default('dev'),
  api: joi.string().uri().required(),
  apiKey: joi.string().required(),
  proxy: joi.string().uri()
}

// Build config
const config = {
  env: process.env.FWS_ENV_NAME,
  api: process.env.FWS_API,
  apiKey: process.env.FWS_API_KEY,
  proxy: process.env.FWS_APP_PROXY
}

// Validate config
const result = joi.validate(config, schema, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

// Add some helper props
value.isDev = value.env === 'dev'
value.isProd = value.env === 'prd'

module.exports = value
