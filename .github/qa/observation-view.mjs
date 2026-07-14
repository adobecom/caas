// Build the validation payload so the planner's targeted probes (the actual assertion
// evidence) are ALWAYS present, while the whole LLM-facing view stays within `budget`.
//
// Two failure modes to avoid:
//   1. Probes serialize last in the raw `observed`; a naive slice() drops them on busy
//      pages, causing false POST_FAIL even though the feature rendered.
//   2. Always including probes+diagnostics in full can itself blow far past the budget
//      (thousands of match/diagnostic chars), overflowing the model context.
// So: put probes+diagnostics first, but BOUND them (cap matches, trim html, summarize
// diagnostics) via progressive tightening until they fit, then fill the remaining budget
// with generic DOM context. The full raw `observed` is preserved separately in artifacts;
// only this model-facing view is bounded.

const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const trim = (value, max) => (typeof value === 'string' && value.length > max ? value.slice(0, max) : value);

function boundProbe(probe, { maxMatches, htmlLen, textLen }) {
  const p = asObject(probe);
  const matches = Array.isArray(p.matches) ? p.matches : [];
  return {
    selector: p.selector,
    attributes: p.attributes,
    why: trim(p.why, 160),
    matchCount: matches.length,
    matches: matches.slice(0, maxMatches).map((match) => {
      const m = asObject(match);
      const out = { tag: m.tag, id: m.id, cls: trim(m.cls, 120), text: trim(m.text, textLen), attributes: m.attributes };
      if (htmlLen > 0 && m.html) out.html = trim(m.html, htmlLen);
      if (m.selectorError) out.selectorError = trim(m.selectorError, 200);
      return out;
    }),
  };
}

function summarizeArray(value, { sampleLen, maxSamples }) {
  const arr = Array.isArray(value) ? value : [];
  return {
    count: arr.length,
    samples: arr.slice(0, maxSamples).map((item) => trim(typeof item === 'string' ? item : JSON.stringify(item), sampleLen)),
  };
}

function boundDiagnostics(diagnostics, level) {
  const d = asObject(diagnostics);
  return {
    collectionRequests: summarizeArray(d.collectionRequests, level),
    pageErrors: summarizeArray(d.pageErrors, level),
    consoleErrors: summarizeArray(d.consoleErrors, level),
    requestFailures: summarizeArray(d.requestFailures, level),
  };
}

const LEVELS = [
  { maxMatches: 5, htmlLen: 300, textLen: 200, sampleLen: 300, maxSamples: 3 },
  { maxMatches: 3, htmlLen: 160, textLen: 160, sampleLen: 200, maxSamples: 3 },
  { maxMatches: 2, htmlLen: 80, textLen: 120, sampleLen: 120, maxSamples: 2 },
  { maxMatches: 1, htmlLen: 0, textLen: 90, sampleLen: 80, maxSamples: 1 },
];

export function buildValidationView(observed, budget = 18000) {
  const o = asObject(observed);
  const probes = Array.isArray(o.probes) ? o.probes : [];
  let priority = null;
  for (const level of LEVELS) {
    priority = {
      probes: probes.map((probe) => boundProbe(probe, level)),
      diagnostics: boundDiagnostics(o.diagnostics, level),
    };
    if (JSON.stringify(priority).length <= budget) break;
  }
  // Pathological fallback: keep selectors + match counts only, cap the probe list.
  if (JSON.stringify(priority).length > budget) {
    priority.probes = priority.probes.slice(0, 20).map((probe) => ({
      selector: trim(probe.selector, 200), attributes: probe.attributes, matchCount: probe.matchCount, matches: [],
    }));
  }
  const view = { ...priority };
  let remaining = budget - JSON.stringify(view).length;
  const genericKeys = ['cards', 'collectionRoots', 'headings', 'controls', 'filters', 'liveRegions'];
  for (const key of genericKeys) {
    if (remaining <= 2) break;
    const value = o[key];
    if (value === undefined) continue;
    const cost = (encoded) => encoded.length + key.length + 4;
    const whole = JSON.stringify(value);
    if (cost(whole) <= remaining) { view[key] = value; remaining -= cost(whole); continue; }
    if (!Array.isArray(value)) continue;
    const kept = [];
    let used = 2;
    for (const item of value) {
      const itemSize = JSON.stringify(item).length + 1;
      if (cost('') + used + itemSize > remaining) break;
      kept.push(item);
      used += itemSize;
    }
    if (kept.length) { view[key] = kept; remaining -= cost('') + used; }
  }
  return JSON.stringify(view);
}
