import React from 'react';
import { useConfig } from '../Helpers/hooks';
import { logLana } from '../Helpers/lana';

function isValidURL(string) {
    try {
        // eslint-disable-next-line no-new
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function transformLink(url, patterns) {
    for (const pattern of patterns) {
        const regex = new RegExp(pattern.from);
        if (regex.test(url)) {
            return url.replace(regex, pattern.to);
        }
    }
    return url;
}

function transformNestedProps(obj, hostnameTransforms) {
    if (typeof obj !== 'object' || obj === null) {
        return typeof obj === 'string' && isValidURL(obj) ? transformLink(obj, hostnameTransforms) : obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => transformNestedProps(item, hostnameTransforms));
    }

    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && isValidURL(value)) {
            newObj[key] = transformLink(value, hostnameTransforms);
        } else if (typeof value === 'object' && value !== null) {
            newObj[key] = transformNestedProps(value, hostnameTransforms);
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
