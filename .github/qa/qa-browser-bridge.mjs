export const QA_BROWSER_BRIDGE_VERSION = 1;

/**
 * This function is intentionally self-contained because Playwright serializes
 * it into a page before application JavaScript executes. Keep it generic: the
 * runner-side contract catalog owns all product-specific policy.
 */
export function qaBrowserBridgeInit(initialOverride) {
  const version = 1;
  const root = window;
  const doc = document;
  const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const text = (value) => (value === undefined || value === null ? '' : String(value));
  const unique = (values) => [...new Set(values)];
  const nodeIds = new WeakMap();
  const tracked = new Map();
  let nextNodeId = 1;
  const defaultAttributes = ['role', 'aria-label', 'aria-current', 'aria-live', 'data-testid',
    'data-country', 'data-card-url', 'data-caas-qa-target', 'href', 'src', 'alt', 'type', 'value'];

  const gateEnabled = () => {
    try { return new URLSearchParams(root.location?.search || '').has('caasqa'); } catch { return false; }
  };
  const overrideStatus = () => {
    let raw = '';
    try { raw = root.localStorage?.getItem('caasQaConfig') || ''; } catch { return { present: false, valid: false, replace: false, keys: [] }; }
    if (!raw) return { present: false, valid: true, replace: false, keys: [] };
    try {
      const parsed = JSON.parse(raw);
      if (!isObject(parsed)) return { present: true, valid: false, replace: false, keys: [] };
      return {
        present: true,
        valid: true,
        replace: parsed._caasQaReplace === true,
        targetIndex: Number.isInteger(parsed._caasQaTargetIndex) ? parsed._caasQaTargetIndex : undefined,
        targetTokenPresent: /^[A-Za-z0-9_-]{1,80}$/.test(text(parsed._caasQaTargetToken)),
        keys: Object.keys(parsed).filter((key) => key !== '_caasQaReplace').sort().slice(0, 40),
      };
    } catch { return { present: true, valid: false, replace: false, keys: [] }; }
  };
  const snapshot = (element, requested = []) => {
    const attributes = {};
    unique([...defaultAttributes, ...requested]).slice(0, 24).forEach((name) => {
      const value = element?.getAttribute?.(name);
      if (value !== null && value !== undefined) attributes[name] = text(value).slice(0, 500);
    });
    return {
      tag: element?.tagName?.toLowerCase?.(),
      id: element?.id || undefined,
      cls: text(element?.className).slice(0, 180) || undefined,
      text: text(element?.textContent).replace(/\s+/g, ' ').trim().slice(0, 300),
      attributes,
      html: text(element?.outerHTML).replace(/\s+/g, ' ').slice(0, 700),
    };
  };
  const cleanProbes = (value) => (Array.isArray(value) ? value : []).slice(0, 6).flatMap((probe) => {
    const selector = text(probe?.selector).trim();
    if (!selector || selector.length > 240) return [];
    const attributes = (Array.isArray(probe?.attributes) ? probe.attributes : []).map(text)
      .filter((name) => /^[a-zA-Z_:][-a-zA-Z0-9_:.]*$/.test(name)).slice(0, 12);
    return [{ selector, attributes, why: text(probe?.why).slice(0, 300) }];
  });
  const cleanTargetToken = (value) => {
    const token = text(value).trim();
    return /^[A-Za-z0-9_-]{1,80}$/.test(token) ? token : '';
  };
  const findTargetRoot = (token) => {
    if (!token) return null;
    try {
      return [...doc.querySelectorAll('[data-caas-qa-target]')]
        .find((element) => text(element?.getAttribute?.('data-caas-qa-target')) === token) || null;
    } catch { return null; }
  };
  const take = (selector, limit, attributes = [], track = false, targetRoot = null) => {
    try {
      const matches = [...doc.querySelectorAll(selector)]
        .filter((element) => !targetRoot || element === targetRoot || Boolean(targetRoot.contains?.(element)) ||
          Boolean(element?.contains?.(targetRoot)))
        .slice(0, limit);
      return matches.map((element) => {
        if (track) {
          if (!nodeIds.has(element)) nodeIds.set(element, String(nextNodeId++));
          tracked.set(nodeIds.get(element), { selector, element });
        }
        return snapshot(element, attributes);
      });
    } catch (error) { return [{ selectorError: text(error?.message || error).slice(0, 300) }]; }
  };
  const rootHints = () => [
    '.caas-preview[data-caas-block]',
    '[data-caas-block]',
    '.caas-preview',
    '[data-testid="consonant-CardsGrid"]',
  ].map((selector) => ({ selector, matches: take(selector, 1).filter((item) => !item.selectorError).length }))
    .filter(({ matches }) => matches > 0).slice(0, 4);
  const inspect = (options = {}) => {
    const probes = cleanProbes(options.probes);
    const trackedNow = Boolean(options.track);
    const targetToken = cleanTargetToken(options.targetToken);
    const targetRoot = findTargetRoot(targetToken);
    const scopedTake = (selector, limit, attributes = [], track = false) => (
      targetToken && !targetRoot ? [] : take(selector, limit, attributes, track, targetRoot)
    );
    const result = {
      version,
      gateEnabled: gateEnabled(),
      override: overrideStatus(),
      captured: { count: Array.isArray(root.__caasQaConfigs) ? root.__caasQaConfigs.length : 0 },
      rootHints: rootHints(),
      target: targetToken ? { token: targetToken, found: Boolean(targetRoot), root: targetRoot ? snapshot(targetRoot) : undefined } : undefined,
      probes: probes.map((probe) => ({ ...probe, matches: scopedTake(probe.selector, 20, probe.attributes, trackedNow) })),
      trackedNodes: [...tracked.entries()].slice(0, 40).map(([id, entry]) => ({
        id, selector: entry.selector, connected: Boolean(doc.documentElement?.contains?.(entry.element)),
      })),
    };
    if (options.includeConfigs) {
      try { result.captured.configs = JSON.parse(JSON.stringify(Array.isArray(root.__caasQaConfigs) ? root.__caasQaConfigs : [])); }
      catch { result.captured.configs = []; }
    }
    if (options.generic) {
      result.cards = scopedTake('.consonant-Card', 15);
      result.headings = scopedTake('h1,h2,h3,h4,h5,h6,[role="heading"]', 30);
      result.controls = scopedTake('label,button,input,select,[role="button"],[role="searchbox"]', 40);
      result.filters = scopedTake('[class*="Filter"],[class*="filter"]', 40);
      result.liveRegions = scopedTake('[aria-live],[role="status"],[role="alert"]', 20);
      result.collectionRoots = scopedTake('.consonant-CardsGrid,.caas-preview,.caas-config,[class*="consonant-Container"]', 20);
    }
    return result;
  };
  const setOverride = (configOrNull) => {
    try {
      if (configOrNull === null || configOrNull === undefined) {
        root.localStorage?.removeItem('caasQaConfig');
        return { ok: true, cleared: true, bytes: 0, replace: false };
      }
      if (!isObject(configOrNull)) return { ok: false, error: 'override must be an object or null' };
      const raw = JSON.stringify(configOrNull);
      if (raw.length > 1024 * 1024) return { ok: false, error: 'override exceeds 1 MiB' };
      root.localStorage?.setItem('caasQaConfig', raw);
      return { ok: true, cleared: false, bytes: raw.length, replace: configOrNull._caasQaReplace === true };
    } catch (error) { return { ok: false, error: text(error?.message || error).slice(0, 300) }; }
  };
  root.__caasQa = { version, setOverride, inspect };
  if (initialOverride === null || initialOverride === undefined) setOverride(null);
  else setOverride(initialOverride);
}

export async function installQaBrowserBridge(page, initialOverride = null) {
  await page.addInitScript(qaBrowserBridgeInit, initialOverride);
}

export async function inspectQaBrowserBridge(page, options = {}) {
  return page.evaluate((input) => {
    if (!window.__caasQa?.inspect) return { bridgeError: 'QA_BROWSER_BRIDGE_UNAVAILABLE' };
    return window.__caasQa.inspect(input);
  }, options);
}
