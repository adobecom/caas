const MAX_REQUIRED_INITIAL = 3;
const MAX_SELECTOR_LENGTH = 200;
const MAX_WHY_LENGTH = 240;

const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const asText = (value) => (value === undefined || value === null ? '' : String(value));
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function cleanRequirement(value) {
  const input = asObject(value);
  const selector = asText(input.selector).trim();
  if (!selector || selector.length > MAX_SELECTOR_LENGTH) return null;
  const minimum = Math.max(1, Math.min(5, Math.floor(Number(input.minMatches) || 1)));
  return { selector, minMatches: minimum, why: asText(input.why).slice(0, MAX_WHY_LENGTH) };
}

/**
 * Normalize the model-declared DOM prerequisites that must exist in the initial
 * POST render before its assertion can be meaningfully judged. They are not the
 * assertion itself: a true absence assertion should require a stable parent.
 */
export function normalizeRenderability(value) {
  const input = asObject(value);
  const seen = new Set();
  const requiredInitial = (Array.isArray(input.requiredInitial) ? input.requiredInitial : [])
    .map(cleanRequirement)
    .filter((requirement) => requirement && !seen.has(requirement.selector) && seen.add(requirement.selector))
    .slice(0, MAX_REQUIRED_INITIAL);
  return { requiredInitial };
}

/** A planner must make its positive initial-render proof explicit. */
export function requireRenderability(value) {
  const renderability = normalizeRenderability(value);
  if (!renderability.requiredInitial.length) {
    throw new Error('agent must declare at least one valid renderability.requiredInitial prerequisite');
  }
  return renderability;
}

/** Put prerequisite probes first so the bounded validation payload keeps them. */
export function prioritizeRenderabilityProbes(probes, renderability, maxProbes = 6) {
  const limit = Math.max(1, Math.min(6, Math.floor(Number(maxProbes) || 6)));
  const list = Array.isArray(probes) ? probes : [];
  const requirements = normalizeRenderability(renderability).requiredInitial;
  const bySelector = new Map();
  for (const probe of list) {
    const selector = asText(probe?.selector).trim();
    if (selector && !bySelector.has(selector)) bySelector.set(selector, probe);
  }
  const out = [];
  const used = new Set();
  for (const requirement of requirements) {
    const existing = bySelector.get(requirement.selector);
    out.push(existing || { selector: requirement.selector, attributes: [], why: requirement.why });
    used.add(requirement.selector);
  }
  for (const probe of list) {
    const selector = asText(probe?.selector).trim();
    if (!selector || used.has(selector)) continue;
    out.push(probe);
    used.add(selector);
  }
  return out.slice(0, limit);
}

/** Return only prerequisites that did not appear in the initial DOM render. */
export function findMissingRequiredInitial(observed, renderability) {
  const probes = Array.isArray(observed?.probes) ? observed.probes : [];
  const bySelector = new Map(probes.map((probe) => [asText(probe?.selector).trim(), probe]));
  return normalizeRenderability(renderability).requiredInitial.flatMap((requirement) => {
    const probe = bySelector.get(requirement.selector);
    const matches = Array.isArray(probe?.matches) ? probe.matches : [];
    const selectorError = matches.find((match) => match?.selectorError)?.selectorError;
    if (!selectorError && matches.length >= requirement.minMatches) return [];
    return [{
      ...requirement,
      actualMatches: matches.length,
      selectorError: selectorError ? asText(selectorError).slice(0, 300) : '',
    }];
  });
}

/**
 * A renderability retry may change only reproducible scenario inputs. Its exact
 * requirement, probes, and rendering contract stay frozen so it cannot turn an
 * initial failure into a different/easier feature test.
 */
export function applyScenarioRepair(originalPlan, rawRepair) {
  const original = asObject(originalPlan);
  const repair = asObject(rawRepair);
  const skipReason = asText(repair.skipReason).trim();
  if (skipReason) return { skipReason: skipReason.slice(0, 1000) };
  const immutable = ['sourceTest', 'expected', 'observe', 'mappingEvidence', 'probes', 'renderability'];
  for (const key of immutable) {
    if (Object.hasOwn(repair, key) && JSON.stringify(repair[key]) !== JSON.stringify(original[key])) {
      throw new Error(`renderability repair must not change ${key}`);
    }
  }
  if (!isPlainObject(repair.config) || !Array.isArray(repair.cards) || !Array.isArray(repair.filters)) {
    throw new Error('renderability repair must provide config, cards, and filters arrays');
  }
  return {
    ...original,
    config: repair.config,
    cards: repair.cards,
    filters: repair.filters,
    isHashed: Object.hasOwn(repair, 'isHashed') ? Boolean(repair.isHashed) : Boolean(original.isHashed),
  };
}
