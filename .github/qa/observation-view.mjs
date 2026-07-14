// Build the validation payload so the planner's targeted probes (the actual assertion
// evidence) are ALWAYS present and are never truncated away by large generic DOM lists.
//
// The raw `observed` object serializes `probes` last; on a busy page the cards/headings/
// controls/filters lists alone can exceed the validation budget, silently dropping the
// probe matches and causing a false POST_FAIL even though the feature rendered correctly.
// This helper puts probes + diagnostics first (in full), then fills the remaining budget
// with generic DOM context.

const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

export function buildValidationView(observed, budget = 18000) {
  const o = asObject(observed);
  // Priority evidence: the requested probes and render diagnostics. Always included in full.
  const view = {
    probes: Array.isArray(o.probes) ? o.probes : [],
    diagnostics: asObject(o.diagnostics),
  };
  let remaining = budget - JSON.stringify(view).length;
  // Generic context, most-useful first, trimmed to whatever budget remains.
  const genericKeys = ['cards', 'collectionRoots', 'headings', 'controls', 'filters', 'liveRegions'];
  for (const key of genericKeys) {
    if (remaining <= 2) break;
    const value = o[key];
    if (value === undefined) continue;
    const cost = (encoded) => encoded.length + key.length + 4; // "key":<json>,
    const whole = JSON.stringify(value);
    if (cost(whole) <= remaining) {
      view[key] = value;
      remaining -= cost(whole);
    } else if (Array.isArray(value)) {
      const kept = [];
      let used = 2; // array brackets
      for (const item of value) {
        const itemSize = JSON.stringify(item).length + 1;
        if (cost('') + used + itemSize > remaining) break;
        kept.push(item);
        used += itemSize;
      }
      if (kept.length) {
        view[key] = kept;
        remaining -= cost('') + used;
      }
    }
  }
  return JSON.stringify(view);
}
