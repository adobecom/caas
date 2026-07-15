import assert from 'node:assert/strict';
import { test } from 'node:test';
import { qaBrowserBridgeInit } from './qa-browser-bridge.mjs';

function storage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) };
}

function element({ tag = 'DIV', id = '', cls = '', text = '', attributes = {}, html = '' } = {}) {
  return {
    tagName: tag,
    id,
    className: cls,
    textContent: text,
    outerHTML: html || `<${tag.toLowerCase()} id="${id}">${text}</${tag.toLowerCase()}>`,
    getAttribute: (name) => Object.hasOwn(attributes, name) ? attributes[name] : null,
  };
}

function withFakePage(selectors, callback) {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const connected = new Set(Object.values(selectors).flat());
  const fakeWindow = { location: { search: '?caasqa=1' }, localStorage: storage(), __caasQaConfigs: [{ collection: { endpoint: 'https://example.test/c' } }] };
  globalThis.window = fakeWindow;
  globalThis.document = {
    querySelectorAll(selector) {
      if (selector === '[') throw new Error('invalid selector');
      return selectors[selector] || [];
    },
    documentElement: { contains: (node) => connected.has(node) },
  };
  try { return callback({ fakeWindow, connected }); }
  finally {
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
}

test('bridge writes the next-navigation override and reports bounded, opt-in runtime state', () => {
  const card = element({ id: 'qa-card', cls: 'one-half consonant-Card', text: 'QA card', attributes: { 'data-country': 'us' } });
  withFakePage({ 'li#qa-card': [card] }, ({ fakeWindow }) => {
    qaBrowserBridgeInit({ collection: { cardStyle: 'one-half' }, _caasQaReplace: true });
    const withoutConfigs = fakeWindow.__caasQa.inspect({ probes: [{ selector: 'li#qa-card', attributes: ['data-country'] }], track: true });
    assert.equal(withoutConfigs.version, 1);
    assert.equal(withoutConfigs.gateEnabled, true);
    assert.equal(withoutConfigs.override.valid, true);
    assert.equal(withoutConfigs.override.replace, true);
    assert.equal(withoutConfigs.captured.count, 1);
    assert.equal(Object.hasOwn(withoutConfigs.captured, 'configs'), false);
    assert.equal(withoutConfigs.probes[0].matches[0].attributes['data-country'], 'us');
    assert.equal(withoutConfigs.trackedNodes.length, 1);
    const withConfigs = fakeWindow.__caasQa.inspect({ includeConfigs: true });
    assert.deepEqual(withConfigs.captured.configs, [{ collection: { endpoint: 'https://example.test/c' } }]);
  });
});

test('bridge handles malformed storage, selector errors, clearing, and tracked node removal safely', () => {
  const host = element({ id: 'caas', cls: 'caas-preview' });
  withFakePage({ '.caas-preview': [host] }, ({ fakeWindow, connected }) => {
    qaBrowserBridgeInit(null);
    fakeWindow.localStorage.setItem('caasQaConfig', '{not json');
    const malformed = fakeWindow.__caasQa.inspect({ probes: [{ selector: '[' }, { selector: '.caas-preview' }], track: true });
    assert.equal(malformed.override.valid, false);
    assert.ok(malformed.probes[0].matches[0].selectorError);
    assert.equal(malformed.trackedNodes[0].connected, true);
    connected.delete(host);
    const after = fakeWindow.__caasQa.inspect({});
    assert.equal(after.trackedNodes[0].connected, false);
    const cleared = fakeWindow.__caasQa.setOverride(null);
    assert.equal(cleared.ok, true);
    assert.equal(fakeWindow.__caasQa.inspect({}).override.present, false);
  });
});
