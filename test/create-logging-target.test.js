const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const lab = exports.lab = Lab.script()
const pino = require('pino')
const createLoggingTarget = require('../server/create-logging-target')

const ORIGINAL_ENV = process.env

lab.experiment('createLoggingTarget', () => {
  lab.beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })
  lab.after(() => {
    process.env = ORIGINAL_ENV
  })

  lab.test('it logs json to file when PM2 is in use', () => {
    process.env.pm_cwd = '/mock/path'

    const actual = Object.values(pino.levels.labels).map(level => createLoggingTarget(level))

    const targets = [...new Set(actual.map(({ target }) => target))]
    expect(targets).to.equal(['pino/file'])

    const destinations = Object.fromEntries(
      actual.map(({ level, options: { destination } }) => [level, destination])
    )
    expect(destinations).to.equal({
      trace: 1,
      debug: 1,
      info: 1,
      warn: 1,
      error: 2,
      fatal: 2
    })
  })
  lab.test('it logs pretty print to process when PM2 is not in use', () => {
    const actual = Object.values(pino.levels.labels).map(level => createLoggingTarget(level))

    const targets = [...new Set(actual.map(({ target }) => target))]
    expect(targets).to.equal(['pino-pretty'])

    const destinations = Object.fromEntries(
      actual.map(({ level, options: { destination } }) => [level, destination])
    )
    expect(destinations).to.equal({
      trace: 1,
      debug: 1,
      info: 1,
      warn: 1,
      error: 2,
      fatal: 2
    })
  })
})
