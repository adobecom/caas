require('dotenv').config();

exports.config = {
    specs: [
        './e2e-tests/specs/bulk-publisher.e2e.js',
    ],
    maxInstances: 1,
    capabilities: [{
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
                '--headless',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--window-size=1440,900',
                '--ignore-certificate-errors',
            ],
        },
    }],
    logLevel: 'warn',
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver', 'devtools'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
    },
};
