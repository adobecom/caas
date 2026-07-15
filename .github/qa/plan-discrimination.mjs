function text(value) {
  return value === undefined || value === null ? '' : String(value);
}

function cardStyle(plan = {}) {
  return text(plan?.configPatch?.collection?.cardStyle || plan?.config?.collection?.cardStyle).trim();
}

function requestedAttributes(probes) {
  return probes.flatMap((probe) => Array.isArray(probe?.attributes) ? probe.attributes : [])
    .map((attribute) => text(attribute).trim().toLowerCase())
    .filter(Boolean);
}

function isIndependentAttribute(attribute) {
  return /^(?:data-(?!card-style$|config$|testid$)[a-z0-9-]+|aria-[a-z0-9-]+|href|role|value|title)$/.test(attribute);
}

function hasIndependentDomOutput(expected, probes, attributes) {
  // A requested attribute alone is not evidence that the feature changed it:
  // a planner can ask for `id` or `style` while still proving only a generic
  // class echo. Require the independent output to be part of the assertion.
  const assertionText = `${expected} ${probes.map((probe) => text(probe?.why)).join(' ')}`.toLowerCase();
  if (attributes.some((attribute) => isIndependentAttribute(attribute) && assertionText.includes(attribute))) return true;
  // These are observable outputs beyond generic style propagation. Keep the
  // config-echo challenge narrow: a plan can use a class to scope its card
  // while still asserting a newly introduced attribute, link, role, or text.
  return /\b(?:data-(?!(?:card-style|config|testid)\b)[a-z0-9-]+|aria-[a-z0-9-]+|href|text(?:content)?|title|role|value|count|order|position)\b/i
    .test(assertionText);
}

/**
 * A configured style name echoed unchanged into a class/data attribute is not
 * evidence that the historical feature changed behavior: pre-existing generic
 * plumbing can emit the same literal. Challenge that narrow plan shape once so
 * the planner finds post-only markup or explicitly calls the work visual-only.
 */
export function needsConfigEchoChallenge(plan = {}) {
  const style = cardStyle(plan);
  if (!style) return false;
  const expected = text(plan.expected).toLowerCase();
  const probes = Array.isArray(plan.probes) ? plan.probes : [];
  const probeText = probes.map((probe) => [probe?.selector, probe?.attributes, probe?.why]
    .map(text).join(' ')).join(' ').toLowerCase();
  const attributes = requestedAttributes(probes);
  const styleLiteral = style.toLowerCase();
  const onlyClassOrDataEvidence = /(?:class|data-card-style)/.test(expected) || /(?:class|data-card-style)/.test(probeText);
  const semanticEffect = /(?:footer|btninfobit|\bcta\b|\bbutton\b|\breverse\b|light-text|transparent)/.test(`${expected} ${probeText}`)
    || hasIndependentDomOutput(expected, probes, attributes);
  return expected.includes(styleLiteral) && onlyClassOrDataEvidence && !semanticEffect;
}

/**
 * The one-time replan may strengthen an assertion, but it must remain about
 * the same changed test and the same configured style. Otherwise an agent can
 * quietly switch to a different easy change in a broad PR and misattribute a
 * PRE/POST difference to the rejected style feature.
 */
export function configEchoContract(plan = {}) {
  return {
    sourceTest: text(plan.sourceTest).trim(),
    cardStyle: cardStyle(plan),
  };
}

export function enforceConfigEchoContract(contract = {}, replacement = {}) {
  const sourceTest = text(contract.sourceTest).trim();
  const style = text(contract.cardStyle).trim();
  if (replacement.skipReason) {
    if (!text(replacement.sourceTest).trim()) replacement.sourceTest = sourceTest;
    return replacement;
  }
  if (!sourceTest || text(replacement.sourceTest).trim() !== sourceTest) {
    throw new Error('config-echo replan changed the selected source test');
  }
  if (!style || cardStyle(replacement) !== style) {
    throw new Error('config-echo replan changed the selected cardStyle');
  }
  return replacement;
}
