const Joi = require('joi')

const MINIMUM_REDIRECT_TOKEN_TTL = 1
const MAXIMUM_REDIRECT_TOKEN_TTL = 15
const DEFAULT_REDIRECT_TOKEN_TTL = 10

// Define config schema
const schema = Joi.object({
  port: Joi.number().default(3000),
  env: Joi.string().valid('dev', 'tst', 'pre', 'prd', 'tra').default('dev'),
  api: Joi.string().uri().required(),
  apiKey: Joi.string().required(),
  proxy: Joi.string().uri().allow(''),
  adClientId: Joi.string().required(),
  adClientSecret: Joi.string().required(),
  adTenant: Joi.string().required(),
  cookiePassword: Joi.string().required(),
  isSecure: Joi.boolean().default(false),
  forceHttps: Joi.boolean().default(false),
  homePage: Joi.string().default('http://localhost:3000'),
  localCache: Joi.boolean().default(true),
  redirectTokenTtl: Joi.number().integer().min(MINIMUM_REDIRECT_TOKEN_TTL).max(MAXIMUM_REDIRECT_TOKEN_TTL).default(DEFAULT_REDIRECT_TOKEN_TTL),
  redisHost: Joi.string().allow(''),
  redisPort: Joi.number().allow(''),
  redisTls: Joi.boolean().default(false),
  analyticsAccount: Joi.string().default(''),
  logLevel: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('info')
})

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
  homePage: process.env.HOME_PAGE,
  localCache: process.env.LOCAL_CACHE,
  redirectTokenTtl: process.env.REDIRECT_TOKEN_TTL_MINUTES,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisTls: process.env.REDIS_TLS,
  analyticsAccount: process.env.FWS_APP_GA_ID,
  logLevel: process.env.LOG_LEVEL
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the Joi validated value
const value = result.value

// Add some helper props
value.isDev = value.env === 'dev'
value.isProd = value.env === 'prd'
value.redirectTokenTtlMs = value.redirectTokenTtl * 60 * 1000

module.exports = value
