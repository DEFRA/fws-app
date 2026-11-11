module.exports = [
  ...require('neostandard')({}),
  {
    languageOptions: {
      parserOptions: {
        // required by @hapi/lab's coverage instrumentation (@babel/eslint-parser)
        requireConfigFile: false
      }
    }
  },
  {
    ignores: [
      'server/dist/**',
      'service-down/**'
    ]
  }
]
