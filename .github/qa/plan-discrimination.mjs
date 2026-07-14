function text(value) {
  return value === undefined || value === null ? '' : String(value);
}

/**
 * A configured style name echoed unchanged into a class/data attribute is not
 * evidence that the historical feature changed behavior: pre-existing generic
 * plumbing can emit the same literal. Challenge that narrow plan shape once so
 * the planner finds post-only markup or explicitly calls the work visual-only.
 */
export function needsConfigEchoChallenge(plan = {}) {
  const style = text(plan?.configPatch?.collection?.cardStyle || plan?.config?.collection?.cardStyle).trim();
  if (!style) return false;
  const expected = text(plan.expected).toLowerCase();
  const probes = Array.isArray(plan.probes) ? plan.probes : [];
  const probeText = probes.map((probe) => [probe?.selector, probe?.attributes, probe?.why]
    .map(text).join(' ')).join(' ').toLowerCase();
  const styleLiteral = style.toLowerCase();
  const onlyClassOrDataEvidence = /(?:class|data-card-style)/.test(expected) || /(?:class|data-card-style)/.test(probeText);
  const semanticEffect = /(?:footer|btninfobit|\bcta\b|\bbutton\b|\breverse\b|light-text|transparent|aria-|\bhref\b)/.test(`${expected} ${probeText}`);
  return expected.includes(styleLiteral) && onlyClassOrDataEvidence && !semanticEffect;
}
