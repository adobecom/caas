// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
// Ensure Enzyme is configured even if setupFiles resolution fails in CI
require('./enzyme.config.js');

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

    coverageProvider: 'babel',

    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'json', 'jsx'],

    // Setup already required above for CI robustness
    // setupFilesAfterEnv: [require.resolve('./enzyme.config.js')],

    // The test environment that will be used for testing
    testEnvironment: 'jsdom',

    // Use Babel 7 just for Jest, ignoring project .babelrc (Babel 6)
    transform: {
        '^.+\\.[jt]sx?$': [
            'babel-jest',
            {
                babelrc: false,
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: { node: 'current' },
                            modules: 'commonjs',
                        },
                    ],
                    ['@babel/preset-react', { runtime: 'classic' }],
                ],
                plugins: [
                    ['@babel/plugin-transform-class-properties', { loose: true }],
                    ['@babel/plugin-transform-object-rest-spread', { loose: true }],
                    [
                        'istanbul',
                        {
                            exclude: [
                                '**/Modal/**',
                                '**/js/components/Consonant/Testing/**',
                                '**/app.jsx',
                                '**/ConsonantPageDOM.jsx',
                                '**/polyfills.js',
                                '**/watch.js',
                                '**/js/components/Consonant/Helpers/TestingConstants/**',
                                '**/__tests__/**',
                                '**/__test__/**',
                                '**/enzyme.config.js',
                                '**/*.config.js',
                            ],
                        },
                    ],
                ],
            },
        ],
    },

    // The glob patterns Jest uses to detect test files
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],

    testPathIgnorePatterns: ['\\\\node_modules\\\\', '__tests__/mocks', '__tests__/utils', '__tests__/constants'],

    testEnvironmentOptions: { url: 'http://localhost' },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],

    // Indicates whether each individual test should be reported during the run
    verbose: false,
};
