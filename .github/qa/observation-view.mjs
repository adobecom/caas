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
const asText = (value) => (value === undefined || value === null ? '' : String(value));
const trim = (value, max) => {
  const text = asText(value);
  return text.length > max ? text.slice(0, max) : text;
};
const encoded = (value) => JSON.stringify(value);
const fits = (value, budget) => encoded(value).length <= budget;

const MAX_PROBES = 6;
const MAX_REQUESTED_ATTRIBUTES = 12;
const MAX_OBSERVED_ATTRIBUTES = 8;

function boundRequestedAttributes(value) {
  return (Array.isArray(value) ? value : []).slice(0, MAX_REQUESTED_ATTRIBUTES)
    .map((name) => trim(name, 64));
}

function boundObservedAttributes(value) {
  return Object.fromEntries(Object.entries(asObject(value)).slice(0, MAX_OBSERVED_ATTRIBUTES)
    .map(([name, attributeValue]) => [trim(name, 64), trim(attributeValue, 80)]));
}

function boundProbe(probe, { maxMatches, htmlLen, textLen }) {
  const p = asObject(probe);
  const matches = Array.isArray(p.matches) ? p.matches : [];
  return {
    selector: trim(p.selector, 200),
    attributes: boundRequestedAttributes(p.attributes),
    why: trim(p.why, 160),
    matchCount: matches.length,
    matches: matches.slice(0, maxMatches).map((match) => {
      const m = asObject(match);
      const out = {
        tag: trim(m.tag, 40),
        id: trim(m.id, 120),
        cls: trim(m.cls, 120),
        text: trim(m.text, textLen),
        attributes: boundObservedAttributes(m.attributes),
      };
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

function compactPriority(probes, diagnostics) {
  const d = asObject(diagnostics);
  return {
    probes: probes.map((probe) => {
      const p = asObject(probe);
      return {
        selector: trim(p.selector, 48),
        matchCount: Array.isArray(p.matches) ? p.matches.length : 0,
      };
    }),
    diagnostics: Object.fromEntries(['collectionRequests', 'pageErrors', 'consoleErrors', 'requestFailures']
      .map((key) => [key, Array.isArray(d[key]) ? d[key].length : 0])),
  };
}

function smallestPriority(probes) {
  const first = probes[0];
  if (!first) return { probes: [] };
  const p = asObject(first);
  return {
    probes: [{ selector: trim(p.selector, 16), matchCount: Array.isArray(p.matches) ? p.matches.length : 0 }],
  };
}

export function buildValidationView(observed, budget = 18000) {
  const numericBudget = Number(budget);
  const limit = Number.isFinite(numericBudget) ? Math.max(2, Math.floor(numericBudget)) : 18000;
  const o = asObject(observed);
  const probes = (Array.isArray(o.probes) ? o.probes : []).slice(0, MAX_PROBES);
  let priority = null;
  for (const level of LEVELS) {
    priority = {
      probes: probes.map((probe) => boundProbe(probe, level)),
      diagnostics: boundDiagnostics(o.diagnostics, level),
    };
    if (fits(priority, limit)) break;
  }
  // If the bounded evidence is still too large (for example because every character
  // needs JSON escaping), degrade through valid, deterministic JSON views. Never slice
  // JSON text: raw observations remain in the artifact, while this payload must fit.
  if (!fits(priority, limit)) priority = compactPriority(probes, o.diagnostics);
  if (!fits(priority, limit)) priority = smallestPriority(probes);
  if (!fits(priority, limit)) priority = { probes: [] };
  if (!fits(priority, limit)) priority = {};
  const view = { ...priority };
  let remaining = limit - encoded(view).length;
  const genericKeys = ['cards', 'collectionRoots', 'headings', 'controls', 'filters', 'liveRegions'];
  for (const key of genericKeys) {
    if (remaining <= 2) break;
    const value = o[key];
    if (value === undefined) continue;
    const cost = (encoded) => encoded.length + key.length + 4;
    const whole = encoded(value) || '';
    if (cost(whole) <= remaining) { view[key] = value; remaining -= cost(whole); continue; }
    if (!Array.isArray(value)) continue;
    const kept = [];
    let used = 2;
    for (const item of value) {
      const itemSize = (encoded(item) || '').length + 1;
      if (cost('') + used + itemSize > remaining) break;
      kept.push(item);
      used += itemSize;
    }
    if (kept.length) { view[key] = kept; remaining -= cost('') + used; }
  }
  const result = encoded(view);
  return result.length <= limit ? result : encoded(priority);
}
