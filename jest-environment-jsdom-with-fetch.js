/**
 * Custom Jest environment to fix fetch support in Jest 30 with jsdom 26
 * jsdom 26 doesn't properly expose fetch, so we need to add it manually
 */
const JSDOMEnvironment = require('jest-environment-jsdom').default;

class JSDOMEnvironmentWithFetch extends JSDOMEnvironment {
    constructor(...args) {
        super(...args);

        // Add fetch support from Node.js (available in Node 18+)
        if (!this.global.fetch) {
            this.global.fetch = fetch;
            this.global.Headers = Headers;
            this.global.Request = Request;
            this.global.Response = Response;
        }
    }
}

module.exports = JSDOMEnvironmentWithFetch;
