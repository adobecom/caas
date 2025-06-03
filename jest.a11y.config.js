// Jest configuration for accessibility tests only
const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  // Disable coverage reporting for a11y tests
  collectCoverage: false,
  coverageDirectory: undefined,
  collectCoverageFrom: undefined,
  coverageThreshold: undefined,
  // Only match *.a11y.test.js and *.a11y.test.jsx files
  testMatch: ['**/*.a11y.test.js', '**/*.a11y.test.jsx'],
};