const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const UNSAFE_CONFIG_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function clone(value, path = 'config') {
  if (Array.isArray(value)) return value.map((item, index) => clone(item, `${path}[${index}]`));
  if (isPlainObject(value)) {
    const output = {};
    for (const [key, item] of Object.entries(value)) {
      if (UNSAFE_CONFIG_KEYS.has(key)) throw new Error(`unsafe config key: ${path}.${key}`);
      output[key] = clone(item, `${path}.${key}`);
    }
    return output;
  }
  return value;
}

function isKnownDummyTransport(value) {
  // Do not silently erase a real endpoint/fallback feature. This only filters
  // obvious dummy URLs copied verbatim from unit tests (such as #223's
  // somedomain.com fixture), which cannot be reached by the browser harness.
  return /(?:^|[./_-])(?:somedomain|example|mocks?|fixtures?|fake|dummy)(?:$|[./_-])/i
    .test(String(value || ''));
}

const OWNED_PATH = /^[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*$/;

function safeOwnedPath(path) {
  return OWNED_PATH.test(path) && !path.split('.').some((part) => UNSAFE_CONFIG_KEYS.has(part));
}

function valueAtPath(value, parts) {
  return parts.reduce((current, key) => (isPlainObject(current) || Array.isArray(current)) ? current[key] : undefined, value);
}

function writePath(value, parts, replacement) {
  let target = value;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    if (!isPlainObject(target[key])) target[key] = {};
    target = target[key];
  }
  target[parts.at(-1)] = clone(replacement);
}

/**
 * A few fixture contracts own an entire nested config path. A normal deep merge
 * cannot clear a live map with `{}` (for example categoryMappings), so replace
 * only explicitly declared safe paths after the ordinary feature merge.
 */
export function replaceOwnedScenarioPaths(mergedConfig, patch, ownedPaths = []) {
  const merged = clone(mergedConfig);
  const source = isPlainObject(patch) ? patch : {};
  const paths = [...new Set((Array.isArray(ownedPaths) ? ownedPaths : []).map(String))].slice(0, 20);
  for (const ownedPath of paths) {
    if (!safeOwnedPath(ownedPath)) throw new Error(`unsafe owned config path: ${ownedPath}`);
    const parts = ownedPath.split('.');
    const replacement = valueAtPath(source, parts);
    if (replacement === undefined) throw new Error(`owned config path is missing from patch: ${ownedPath}`);
    writePath(merged, parts, replacement);
  }
  return merged;
}

/** Deep-merge a feature patch over a captured live config. Arrays are replaced. */
export function mergeScenarioConfig(base, patch) {
  if (!isPlainObject(base)) return clone(patch);
  if (!isPlainObject(patch)) return clone(patch);
  const output = clone(base);
  for (const [key, value] of Object.entries(patch)) {
    if (UNSAFE_CONFIG_KEYS.has(key)) throw new Error(`unsafe config key: patch.${key}`);
    output[key] = isPlainObject(value) && isPlainObject(output[key])
      ? mergeScenarioConfig(output[key], value) : clone(value);
  }
  return output;
}

/** Preserve live transport/defaults while isolating the crafted fixture cards. */
export function buildScenarioConfig(liveConfig, featurePatch, cardsOrCount, { ownedConfigPaths = [] } = {}) {
  const patch = clone(isPlainObject(featurePatch) ? featurePatch : {});
  // Preserve real endpoint/fallback changes. Only discard obvious unit-test
  // dummies: the browser harness deliberately intercepts the captured live
  // Chimera transport and cannot reach a copied fake URL.
  if (isPlainObject(patch.collection)) {
    for (const key of ['endpoint', 'fallbackEndpoint']) {
      if (isKnownDummyTransport(patch.collection[key])) delete patch.collection[key];
    }
  }
  let config = mergeScenarioConfig(liveConfig, patch);
  config = replaceOwnedScenarioPaths(config, patch, ownedConfigPaths);
  const cards = Array.isArray(cardsOrCount) ? cardsOrCount : [];
  if (!Object.hasOwn(patch, 'featuredCards')) config.featuredCards = [];
  if (!Object.hasOwn(patch, 'hideCtaIds')) config.hideCtaIds = [];
  if (!Object.hasOwn(patch, 'hideCtaTags')) config.hideCtaTags = [];
  config.collection = isPlainObject(config.collection) ? config.collection : {};
  const collectionPatch = isPlainObject(patch.collection) ? patch.collection : {};
  if (!Object.hasOwn(collectionPatch, 'cardStyle') && cards.some((card) => card?.styles?.typeOverride)) {
    config.collection.cardStyle = '';
  }
  const minimum = Math.max(1, Number(Array.isArray(cardsOrCount) ? cards.length : cardsOrCount) || 0);
  // Respect an explicit per-feature paging value (e.g. a pagination test that needs
  // resultsPerPage < card count to produce multiple pages); otherwise default to showing
  // every crafted card so nothing is truncated.
  if (!Object.hasOwn(collectionPatch, 'resultsPerPage')) {
    config.collection.resultsPerPage = Math.max(Number(config.collection.resultsPerPage) || 0, minimum);
  }
  if (!Object.hasOwn(collectionPatch, 'totalCardsToShow')) {
    config.collection.totalCardsToShow = Math.max(Number(config.collection.totalCardsToShow) || 0, minimum);
  }
  return config;
}

/**
 * Event sorting reads both dateDetailText and footer[0].left[1] without
 * optional chaining in historical CaaS builds. Keep an agent-crafted event
 * fixture structurally safe even when its assertion only needs a not-timed
 * card and therefore does not supply event dates itself.
 */
export function normalizeEventFixtureCards(cards, featurePatch) {
  const eventFilter = featurePatch?.filterPanel?.eventFilter;
  if (!eventFilter || !Array.isArray(cards)) return clone(cards);
  return cards.map((card) => {
    const contentArea = isPlainObject(card?.contentArea) ? clone(card.contentArea) : {};
    if (!isPlainObject(contentArea.dateDetailText)) contentArea.dateDetailText = {};
    const footer = Array.isArray(card?.footer) ? clone(card.footer) : [];
    const firstFooter = isPlainObject(footer[0]) ? footer[0] : {};
    const left = Array.isArray(firstFooter.left) ? firstFooter.left : [];
    while (left.length < 2) left.push({});
    if (!isPlainObject(left[1])) left[1] = {};
    footer[0] = { ...firstFooter, left };
    return { ...clone(card), contentArea, footer };
  });
}

/** Copy one unambiguous cardStyle literal from the changed spec into fixtures. */
export function applySpecCardStyle(cards, specText) {
  const styles = new Set([...String(specText || '').matchAll(/\bcardStyle\s*(?:=|:)\s*['"]([^'"]+)['"]/g)]
    .map((match) => match[1]));
  if (styles.size !== 1 || !Array.isArray(cards)) return { cards: clone(cards), style: null };
  const [style] = styles;
  return {
    style,
    cards: clone(cards).map((card) => ({ ...card, styles: { ...(card?.styles || {}), typeOverride: style } })),
  };
}
