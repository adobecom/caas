const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]));
  return value;
}

function isKnownDummyTransport(value) {
  // Do not silently erase a real endpoint/fallback feature. This only filters
  // obvious dummy URLs copied verbatim from unit tests (such as #223's
  // somedomain.com fixture), which cannot be reached by the browser harness.
  return /(?:^|[./_-])(?:somedomain|example|mocks?|fixtures?|fake|dummy)(?:$|[./_-])/i
    .test(String(value || ''));
}

/** Deep-merge a feature patch over a captured live config. Arrays are replaced. */
export function mergeScenarioConfig(base, patch) {
  if (!isPlainObject(base)) return clone(patch);
  if (!isPlainObject(patch)) return clone(patch);
  const output = clone(base);
  for (const [key, value] of Object.entries(patch)) {
    output[key] = isPlainObject(value) && isPlainObject(output[key])
      ? mergeScenarioConfig(output[key], value) : clone(value);
  }
  return output;
}

/** Preserve live transport/defaults while isolating the crafted fixture cards. */
export function buildScenarioConfig(liveConfig, featurePatch, cardsOrCount) {
  const patch = clone(isPlainObject(featurePatch) ? featurePatch : {});
  // Preserve real endpoint/fallback changes. Only discard obvious unit-test
  // dummies: the browser harness deliberately intercepts the captured live
  // Chimera transport and cannot reach a copied fake URL.
  if (isPlainObject(patch.collection)) {
    for (const key of ['endpoint', 'fallbackEndpoint']) {
      if (isKnownDummyTransport(patch.collection[key])) delete patch.collection[key];
    }
  }
  const config = mergeScenarioConfig(liveConfig, patch);
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
