/* eslint-disable */
import "./polyfills";
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { DOMRegistry } from 'react-dom-components';
import { parseToPrimitive, applyQaConfigOverride } from './components/Consonant/Helpers/general';
import { loadLana } from './components/Consonant/Helpers/lana';
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

// Must be constructible: Northstar uses bind/apply + new on this callback.
function initReact(element, registry) {
    if (registry === undefined) {
        registry = domRegistry;
    }
    registry.init(element);
}

initReact(document);

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

// --- QA injection hook: window._qa = { config, cardPatch, patchTarget } ---
function _qaDeepMerge(t, src) {
    if (!src || typeof src !== 'object') return t;
    for (const k of Object.keys(src)) {
        const v = src[k];
        if (v && typeof v === 'object' && !Array.isArray(v)) {
            if (!t[k] || typeof t[k] !== 'object') t[k] = {};
            _qaDeepMerge(t[k], v);
        } else { t[k] = v; }
    }
    return t;
}
function _qaGateOpen() {
    // QA hooks are INERT unless the ?caasqa URL gate is present (same gate as
    // applyQaConfigOverride). Without it, a third-party script that sets window._qa
    // cannot override collection config or monkey-patch global fetch in production.
    try { return new URLSearchParams(window.location.search || '').has('caasqa'); }
    catch (e) { return false; }
}
function _qaApplyConfig(cfg) {
    if (!_qaGateOpen()) return cfg;
    try { if (window._qa && window._qa.config) _qaDeepMerge(cfg, window._qa.config); } catch (e) { /* noop */ }
    return cfg;
}
let _qaFetchPatched = false;
function _qaInstallFetchPatch() {
    if (!_qaGateOpen()) return;
    try {
        if (!window._qa || !window._qa.cardPatch || _qaFetchPatched) return;
        _qaFetchPatched = true;
        const orig = window.fetch.bind(window);
        window.fetch = function qaFetch(...args) {
            return orig(...args).then((resp) => {
                try {
                    return resp.clone().json().then((json) => {
                        if (json && Array.isArray(json.cards) && window._qa && window._qa.cardPatch) {
                            const t = window._qa.patchTarget;
                            let idxs;
                            if (t === 'all') idxs = json.cards.map((_, i) => i);
                            else if (typeof t === 'number') idxs = json.cards.slice(0, t).map((_, i) => i);
                            else idxs = json.cards.slice(0, 3).map((_, i) => i);
                            for (const i of idxs) _qaDeepMerge(json.cards[i], window._qa.cardPatch);
                            return new Response(JSON.stringify(json), { status: resp.status, statusText: resp.statusText, headers: resp.headers });
                        }
                        return resp;
                    }).catch(() => resp);
                } catch (e) { return resp; }
            });
        };
    } catch (e) { /* noop */ }
}

export class ConsonantCardCollecton {
    constructor(config, element) {
        const _qaCfg = applyQaConfigOverride(parseToPrimitive(config));
        _qaApplyConfig(_qaCfg);
        _qaInstallFetchPatch();
        ReactDOM.render((
            <React.Fragment>
                <Container config={_qaCfg} />
            </React.Fragment>), element);
    }
}

window.ConsonantCardCollection = ConsonantCardCollecton;

if (window.Granite && window.dx) {
    window.dx.author.watch.registerFunction(authorWatch);
}
export { initReact, collectionLoadedThroughXf, authorWatch }; // Export the functions
export default initReact;
