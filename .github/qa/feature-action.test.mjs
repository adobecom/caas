import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  interactionPrerequisiteFailure,
  normalizeFeatureAction,
  planDescribesInteraction,
  runFeatureAction,
  validateFeatureAction,
} from './feature-action.mjs';

function fakePage({ count = 1, visible = true, clickError, fillError, attributes = {} } = {}) {
  const calls = [];
  const makeLocator = (selector) => ({
    count: async () => count,
    isVisible: async () => visible,
    getAttribute: async (name) => attributes[name] ?? null,
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
    kind: 'click', selector: 'label[for="filter-group/item-b"]',
  })), { kind: 'click', selector: 'label[for="filter-group/item-b"]' });
});

test('detects interaction language when a planner forgets to return an action', () => {
  assert.equal(planDescribesInteraction({
    sourceTest: 'removes collection after selecting an unmatched filter',
    expected: 'clicking the checkbox removes #caas',
  }), true);
  assert.equal(planDescribesInteraction({
    sourceTest: 'renders an editorial card', expected: 'card is visible on initial render',
  }), false);
});

test('rejects an interaction verdict when its initial fixture card did not render', () => {
  const plan = { action: { kind: 'click', selector: '#filter' }, cards: [{ id: 'baseline' }] };
  assert.match(interactionPrerequisiteFailure(plan, { collectionRoots: { targetCards: 0 } }),
    /zero fixture cards/);
  assert.equal(interactionPrerequisiteFailure(plan, { collectionRoots: { targetCards: 1 } }), '');
  assert.equal(interactionPrerequisiteFailure({ ...plan, action: null },
    { collectionRoots: { targetCards: 0 } }), '');
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

test('clicks the visible associated label for a visually hidden checkbox', async () => {
  const calls = [];
  const input = {
    count: async () => 1,
    isVisible: async () => false,
    getAttribute: async (name) => ({ type: 'checkbox', id: 'filter-group/item-b' })[name] || null,
  };
  const label = {
    count: async () => 1,
    isVisible: async () => true,
    click: async () => calls.push('label clicked'),
  };
  const scope = { locator: (selector) => selector.startsWith('label[') ? label : input };
  const scopes = { count: async () => 2, first: () => scope };
  const page = { locator: (selector) => selector === '.caas-preview' ? scopes : input };
  const result = await runFeatureAction(page,
    { kind: 'click', selector: 'input[value="filter-group/item-b"]' },
    { scopeSelector: '.caas-preview' });
  assert.equal(result.status, 'PERFORMED');
  assert.equal(result.resolvedSelector, 'label[for="filter-group/item-b"]');
  assert.deepEqual(calls, ['label clicked']);
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
