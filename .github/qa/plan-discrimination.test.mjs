import assert from 'node:assert/strict';
import { test } from 'node:test';
import { needsConfigEchoChallenge } from './plan-discrimination.mjs';

test('challenges a style plan that only proves a config literal was echoed', () => {
  assert.equal(needsConfigEchoChallenge({
    configPatch: { collection: { cardStyle: 'blade-card' } },
    expected: "the card has class 'blade-card'",
    probes: [{ selector: '[data-testid="consonant-Card"]', attributes: ['class'], why: 'class echo' }],
  }), true);
});

test('does not challenge a post-only semantic style effect or unrelated plan', () => {
  assert.equal(needsConfigEchoChallenge({
    configPatch: { collection: { cardStyle: 'blade-card' } },
    expected: 'the blade-card renders a footer CTA button and reverse modifier',
    probes: [{ selector: '[data-testid="consonant-Card-footer"]', attributes: [], why: 'new footer' }],
  }), false);
  assert.equal(needsConfigEchoChallenge({ expected: 'two event cards remain visible', probes: [] }), false);
});
