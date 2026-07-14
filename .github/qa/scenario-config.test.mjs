import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  applySpecCardStyle,
  buildScenarioConfig,
  mergeScenarioConfig,
  normalizeEventFixtureCards,
} from './scenario-config.mjs';

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

test('never replaces captured collection transport with a unit-test endpoint', () => {
  const base = {
    collection: {
      endpoint: 'https://example.test/chimera-api/collection?live=true',
      fallbackEndpoint: 'https://example.test/chimera-api/fallback?live=true',
    },
  };
  const config = buildScenarioConfig(base, {
    collection: {
      endpoint: 'https://www.somedomain.com/some-test-api.json',
      fallbackEndpoint: 'https://www.somedomain.com/fallback.json',
      cardStyle: 'none',
    },
  }, 1);
  assert.equal(config.collection.endpoint, base.collection.endpoint);
  assert.equal(config.collection.fallbackEndpoint, base.collection.fallbackEndpoint);
  assert.equal(config.collection.cardStyle, 'none');
});

test('preserves a non-dummy endpoint change for endpoint-specific features', () => {
  const base = { collection: { endpoint: 'https://example.test/chimera-api/collection?live=true' } };
  const config = buildScenarioConfig(base, {
    collection: { endpoint: 'https://api.adobe.io/chimera-api/collection?version=next' },
  }, 1);
  assert.equal(config.collection.endpoint, 'https://api.adobe.io/chimera-api/collection?version=next');
});

test('makes event-filter fixture cards safe for historical event sorting', () => {
  const cards = [{ id: 'event-card', contentArea: { title: 'Event' }, footer: [{ left: [{}, null] }] }];
  const normalized = normalizeEventFixtureCards(cards, { filterPanel: { eventFilter: 'not-timed' } });
  assert.deepEqual(normalized[0].contentArea.dateDetailText, {});
  assert.deepEqual(normalized[0].footer[0].left, [{}, {}]);
  assert.equal(cards[0].contentArea.dateDetailText, undefined, 'does not mutate the planned card');
  assert.deepEqual(normalizeEventFixtureCards(cards, {}), cards, 'ordinary cards are unchanged');
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
