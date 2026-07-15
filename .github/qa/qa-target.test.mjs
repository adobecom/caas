import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildTargetedQaOverride,
  createQaCollectionTarget,
  isQaTargetRequest,
  qaCollectionFingerprint,
  resolveCapturedQaCollectionTarget,
  targetFromCapturedConfigs,
} from './qa-target.mjs';

test('targets one captured collection with an opaque request marker', () => {
  const target = createQaCollectionTarget({ index: 1, token: 'qa-target-1' });
  const override = buildTargetedQaOverride({
    collection: { endpoint: 'https://business.adobe.com/chimera-api/collection?originSelection=events' },
  }, target);
  const endpoint = new URL(override.collection.endpoint);
  assert.equal(endpoint.searchParams.get('originSelection'), 'events');
  assert.equal(endpoint.searchParams.get('caasQaTarget'), 'qa-target-1');
  assert.equal(override._caasQaReplace, true);
  assert.equal(override._caasQaTargetIndex, 1);
  assert.equal(isQaTargetRequest(override.collection.endpoint, target), true);
  assert.equal(isQaTargetRequest('https://business.adobe.com/chimera-api/collection?caasQaTarget=other', target), false);
});

test('rejects an unsafe target or a config without a usable endpoint', () => {
  assert.throws(() => createQaCollectionTarget({ index: -1, token: 'qa-ok' }), /target index/);
  assert.throws(() => createQaCollectionTarget({ index: 0, token: 'not safe!' }), /target token/);
  assert.throws(() => buildTargetedQaOverride({ collection: {} }, { index: 0, token: 'qa-ok' }), /absolute collection.endpoint/);
});

test('fingerprints a captured target and resolves it across unrelated collection reordering', () => {
  const captured = [
    { collection: { endpoint: 'https://example.test/alpha?z=1' } },
    { collection: { endpoint: 'https://example.test/beta?b=2&a=1' } },
    { collection: { endpoint: 'https://example.test/beta?a=1&b=2' } },
  ];
  const target = targetFromCapturedConfigs(captured, { index: 2, token: 'qa-target-2' });
  assert.equal(target.fingerprint, 'https://example.test/beta?a=1&b=2');
  assert.equal(target.occurrence, 1);
  assert.equal(qaCollectionFingerprint(captured[1]), target.fingerprint);
  const replay = resolveCapturedQaCollectionTarget([
    { collection: { endpoint: 'https://example.test/other' } },
    captured[1],
    captured[2],
  ], target);
  assert.equal(replay.index, 2);
  assert.equal(replay.occurrence, 1);
  assert.throws(() => resolveCapturedQaCollectionTarget(captured.slice(0, 2), target), /fingerprint is unavailable/);
});
