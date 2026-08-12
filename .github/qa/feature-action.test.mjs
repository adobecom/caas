import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  normalizeFeatureAction,
  planDescribesInteraction,
  runFeatureAction,
  validateFeatureAction,
} from './feature-action.mjs';

function fakePage({ count = 1, visible = true, clickError, fillError } = {}) {
  const calls = [];
  const makeLocator = (selector) => ({
    count: async () => count,
    isVisible: async () => visible,
    first: () => {
      calls.push(['first']);
      return makeLocator(selector);
    },
    locator: (childSelector) => {
      calls.push(['childLocator', childSelector]);
      return makeLocator(childSelector);
    },
    click: async () => {
      calls.push(['click']);
      if (clickError) throw new Error(clickError);
    },
    fill: async (value) => {
      calls.push(['fill', value]);
      if (fillError) throw new Error(fillError);
    },
  });
  return {
    calls,
    locator(selector) {
      calls.push(['locator', selector]);
      return makeLocator(selector);
    },
  };
}

test('normalizes bounded click and type actions', () => {
  assert.deepEqual(normalizeFeatureAction({ kind: 'CLICK', selector: '  #next  ' }),
    { kind: 'click', selector: '#next' });
  assert.deepEqual(normalizeFeatureAction({ kind: 'type', selector: '#search', value: 'photoshop' }),
    { kind: 'type', selector: '#search', value: 'photoshop' });
  assert.equal(normalizeFeatureAction(null), null);
  assert.equal(normalizeFeatureAction({}), null);
  assert.throws(() => normalizeFeatureAction({ kind: 'hover', selector: '#card' }), /click or type/);
  assert.throws(() => normalizeFeatureAction({ kind: 'click', selector: '' }), /selector/);
});

test('rejects positional selectors that do not identify the intended control', () => {
  assert.throws(() => validateFeatureAction(normalizeFeatureAction({
    kind: 'click', selector: '[data-testid="checkbox"]:nth-of-type(2)',
  })), /stable attribute/);
  assert.deepEqual(validateFeatureAction(normalizeFeatureAction({
    kind: 'click', selector: 'label[for="caas:products/illustrator"]',
  })), { kind: 'click', selector: 'label[for="caas:products/illustrator"]' });
});

test('detects interaction language when a planner forgets to return an action', () => {
  assert.equal(planDescribesInteraction({
    sourceTest: 'removes collection after selecting Illustrator',
    expected: 'clicking the checkbox removes #caas',
  }), true);
  assert.equal(planDescribesInteraction({
    sourceTest: 'renders an editorial card', expected: 'card is visible on initial render',
  }), false);
});

test('performs one visible, unambiguous click', async () => {
  const page = fakePage();
  const result = await runFeatureAction(page, { kind: 'click', selector: 'label[for="illustrator"]' });
  assert.equal(result.status, 'PERFORMED');
  assert.deepEqual(page.calls, [['locator', 'label[for="illustrator"]'], ['click']]);
});

test('fills a visible search input', async () => {
  const page = fakePage();
  const result = await runFeatureAction(page,
    { kind: 'type', selector: '[data-testid="consonant-Search-input"]', value: 'illustrator' });
  assert.equal(result.status, 'PERFORMED');
  assert.deepEqual(page.calls.at(-1), ['fill', 'illustrator']);
});

test('scopes an action to the first injected collection when the host page has several', async () => {
  const page = fakePage();
  const result = await runFeatureAction(page, { kind: 'click', selector: 'label[for="illustrator"]' },
    { scopeSelector: 'div#caas.caas-preview' });
  assert.equal(result.status, 'PERFORMED');
  assert.equal(result.scopeCount, 1);
  assert.deepEqual(page.calls, [
    ['locator', 'label[for="illustrator"]'],
    ['locator', 'div#caas.caas-preview'],
    ['first'],
    ['childLocator', 'label[for="illustrator"]'],
    ['click'],
  ]);
});

test('missing, hidden, and ambiguous targets are skipped instead of failed', async () => {
  assert.match((await runFeatureAction(fakePage({ count: 0 }),
    { kind: 'click', selector: '#missing' })).reason, /did not render/);
  assert.match((await runFeatureAction(fakePage({ visible: false }),
    { kind: 'click', selector: '#hidden' })).reason, /not visible/);
  assert.match((await runFeatureAction(fakePage({ count: 2 }),
    { kind: 'click', selector: '.duplicate' })).reason, /ambiguous/);
});

test('interaction errors are skipped instead of becoming product failures', async () => {
  const result = await runFeatureAction(fakePage({ clickError: 'detached' }),
    { kind: 'click', selector: '#unstable' });
  assert.equal(result.status, 'SKIPPED');
  assert.match(result.reason, /detached/);
});
