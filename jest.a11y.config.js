// Hermetic Jest config for a11y tests only
module.exports = {
  rootDir: __dirname,
  displayName: 'a11y',
  testEnvironment: 'jsdom',
  testRunner: 'jest-circus/runner',
  // Disable Babel transforms to avoid picking up legacy .babelrc
  transform: {},
  moduleFileExtensions: ['js', 'json', 'jsx'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testEnvironmentOptions: { url: 'http://localhost' },
  testMatch: [
    '**/?(*.)+(a11y.test).js?(x)',
    '**/?(*.)+(a11y.test).jsx',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage/a11y',
  coverageProvider: 'v8',
  coverageThreshold: {},
};
