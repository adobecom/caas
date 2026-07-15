const TARGET_TOKEN = /^[A-Za-z0-9_-]{1,80}$/;
export const QA_TARGET_QUERY = 'caasQaTarget';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function canonicalEndpoint(value) {
  let url;
  try { url = new URL(String(value || '').trim()); }
  catch { return ''; }
  if (!/^https?:$/.test(url.protocol)) return '';
  url.hash = '';
  const params = [...url.searchParams.entries()]
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue));
  url.search = '';
  params.forEach(([key, value]) => url.searchParams.append(key, value));
  return url.toString();
}

/** A stable, transport-only identity that can survive unrelated mount reordering. */
export function qaCollectionFingerprint(config) {
  return canonicalEndpoint(config?.collection?.endpoint);
}

/**
 * A generic identity for one CaaS collection on a page that has several. The
 * `fingerprint` + `occurrence` identify the captured transport even if other
 * collections mount in a different order. The token ties its controlled
 * request and bounded browser observations back to that same host.
 */
export function createQaCollectionTarget({ index = 0, token, fingerprint = '', occurrence } = {}) {
  const parsedIndex = Number(index);
  const parsedToken = String(token || '').trim();
  const rawFingerprint = String(fingerprint || '').trim();
  const parsedFingerprint = rawFingerprint ? canonicalEndpoint(rawFingerprint) : '';
  const parsedOccurrence = occurrence === undefined ? undefined : Number(occurrence);
  if (!Number.isInteger(parsedIndex) || parsedIndex < 0 || parsedIndex > 99) {
    throw new Error('QA target index must be an integer from 0 to 99');
  }
  if (!TARGET_TOKEN.test(parsedToken)) throw new Error('QA target token must be 1-80 safe characters');
  if (rawFingerprint && !parsedFingerprint) throw new Error('QA target fingerprint must be an absolute http(s) endpoint');
  if (parsedFingerprint && (!Number.isInteger(parsedOccurrence) || parsedOccurrence < 0 || parsedOccurrence > 99)) {
    throw new Error('QA target fingerprint occurrence must be an integer from 0 to 99');
  }
  if (!parsedFingerprint && occurrence !== undefined) throw new Error('QA target occurrence needs a fingerprint');
  return Object.freeze({ index: parsedIndex, token: parsedToken,
    ...(parsedFingerprint ? { fingerprint: parsedFingerprint, occurrence: parsedOccurrence } : {}) });
}

/** Create a replayable target from the collection captured in this navigation. */
export function targetFromCapturedConfigs(configs, { index = 0, token } = {}) {
  const entries = Array.isArray(configs) ? configs : [];
  const parsedIndex = Number(index);
  if (!Number.isInteger(parsedIndex) || parsedIndex < 0 || parsedIndex >= entries.length) {
    throw new Error(`QA target index ${index} is unavailable among ${entries.length} captured collections`);
  }
  const fingerprint = qaCollectionFingerprint(entries[parsedIndex]);
  if (!fingerprint) throw new Error(`QA target index ${parsedIndex} has no absolute collection.endpoint fingerprint`);
  const occurrence = entries.slice(0, parsedIndex)
    .filter((config) => qaCollectionFingerprint(config) === fingerprint).length;
  return createQaCollectionTarget({ index: parsedIndex, token, fingerprint, occurrence });
}

/** Resolve a saved target against a fresh navigation before replaying PRE. */
export function resolveCapturedQaCollectionTarget(configs, targetInput) {
  const target = createQaCollectionTarget(targetInput);
  if (!target.fingerprint) throw new Error('saved QA target is missing a collection fingerprint');
  const entries = Array.isArray(configs) ? configs : [];
  const matchingIndexes = entries.flatMap((config, index) => (
    qaCollectionFingerprint(config) === target.fingerprint ? [index] : []
  ));
  const index = matchingIndexes[target.occurrence];
  if (index === undefined) {
    throw new Error(`QA target fingerprint is unavailable at occurrence ${target.occurrence} among ${entries.length} captured collections`);
  }
  return createQaCollectionTarget({ ...target, index });
}

/** Add an intercepted, QA-only query marker without changing contract inputs. */
export function buildTargetedQaOverride(config, targetInput) {
  const target = createQaCollectionTarget(targetInput);
  const override = clone(config || {});
  const endpoint = String(override?.collection?.endpoint || '').trim();
  let endpointUrl;
  try { endpointUrl = new URL(endpoint); }
  catch { throw new Error('QA target needs an absolute collection.endpoint'); }
  endpointUrl.searchParams.set(QA_TARGET_QUERY, target.token);
  override.collection = { ...(override.collection || {}), endpoint: endpointUrl.toString() };
  return {
    ...override,
    _caasQaReplace: true,
    _caasQaTargetIndex: target.index,
    _caasQaTargetToken: target.token,
    ...(target.fingerprint ? {
      _caasQaTargetFingerprint: target.fingerprint,
      _caasQaTargetOccurrence: target.occurrence,
    } : {}),
  };
}

/** Only fulfill the request produced by the marked collection, not its siblings. */
export function isQaTargetRequest(requestUrl, targetInput) {
  const target = createQaCollectionTarget(targetInput);
  try { return new URL(String(requestUrl)).searchParams.get(QA_TARGET_QUERY) === target.token; }
  catch { return false; }
}
