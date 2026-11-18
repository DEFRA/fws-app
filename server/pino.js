import pino from 'pino'
import config from './config.js'
import createLoggingTarget from './create-logging-target.js'

export default pino({
  level: config.logLevel.toLowerCase(),
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {},
  formatters: {
    level: (label, number) => ({
      logLevel: label.toUpperCase(),
      level: number
    })
  }
}, pino.transport({
  targets: [
    createLoggingTarget('fatal'),
    createLoggingTarget('error'),
    createLoggingTarget('warn'),
    createLoggingTarget('info'),
    createLoggingTarget('debug'),
    createLoggingTarget('trace')
  ],
  dedupe: true
}))
