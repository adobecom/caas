// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
// Ensure Enzyme is configured even if setupFiles resolution fails in CI
const path = require('path');
require(path.resolve(__dirname, 'enzyme.config.js'));

module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['react/**/*.{js,jsx,mjs}', '!js/components/Consonant/Testing/**'],

    coveragePathIgnorePatterns: [
        'Modal',
        'js/components/Consonant/Testing/',
        'app.jsx',
        'ConsonantPageDOM.jsx',
        'polyfills.js',
        'watch.js',
        'js/components/Consonant/Helpers/TestingConstants',
        'react/src/js/events/',
    ],

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    coverageThreshold: {
        global: {
            branches: 85.44,
            functions: 96.5,
            lines: 98.15,
            statements: 97.91,
        },
    },

    // Older Jest versions don't support coverageProvider option

    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'json', 'jsx'],

    // Older Jest versions support a single setup file
    setupTestFrameworkScriptFile: path.resolve(__dirname, 'jest.setup.js'),

    // The test environment that will be used for testing
    testEnvironment: 'jsdom',

    // Use project Babel config (Babel 6) via babel-jest
    transform: { '^.+\\.jsx?$': 'babel-jest' },

    // The glob patterns Jest uses to detect test files
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],

    testPathIgnorePatterns: ['\\\\node_modules\\\\', '__tests__/mocks', '__tests__/utils', '__tests__/constants'],

    testEnvironmentOptions: { url: 'http://localhost' },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],

    // Indicates whether each individual test should be reported during the run
    verbose: false,
};
