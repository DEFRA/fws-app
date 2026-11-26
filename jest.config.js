module.exports = {
  testEnvironment: 'node',
  restoreMocks: true,
  testMatch: ['**/test/**/*.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/test/data/',
    '<rootDir>/test/__mocks__',
    '<rootDir>/test/mock.js',
    '<rootDir>/test/server.js'
  ],
  moduleNameMapper: {
    'hapi-pino': '<rootDir>/test/__mocks__/hapi-pino.js'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/test/',
    '<rootDir>/jest.config.js',
    '<rootDir>/eslint.config.js'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['lcov', 'text'],
  coverageDirectory: 'coverage'
}
