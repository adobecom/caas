// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
// Ensure Enzyme is configured even if setupFiles resolution fails in CI
const path = require('path');

// Define File/Blob early to satisfy undici/jsdom when the environment initializes
(() => {
    try {
        if (typeof globalThis.File === 'undefined') {
            const { File } = require('fetch-blob/file.js');
            globalThis.File = File;
        }
        if (typeof globalThis.Blob === 'undefined') {
            const { Blob } = require('buffer');
            globalThis.Blob = globalThis.Blob || Blob;
        }
        // Polyfill Web Streams API early (ReadableStream, etc.) before undici/jsdom loads
        if (typeof globalThis.ReadableStream === 'undefined') {
            try {
                const streams = require('web-streams-polyfill/ponyfill/es2018');
                const { ReadableStream, WritableStream, TransformStream } = streams;
                globalThis.ReadableStream = ReadableStream;
                if (typeof globalThis.WritableStream === 'undefined') {
                    globalThis.WritableStream = WritableStream;
                }
                if (typeof globalThis.TransformStream === 'undefined') {
                    globalThis.TransformStream = TransformStream;
                }
            } catch (e) {
                // ignore if polyfill missing; Node >=18 typically provides these
            }
        }
    } catch (e) {
        // If fetch-blob isn't available, the custom env will attempt to define File later
    }
})();

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

    // Pre-test setup files (polyfills)
    setupFiles: [
        'whatwg-fetch',
        '<rootDir>/jest.setup.js',
    ],

    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'json', 'jsx'],

    // Setup again inside test environment for safety across runners
    setupFilesAfterEnv: [path.resolve(__dirname, 'enzyme.config.js')],

    // The test environment that will be used for testing
    testEnvironment: '<rootDir>/jest.env.jsdom.file.js',

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
                ],
            },
        ],
    },

    // The glob patterns Jest uses to detect test files
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],

    testPathIgnorePatterns: ['\\\\node_modules\\\\', '__tests__/mocks', '__tests__/utils', '__tests__/constants'],

    testEnvironmentOptions: { url: 'http://localhost' },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: {
        '^undici$': '<rootDir>/tests/setup/undici-shim.js',
    },

    // Indicates whether each individual test should be reported during the run
    verbose: false,
};
