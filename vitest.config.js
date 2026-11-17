import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    // Force tests to use the server object cache by default
    env: { LOCAL_CACHE: 'true' },
    coverage: {
      provider: 'v8',
      include: ['server/**/*.js', 'index.js'],
      exclude: ['server/public/**', 'server/dist/**'],
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage'
    }
  }
})
