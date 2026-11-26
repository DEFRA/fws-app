module.exports = [
  ...require('neostandard')({
    env: ['jest']
  }),
  {
    ignores: ['server/dist', 'service-down']
  }
]
