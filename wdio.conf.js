exports.config = {
    specs: [
        './e2e-tests/specs/**/*.js',
    ],
    // Patterns to exclude.
    exclude: [
        './e2e-tests/specs/bulk-publisher.e2e.js',
    ],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            // Pin the Chrome binary to the version set up by the workflow's
            // browser-actions/setup-chrome step. Without this, chromedriver
            // falls back to the runner's system Chrome (whose version drifts
            // with the ubuntu-latest image rotation) and fails with
            // "session not created: This version of ChromeDriver only
            // supports Chrome version <N>" when it doesn't match.
            ...(process.env.CHROME_BIN ? { binary: process.env.CHROME_BIN } : {}),
            args: [
                '--no-sandbox',
                '--disable-infobars',
                '--headless',
                '--disable-gpu',
                '--disable-http2', // Force HTTP/1.1
                '--disable-dev-shm-usage', // Avoid /dev/shm issues in Docker
                '--window-size=1440,735',
                '--ignore-certificate-errors', // sometimes needed if SSL handshake fails
                '--disable-web-security', // not typically recommended, but can help in some embed scenarios,
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                + 'AppleWebKit/537.36 (KHTML, like Gecko) '
                + 'Chrome/98.0.4758.102 Safari/537.36',
            ],
            w3c: true,
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
        timeout: 120000,
    },
};
