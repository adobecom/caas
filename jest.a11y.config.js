// Jest configuration for accessibility tests only
const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  // Enable coverage reporting for a11y tests (no thresholds enforced)
  collectCoverage: true,
  coverageDirectory: 'coverage/a11y',
  collectCoverageFrom: baseConfig.collectCoverageFrom,
  coverageThreshold: {},
  // Only match *.a11y.test.js and *.a11y.test.jsx files
  testMatch: ['**/*.a11y.test.js', '**/*.a11y.test.jsx'],
};