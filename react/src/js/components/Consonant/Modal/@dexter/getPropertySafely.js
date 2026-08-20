/* eslint-disable */
const _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; };

/**
 * @method getPropertySafely
 * @description Safe way to get a nested property. It can be used to safely retrieve
 * a nested property from an object without having to do all the checks (e.g. if an
 * object is undefined and you're trying to get `obj.property.nested.property` it will
 * throw an error).
 *
 * @memberOf Lang
 *
 * @param {Object} obj Object to retrieve nested property from
 * @param {String} path Path to the property to be retrieved
 *
 * @return {String|Array|Object|Function|undefined} Returns the value of the property or undefined
 *
 * @example
 * getPropertySafely({a: {b: 'c'}}, 'a.b') -> 'c'
 * getPropertySafely({a: {b: 'c'}}, 'a') -> {b: 'c'}
 * getPropertySafely({a: {b: 'c'}}, 'd.b') -> undefined
 */
export default function getPropertySafely(obj, propPath) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof propPath === 'string' && obj !== null && Object.keys(obj).length && propPath.length) {
        const path = propPath.split('.');
        const len = path.length;
        let current = obj;

        for (let i = 0; i < len; i += 1) {
            if (current === null || current === undefined || Number.isNaN(current)) {
                return i === len ? current : undefined;
            }

            if (Object.prototype.hasOwnProperty.call(current, path[i])) {
                current = current[path[i]];
            } else {
                return undefined;
            }
        }

        return current;
    }
    return undefined;
}
