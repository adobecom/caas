exports.config = {
    specs: [
        './e2e-tests/specs/**/*.js',
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            args: [
                '--no-sandbox',
                '--disable-infobars',
                '--headless',
                '--disable-gpu',
                '--disable-http2', // Force HTTP/1.1
                '--disable-dev-shm-usage', // Avoid /dev/shm issues in Docker
                '--window-size=1440,735',
                '--ignore-certificate-errors', // sometimes needed if SSL handshake fails
                '--disable-web-security', // not typically recommended, but can help in some embed scenarios
            ],
        },
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },
};
