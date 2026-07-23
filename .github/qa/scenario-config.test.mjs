import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applySpecCardStyle, buildScenarioConfig, mergeScenarioConfig } from './scenario-config.mjs';

test('deep-merges feature keys while preserving live collection transport', () => {
  const base = {
    collection: { endpoint: 'https://example.test/chimera-api/collection?q=x', resultsPerPage: 3,
      i18n: { onErrorTitle: 'error' } },
    products: {},
    featuredCards: ['production-card'],
  };
  const patch = {
    collection: { detailsTextOption: 'productName' },
    products: { acrobat: { tagID: 'some details', title: 'Acrobat' } },
  };
  const config = buildScenarioConfig(base, patch, 5);
  assert.equal(config.collection.endpoint, base.collection.endpoint);
  assert.equal(config.collection.i18n.onErrorTitle, 'error');
  assert.equal(config.collection.detailsTextOption, 'productName');
  assert.equal(config.collection.resultsPerPage, 5);
  assert.equal(config.collection.totalCardsToShow, 5);
  assert.deepEqual(config.featuredCards, []);
  assert.equal(config.products.acrobat.title, 'Acrobat');
});

test('a fixture card style wins unless the feature patch explicitly tests the collection override', () => {
  const card = { styles: { typeOverride: 'flex-card' } };
  assert.equal(buildScenarioConfig({ collection: { cardStyle: '1:2' } }, {}, [card]).collection.cardStyle, '');
  assert.equal(buildScenarioConfig({ collection: { cardStyle: '1:2' } },
    { collection: { cardStyle: 'product' } }, [card]).collection.cardStyle, 'product');
});

test('arrays in an explicit feature patch replace live arrays', () => {
  assert.deepEqual(mergeScenarioConfig({ featuredCards: ['old'] }, { featuredCards: ['new'] }),
    { featuredCards: ['new'] });
  assert.deepEqual(buildScenarioConfig({ featuredCards: ['old'] }, { featuredCards: ['feature-card'] }, 1)
    .featuredCards, ['feature-card']);
});

test('copies a single explicit cardStyle from the changed spec into fixture cards', () => {
  const fixture = [{ styles: { typeOverride: 'one-half', icon: '' } }];
  const normalized = applySpecCardStyle(fixture, "const cardStyle = 'flex-card';");
  assert.equal(normalized.style, 'flex-card');
  assert.equal(normalized.cards[0].styles.typeOverride, 'flex-card');
  assert.equal(normalized.cards[0].styles.icon, '');
  assert.equal(applySpecCardStyle(fixture, "cardStyle: 'one-half'; cardStyle: 'product'").style, null);
});

test('respects an explicit resultsPerPage so pagination features can produce multiple pages', () => {
  const base = { collection: { endpoint: 'https://example.test/c', resultsPerPage: 3, totalCardsToShow: 3 } };
  const patch = { collection: { resultsPerPage: 2 } };
  const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
  const config = buildScenarioConfig(base, patch, cards);
  assert.equal(config.collection.resultsPerPage, 2, 'explicit resultsPerPage must be respected, not raised to card count');
  assert.equal(config.collection.totalCardsToShow, 4, 'totalCardsToShow still defaults up so all cards show across pages');
});

test('respects an explicit totalCardsToShow when the feature intentionally limits visible cards', () => {
  const base = { collection: { endpoint: 'https://example.test/c', resultsPerPage: 4, totalCardsToShow: 4 } };
  const patch = { collection: { totalCardsToShow: 2 } };
  const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
  const config = buildScenarioConfig(base, patch, cards);
  assert.equal(config.collection.resultsPerPage, 4, 'resultsPerPage still defaults to show all cards per page');
  assert.equal(config.collection.totalCardsToShow, 2, 'explicit totalCardsToShow must not be raised to card count');
});

test('still defaults resultsPerPage up to the card count when the patch does not set it', () => {
  const base = { collection: { endpoint: 'https://example.test/c', resultsPerPage: 1 } };
  const config = buildScenarioConfig(base, { collection: { detailsTextOption: 'productName' } }, 5);
  assert.equal(config.collection.resultsPerPage, 5);
  assert.equal(config.collection.totalCardsToShow, 5);
});
