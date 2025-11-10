module.exports = function createLoggingTarget (level) {
  const target = process.env.pm_cwd ? 'pino/file' : 'pino-pretty'
  let destination
  if (level === 'fatal' || level === 'error') {
    // stderr
    destination = 2
  } else {
    // stdout
    destination = 1
  }

  return {
    target,
    level,
    options: {
      destination
    }
  }
}
