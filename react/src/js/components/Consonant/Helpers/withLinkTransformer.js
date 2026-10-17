import React, { isValidElement } from 'react';
import safeRegex from 'safe-regex';
import { useConfig } from '../Helpers/hooks';
import { logLana } from '../Helpers/lana';

// hostnameTransforms patterns can come from localStorage (user/browser-controlled),
// so they must be validated before being compiled into a RegExp to avoid a
// catastrophic-backtracking reDOS. MAX_PATTERN_LENGTH keeps any backtracking
// search space bounded even for patterns safeRegex's heuristic doesn't catch.
const MAX_PATTERN_LENGTH = 200;

function isValidURL(string) {
    try {
        // eslint-disable-next-line no-new
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function isSafePattern(pattern) {
    return typeof pattern === 'string'
        && pattern.length > 0
        && pattern.length <= MAX_PATTERN_LENGTH
        && safeRegex(pattern);
}

function transformLink(url, patterns) {
    for (const pattern of patterns) {
        if (!isSafePattern(pattern.from)) {
            logLana({ message: 'Skipping unsafe or invalid link transform pattern', tags: 'linkTransformer' });
            // eslint-disable-next-line no-continue
            continue;
        }
        let regex;
        try {
            regex = new RegExp(pattern.from);
        } catch (error) {
            logLana({ message: 'Invalid link transform pattern', tags: 'linkTransformer', e: error });
            // eslint-disable-next-line no-continue
            continue;
        }
        if (regex.test(url)) {
            return url.replace(regex, pattern.to);
        }
    }
    return url;
}

function transformNestedProps(obj, hostnameTransforms, seen = new WeakSet()) {
    // Skips React elements as they contain cycles
    if (isValidElement(obj)) {
        return obj;
    }
    if (typeof obj !== 'object' || obj === null) {
        return typeof obj === 'string' && isValidURL(obj) ? transformLink(obj, hostnameTransforms) : obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => transformNestedProps(item, hostnameTransforms, seen));
    }

    if (seen.has(obj)) {
        return obj;
    }
    seen.add(obj);

    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && isValidURL(value)) {
            newObj[key] = transformLink(value, hostnameTransforms, seen);
        } else if (typeof value === 'object' && value !== null) {
            newObj[key] = transformNestedProps(value, hostnameTransforms, seen);
        } else {
            newObj[key] = value;
        }
    }
    return newObj;
}

function getLocalStorageSettings() {
    try {
        const settings = localStorage.getItem('linkTransformerSettings');
        return settings ? JSON.parse(settings) : {};
    } catch (error) {
        logLana({ message: 'Error reading from localStorage:', tags: 'linkTransformer', e: error }); // here
        return {}; // here
    }
}

function withLinkTransformer(Component) {
    return function WrappedComponent(props) {
        const getConfig = useConfig();
        const configEnabled = getConfig('linkTransformer', 'enabled') || false;
        const configHostnameTransforms = getConfig('linkTransformer', 'hostnameTransforms') || [];

        const localStorageSettings = getLocalStorageSettings();
        // eslint-disable-next-line max-len
        const localStorageEnabled = localStorageSettings && localStorageSettings.enabled !== undefined ? localStorageSettings.enabled : false;

        const enabled = configEnabled || localStorageEnabled;
        // eslint-disable-next-line max-len
        const haveLocalStorageHostnameTransforms = localStorageEnabled && localStorageSettings.hostnameTransforms;
        // eslint-disable-next-line max-len
        const hostnameTransforms = haveLocalStorageHostnameTransforms ? localStorageSettings.hostnameTransforms : configHostnameTransforms;

        const transformedProps = React.useMemo(() => {
            if (!enabled) return props;
            return transformNestedProps(props, hostnameTransforms);
        }, [enabled, hostnameTransforms, props]);

        return <Component {...transformedProps} />;
    };
}

export default withLinkTransformer;
