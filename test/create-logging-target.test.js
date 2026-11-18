import { describe, test, expect, beforeEach, afterAll } from 'vitest'
import pino from 'pino'
import createLoggingTarget from '../server/create-logging-target.js'

const ORIGINAL_ENV = process.env

describe('createLoggingTarget', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })
  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  test('it logs json to file when PM2 is in use', () => {
    process.env.pm_cwd = '/mock/path'

    const actual = Object.values(pino.levels.labels).map(level => createLoggingTarget(level))

    const targets = [...new Set(actual.map(({ target }) => target))]
    expect(targets).toEqual(['pino/file'])

    const destinations = Object.fromEntries(
      actual.map(({ level, options: { destination } }) => [level, destination])
    )
    expect(destinations).toEqual({
      trace: 1,
      debug: 1,
      info: 1,
      warn: 1,
      error: 2,
      fatal: 2
    })
  })
  test('it logs pretty print to process when PM2 is not in use', () => {
    const actual = Object.values(pino.levels.labels).map(level => createLoggingTarget(level))

    const targets = [...new Set(actual.map(({ target }) => target))]
    expect(targets).toEqual(['pino-pretty'])

    const destinations = Object.fromEntries(
      actual.map(({ level, options: { destination } }) => [level, destination])
    )
    expect(destinations).toEqual({
      trace: 1,
      debug: 1,
      info: 1,
      warn: 1,
      error: 2,
      fatal: 2
    })
  })
})
