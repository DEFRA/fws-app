const joi = require('joi')

// Define config schema
const schema = {
  port: joi.number().default(3000),
  env: joi.string().valid('dev', 'tst', 'pre', 'prd').default('dev'),
  api: joi.string().uri().required(),
  apiKey: joi.string().required(),
  proxy: joi.string().uri().allow(''),
  adClientId: joi.string().required(),
  adClientSecret: joi.string().required(),
  adTenant: joi.string().required(),
  cookiePassword: joi.string().required(),
  isSecure: joi.boolean().default(false),
  forceHttps: joi.boolean().default(false),
  homePage: joi.string().default('http://localhost:3000')
}

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.FWS_ENV_NAME,
  api: process.env.FWS_API_URL,
  apiKey: process.env.FWS_API_KEY,
  proxy: process.env.FWS_APP_PROXY,
  adClientId: process.env.AD_CLIENT_ID,
  adClientSecret: process.env.AD_CLIENT_SECRET,
  adTenant: process.env.AD_TENANT,
  cookiePassword: process.env.AD_COOKIE_PASSWORD,
  isSecure: process.env.IS_SECURE,
  forceHttps: process.env.FORCE_HTTPS,
  homePage: process.env.HOME_PAGE
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
