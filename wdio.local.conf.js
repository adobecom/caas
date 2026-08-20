// eslint-disable-next-line import/extensions
const baseConfig = require('./wdio.conf.js').config;

exports.config = {
    ...baseConfig,
    services: ['devtools'],
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--no-sandbox',
                '--disable-infobars',
                '--disable-gpu',
                '--window-size=1440,735',
            ],
        },
    }],
    logLevel: 'error',
    // Other configurations...
};
