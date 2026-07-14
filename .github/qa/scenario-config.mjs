const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]));
  return value;
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
export function buildScenarioConfig(liveConfig, featurePatch, cardCount) {
  const config = mergeScenarioConfig(liveConfig, featurePatch);
  const patch = isPlainObject(featurePatch) ? featurePatch : {};
  if (!Object.hasOwn(patch, 'featuredCards')) config.featuredCards = [];
  if (!Object.hasOwn(patch, 'hideCtaIds')) config.hideCtaIds = [];
  if (!Object.hasOwn(patch, 'hideCtaTags')) config.hideCtaTags = [];
  config.collection = isPlainObject(config.collection) ? config.collection : {};
  const minimum = Math.max(1, Number(cardCount) || 0);
  config.collection.resultsPerPage = Math.max(Number(config.collection.resultsPerPage) || 0, minimum);
  config.collection.totalCardsToShow = Math.max(Number(config.collection.totalCardsToShow) || 0, minimum);
  return config;
}
