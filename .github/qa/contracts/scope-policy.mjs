import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const POLICY_CATALOG_PATH = path.join(HERE, 'scope-policy-catalog.v1.json');
const SCOPE_PATTERN = /^[a-z][a-z0-9_]*$/;
const POLICY_ID_PATTERN = /^caas-feature-qa-scope\.v([1-9]\d*)$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const COVERAGE_PATTERN = /^(?:NEEDS_CONTRACT|NEEDS_REVIEW|DEFERRED_(?:VISUAL|A11Y|VIEWPORT|PERFORMANCE)|OUT_OF_SCOPE)$/;
const text = (value) => (value === undefined || value === null ? '' : String(value));

function cleanCapabilities(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => text(item).trim().replace(/\s+/g, ' ').slice(0, 300)).filter(Boolean).slice(0, 6);
}

/** A reviewed, closed vocabulary for deciding what the first QA iteration owns. */
export function validateCoverageScopePolicy(value) {
  const policy = value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  if (!policy) throw new Error('coverage scope policy must be an object');
  const id = text(policy.id).trim();
  const idVersion = Number(POLICY_ID_PATTERN.exec(id)?.[1]);
  if (!Number.isInteger(idVersion)) throw new Error('invalid coverage scope policy id');
  const version = Number(policy.version);
  if (version !== idVersion) throw new Error('invalid coverage scope policy version');
  const scopes = policy.scopes && typeof policy.scopes === 'object' && !Array.isArray(policy.scopes) ? policy.scopes : null;
  if (!scopes) throw new Error('coverage scope policy needs scopes');
  const normalized = {};
  for (const [scope, entry] of Object.entries(scopes)) {
    if (!SCOPE_PATTERN.test(scope)) throw new Error(`invalid coverage scope: ${scope}`);
    const value = entry && typeof entry === 'object' && !Array.isArray(entry) ? entry : null;
    const coverage = text(value?.coverage).trim();
    if (!COVERAGE_PATTERN.test(coverage)) throw new Error(`invalid coverage result for ${scope}`);
    const neededCapabilities = cleanCapabilities(value?.neededCapabilities);
    if ((coverage === 'NEEDS_CONTRACT' || coverage === 'NEEDS_REVIEW') && !neededCapabilities.length) {
      throw new Error(`${coverage} scope ${scope} needs a canonical follow-up capability`);
    }
    if (coverage !== 'NEEDS_CONTRACT' && coverage !== 'NEEDS_REVIEW' && neededCapabilities.length) {
      throw new Error(`non-review scope ${scope} must not declare adapter capabilities`);
    }
    normalized[scope] = {
      coverage,
      neededCapabilities,
      description: text(value?.description).trim().replace(/\s+/g, ' ').slice(0, 700),
    };
  }
  const defaultScope = text(policy.defaultScope).trim();
  if (defaultScope !== 'needs_review') throw new Error('coverage scope policy defaultScope must be needs_review');
  if (!normalized.needs_review || normalized.needs_review.coverage !== 'NEEDS_REVIEW') {
    throw new Error('coverage scope policy needs a NEEDS_REVIEW needs_review scope');
  }
  return { id, version, defaultScope, scopes: normalized };
}

/**
 * The catalog pins the exact bytes of each reviewed policy version. Updating a
 * policy means adding a new vN file/catalog entry and moving activePolicyId;
 * a background job cannot silently rewrite the active policy file in place.
 */
export function validateCoverageScopePolicyCatalog(value) {
  const catalog = value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  if (!catalog) throw new Error('coverage scope policy catalog must be an object');
  const activePolicyId = text(catalog.activePolicyId).trim();
  const policies = catalog.policies && typeof catalog.policies === 'object' && !Array.isArray(catalog.policies)
    ? catalog.policies : null;
  if (!policies || !POLICY_ID_PATTERN.test(activePolicyId) || !policies[activePolicyId]) {
    throw new Error('coverage scope policy catalog needs an active reviewed policy');
  }
  const normalized = {};
  for (const [id, raw] of Object.entries(policies)) {
    const entry = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : null;
    const version = Number(POLICY_ID_PATTERN.exec(id)?.[1]);
    if (!entry || !Number.isInteger(version) || Number(entry.version) !== version) {
      throw new Error(`invalid coverage scope policy catalog entry: ${id}`);
    }
    const file = text(entry.file).trim();
    if (file !== `scope-policy.v${version}.json`) {
      throw new Error(`coverage scope policy catalog file must be versioned for ${id}`);
    }
    const sha256 = text(entry.sha256).trim();
    if (!SHA256_PATTERN.test(sha256)) throw new Error(`coverage scope policy catalog needs sha256 for ${id}`);
    normalized[id] = { file, version, sha256 };
  }
  return { activePolicyId, policies: normalized };
}

let cache;

export function getCoverageScopePolicy() {
  if (!cache) {
    const catalog = validateCoverageScopePolicyCatalog(JSON.parse(readFileSync(POLICY_CATALOG_PATH, 'utf8')));
    const descriptor = catalog.policies[catalog.activePolicyId];
    const policyPath = path.resolve(HERE, descriptor.file);
    if (path.dirname(policyPath) !== HERE) throw new Error('coverage scope policy catalog file escapes contracts directory');
    const raw = readFileSync(policyPath, 'utf8');
    const policyHash = createHash('sha256').update(raw).digest('hex');
    if (policyHash !== descriptor.sha256) {
      throw new Error(`coverage scope policy digest mismatch for ${catalog.activePolicyId}; add a new reviewed policy version instead`);
    }
    const policy = validateCoverageScopePolicy(JSON.parse(raw));
    if (policy.id !== catalog.activePolicyId || policy.version !== descriptor.version) {
      throw new Error(`coverage scope policy identity mismatch for ${catalog.activePolicyId}`);
    }
    cache = {
      ...policy,
      // Results retain this digest so an historical classification can be
      // reproduced even if a later reviewed policy revision changes the file.
      policyHash,
      policyFile: descriptor.file,
    };
  }
  return {
    ...cache,
    scopes: Object.fromEntries(Object.entries(cache.scopes).map(([name, entry]) => [name, {
      ...entry, neededCapabilities: [...entry.neededCapabilities],
    }])),
  };
}

export function coverageScopeNames() {
  return Object.keys(getCoverageScopePolicy().scopes);
}

/** The router supplies a scope only; code owns the resulting status/capability. */
export function resolveCoverageScope(scope) {
  const policy = getCoverageScopePolicy();
  const name = text(scope).trim();
  const resolvedScope = policy.scopes[name] ? name : 'needs_review';
  const entry = policy.scopes[resolvedScope];
  return { scope: resolvedScope, coverage: entry.coverage,
    neededCapabilities: [...entry.neededCapabilities], policyId: policy.id,
    policyVersion: policy.version, policyHash: policy.policyHash, policyFile: policy.policyFile };
}

export function clearCoverageScopePolicyCache() {
  cache = undefined;
}
