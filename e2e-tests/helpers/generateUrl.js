// helpers/generateUrl.js
/* eslint-disable */
const structuredClone = require("@ungap/structured-clone").default;
/* eslint-enable */
const config = require('../config.json');

/**
 * Checks if a value is an object.
 * @param {any} item
 * @returns {boolean}
 */
const isObject = item => item && typeof item === 'object' && !Array.isArray(item);

/**
 * Deep merges two objects.
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
const mergeDeep = (target, source) => {
    const output = structuredClone(target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
};

/**
 * Generates a URL with the encoded configuration.
 * @param {Object} configOverrides - Configuration overrides for the test case.
 * @returns {string} - The complete URL to load.
 */
const generateUrl = (configOverrides = {}) => {
    const finalConfig = mergeDeep(config, configOverrides);
    const state = Buffer.from(JSON.stringify(finalConfig)).toString('base64');
    return `http://localhost:8000/html/e2e/index.html?state=${state}`;
};

module.exports = generateUrl;