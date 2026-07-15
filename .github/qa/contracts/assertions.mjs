import { isManagedContractPlan } from './compiler.mjs';

const text = (value) => (value === undefined || value === null ? '' : String(value));
const normalText = (value) => text(value).replace(/\s+/g, ' ').trim();

function getPath(value, dotted) {
  return String(dotted).split('.').reduce((current, key) => {
    if (!current || typeof current !== 'object') return undefined;
    return current[key];
  }, value);
}

function phaseView(observed, phase) {
  if (phase === 'beforeFixture') return observed?.beforeFixture || {};
  return observed || {};
}

function matchesFor(observed, phase, selector) {
  const probes = Array.isArray(phaseView(observed, phase)?.probes) ? phaseView(observed, phase).probes : [];
  const probe = probes.find((candidate) => candidate?.selector === selector);
  return Array.isArray(probe?.matches) ? probe.matches.filter((match) => !match?.selectorError) : [];
}

function checkCount(matches, count = {}) {
  const min = Number.isFinite(Number(count.min)) ? Number(count.min) : 0;
  const max = Number.isFinite(Number(count.max)) ? Number(count.max) : Infinity;
  return matches.length >= min && matches.length <= max;
}

function checkEvery(matches, every = {}) {
  return matches.every((match) => {
    if (every.textEquals !== undefined && normalText(match?.text) !== normalText(every.textEquals)) return false;
    if (every.textIncludes !== undefined && !normalText(match?.text).includes(normalText(every.textIncludes))) return false;
    if (every.classIncludes !== undefined) {
      const classes = normalText(match?.cls).split(/\s+/).filter(Boolean);
      if (!classes.includes(every.classIncludes)) return false;
    }
    return Object.entries(every.attributes || {}).every(([name, expected]) => text(match?.attributes?.[name]) === text(expected));
  });
}

function summarizeMatches(matches) {
  return matches.slice(0, 3).map((match) => ({
    id: text(match?.id), text: normalText(match?.text).slice(0, 120),
    cls: normalText(match?.cls).slice(0, 120), attributes: match?.attributes || {},
  }));
}

function evaluateProbe(assertion, observed) {
  const phase = assertion.phase === 'beforeFixture' ? 'beforeFixture' : 'final';
  const matches = matchesFor(observed, phase, assertion.selector);
  const countOk = checkCount(matches, assertion.count);
  const everyOk = countOk && (!assertion.every || checkEvery(matches, assertion.every));
  return {
    type: 'probe', phase, selector: assertion.selector, ok: everyOk,
    expected: { count: assertion.count || {}, every: assertion.every || undefined },
    actual: { count: matches.length, matches: summarizeMatches(matches) },
  };
}

function evaluateBridge(assertion, observed) {
  const phase = assertion.phase === 'beforeFixture' ? 'beforeFixture' : 'final';
  const fields = assertion.fields || {};
  const mismatches = Object.entries(fields).flatMap(([path, expected]) => {
    const actual = getPath(phaseView(observed, phase)?.bridge || {}, path);
    return actual === expected ? [] : [{ path, expected, actual }];
  });
  return { type: 'bridge', phase, ok: mismatches.length === 0, expected: fields, actual: mismatches };
}

function evaluateRequest(assertion, observed) {
  const requests = Array.isArray(observed?.diagnostics?.collectionRequests) ? observed.diagnostics.collectionRequests : [];
  const expected = assertion.query || {};
  const matching = requests.filter((request) => {
    try {
      const url = new URL(request);
      return Object.entries(expected).every(([name, value]) => url.searchParams.get(name) === String(value));
    } catch { return false; }
  });
  const min = Number.isFinite(Number(assertion.min)) ? Number(assertion.min) : 1;
  return {
    type: 'request', ok: matching.length >= min, expected: { query: expected, min },
    actual: { matching: matching.length, requests: requests.slice(0, 4) },
  };
}

function evaluateTracked(assertion, observed) {
  const tracked = Array.isArray(observed?.bridge?.trackedNodes) ? observed.bridge.trackedNodes : [];
  const selected = tracked.filter((node) => node?.selector === assertion.selector);
  const matching = selected.filter((node) => node?.connected === assertion.connected);
  const min = Number.isFinite(Number(assertion.min)) ? Number(assertion.min) : 1;
  const every = Boolean(assertion.every);
  return {
    type: 'tracked', ok: matching.length >= min && (!every || (selected.length >= min && matching.length === selected.length)),
    expected: { selector: assertion.selector, connected: assertion.connected, min, every },
    actual: { matching: matching.length, nodes: selected.slice(0, 10) },
  };
}

/**
 * Deterministically evaluate the small safe assertion language carried by a
 * managed contract. This replaces a free-form LLM judgment for known shapes.
 */
export function evaluateContractAssertions(plan, observed) {
  if (!isManagedContractPlan(plan)) return null;
  const checks = plan.assertions.map((assertion) => {
    if (assertion?.type === 'probe') return evaluateProbe(assertion, observed);
    if (assertion?.type === 'bridge') return evaluateBridge(assertion, observed);
    if (assertion?.type === 'request') return evaluateRequest(assertion, observed);
    if (assertion?.type === 'tracked') return evaluateTracked(assertion, observed);
    return { type: text(assertion?.type), ok: false, expected: 'known assertion type', actual: 'unsupported assertion type' };
  });
  const failures = checks.filter((check) => !check.ok);
  const contractId = plan.contract?.id || 'managed contract';
  const reason = failures.length
    ? `${contractId} failed ${failures.length}/${checks.length} deterministic check(s): ${failures.slice(0, 2)
      .map((failure) => `${failure.type}${failure.selector ? ` ${failure.selector}` : ''}`).join(', ')}`
    : `${contractId} satisfied ${checks.length} deterministic contract check(s).`;
  return { verdict: failures.length ? 'FAIL' : 'PASS', reason, checks };
}
