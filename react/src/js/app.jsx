/* eslint-disable */
import "./polyfills";
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { DOMRegistry } from 'react-dom-components';
import { parseToPrimitive } from './components/Consonant/Helpers/general';
import { loadLana } from './components/Consonant/Helpers/lana';
import { initBeacon, beaconPageLoad } from './components/Consonant/Helpers/beacon';
import { initQaHooks } from './components/Consonant/Helpers/qa-hooks';
import Container from './components/Consonant/Container/Container';
import consonantPageRDC from './components/Consonant/Page/ConsonantPageDOM';

// Runtime accessibility auditing in development with react-axe
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    /* eslint-disable-next-line global-require */
    const ReactAxe = require('react-axe');
    ReactAxe(React, ReactDOM, 1000);

    // Babel 7 verification: Using modern JS features that require Babel 7+ plugins
    const babelVersion = {
        nullishCoalescing: undefined ?? 'babel7-supported', // Requires @babel/plugin-proposal-nullish-coalescing-operator
        optionalChaining: window?.navigator?.userAgent?.substring?.(0, 10) ?? 'babel7', // Requires @babel/plugin-proposal-optional-chaining
        numericSeparator: 1_000_000, // Requires @babel/plugin-proposal-numeric-separator
    };
    console.log('🎉 Babel 7 Upgrade Verified! Modern JS features compiled:', babelVersion);
}

const domRegistry = new DOMRegistry(React, render);
domRegistry.register({
    consonantPageRDC,
});

try {
    loadLana();
} catch (e) {
    window.lana = {
        log: () => {},
    }
}

// Initialize canary telemetry (consent-gated; idempotent).
try {
    initBeacon();
} catch (e) { /* never block boot on telemetry init */ }

// QA introspection API for headless agents. No side effects, idempotent.
// Exposes window.caas.{version, dump, waitForReady} and the caas:ready event.
try {
    initQaHooks();
} catch (e) { /* never block boot on QA hooks init */ }

// Must be constructible: Northstar uses bind/apply + new on this callback.
function initReact(element, registry) {
    if (registry === undefined) {
        registry = domRegistry;
    }
    registry.init(element);
}

initReact(document);

// Fire the page_load beacon after React is mounted.
try {
    beaconPageLoad();
} catch (e) { /* swallow */ }

function collectionLoadedThroughXf(el) {
    if (!el) return false; // Ensure el is not null or undefined
    const container = el.firstElementChild;
    let consonantCardCollection = null;
    if (container !== null) {
        consonantCardCollection = container.querySelectorAll('.consonantcardcollection');
    }
    return el.className.indexOf('experiencefragment') !== -1
        && consonantCardCollection !== null
        && consonantCardCollection.length > 0;
}

let prev = null;
function authorWatch(el, registry = domRegistry) {
    if (prev !== el && collectionLoadedThroughXf(el)) {
        prev = el;
        registry.render(consonantPageRDC);
    }
}

// Add to DXF Registry
try {
    window.dexter.dxf.registerApp(initReact);
} catch (e) {
    /* eslint-disable no-empty */
}

export class ConsonantCardCollecton {
    constructor(config, element) {
        ReactDOM.render((
            <React.Fragment>
                <Container config={parseToPrimitive(config)} />
            </React.Fragment>), element);
    }
}

window.ConsonantCardCollection = ConsonantCardCollecton;

if (window.Granite && window.dx) {
    window.dx.author.watch.registerFunction(authorWatch);
}
export { initReact, collectionLoadedThroughXf, authorWatch }; // Export the functions
export default initReact;
