import assert from 'node:assert/strict';
import { test } from 'node:test';
import { configEchoContract, enforceConfigEchoContract, needsConfigEchoChallenge } from './plan-discrimination.mjs';

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

test('binds a config-echo replan to the same source test and style', () => {
  const original = {
    sourceTest: 'Grid.spec.js > applies blade cards',
    configPatch: { collection: { cardStyle: 'blade-card' } },
  };
  const contract = configEchoContract(original);
  assert.deepEqual(contract, { sourceTest: 'Grid.spec.js > applies blade cards', cardStyle: 'blade-card' });
  assert.equal(enforceConfigEchoContract(contract, {
    sourceTest: original.sourceTest,
    configPatch: { collection: { cardStyle: 'blade-card' } },
  }).sourceTest, original.sourceTest);
  assert.throws(() => enforceConfigEchoContract(contract, {
    sourceTest: 'Card.spec.js > renders markdown',
    configPatch: { collection: { cardStyle: 'blade-card' } },
  }), /changed the selected source test/);
  assert.throws(() => enforceConfigEchoContract(contract, {
    sourceTest: original.sourceTest,
    configPatch: { collection: { cardStyle: 'product' } },
  }), /changed the selected cardStyle/);
  assert.equal(enforceConfigEchoContract(contract, { skipReason: 'visual judgment required' }).sourceTest,
    original.sourceTest);
});
