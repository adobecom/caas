import assert from 'node:assert/strict';
import { test } from 'node:test';
import { needsRootRenderSkipChallenge, shouldChallengeSkip } from './skip-challenge.mjs';

const rootRenderBridgeEvidence = {
  changedPaths: [
    'react/src/js/components/Consonant/Page/ConsonantPageDOM.jsx',
    'react/src/js/components/Consonant/Page/__test__/ConsonantPageDOM.spec.js',
  ],
  diff: `import { DOMModel, createRDC } from 'react-dom-components';
import { parseDataConfig } from '../Helpers/decorators';
this.getAttribute('data-config', 'dataConfig');`,
  specDiff: `expect(model.props.dataConfig).toBe('{"key":"value"}');
expect(model.getAttribute('data-config')).toEqual('{"key":"value"}');`,
};

test('recognizes a DOM/config-to-React root-render bridge', () => {
  assert.equal(needsRootRenderSkipChallenge(rootRenderBridgeEvidence), true);
  assert.equal(shouldChallengeSkip({ stage: 'detect', evidence: rootRenderBridgeEvidence }), true);
  assert.equal(shouldChallengeSkip({ stage: 'plan', evidence: rootRenderBridgeEvidence }), true);
});

test('does not challenge ordinary static skips or retry twice', () => {
  assert.equal(needsRootRenderSkipChallenge({
    ...rootRenderBridgeEvidence,
    specDiff: "expect(model.getAttribute('data-config')).toEqual('value');",
  }), false);
  assert.equal(shouldChallengeSkip({
    stage: 'plan', evidence: rootRenderBridgeEvidence, challengeAttempted: true,
  }), false);
  assert.equal(shouldChallengeSkip({ stage: 'renderability', evidence: rootRenderBridgeEvidence }), false);
});
