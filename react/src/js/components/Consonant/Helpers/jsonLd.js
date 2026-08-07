import { getByPath } from './general';

/**
 * JSON-LD emission for CaaS collections.
 *
 * Emits one <script type="application/ld+json"> block per collection
 * describing the rendered cards as a Schema.org ItemList, so machine
 * readers (LLM crawlers, agents) can classify collection content.
 *
 * Card tags arrive hashed from the backend. The authored filter config
 * pairs (possibly hashed) tag ids with human labels, so it acts as the
 * resolver: card tag id -> filter item id -> label.
 *
 * Kept intentionally minimal: each entry is url + keywords. Titles and
 * descriptions are already crawlable in the visible DOM; the block's
 * unique contribution is the resolved tag taxonomy and the link.
 * The block is additive and injected after render; zero rendering,
 * payload, or SEO impact.
 */

const SCRIPT_ATTR = 'data-caas-jsonld';

/**
 * Maximum number of cards serialized into the block. Keeps the block
 * small on every collection; numberOfItems still reports the true total.
 */
const MAX_ITEMS = 50;

/**
 * Builds a map from filter item id (hashed or not) to its human label.
 * Includes nested category items.
 * @param {Array} filters - authored filters (post-hashing if isHashed)
 * @returns {Object} - { [tagId]: label }
 */
export const buildTagLabelMap = (filters = []) => {
    const map = {};
    filters.forEach((group) => {
        (group.items || []).forEach((item) => {
            if (item.id && item.label) map[item.id] = item.label;
            (item.items || []).forEach((nested) => {
                if (nested.id && nested.label) map[nested.id] = nested.label;
            });
        });
    });
    return map;
};

/**
 * Builds the minimal Schema.org entry for one card: url and keywords.
 * Tags without a filter label (e.g. unresolvable hashes) are skipped.
 * @param {Object} card - card object
 * @param {Object} tagLabelMap - output of buildTagLabelMap
 * @returns {Object} - Schema.org CreativeWork
 */
export const buildCardEntry = (card, tagLabelMap = {}) => {
    const entry = {
        '@type': 'CreativeWork',
    };

    const url = getByPath(card, 'ctaLink', '')
        || getByPath(card, 'overlayLink', '')
        || getByPath(card, 'footer.0.right.0.href', '');
    if (url) entry.url = url;

    const tags = getByPath(card, 'tags', []) || [];
    const keywords = [...new Set(tags.map(tag => tagLabelMap[tag.id]).filter(Boolean))];
    if (keywords.length) entry.keywords = keywords.join(', ');

    return entry;
};

/**
 * Builds the JSON-LD payload for a collection of cards.
 * Serializes at most MAX_ITEMS cards; numberOfItems reports the true
 * total so consumers know the full collection size.
 * @param {Array} cards - the cards currently shown
 * @param {Array} filters - authored filters (post-hashing)
 * @param {String} collectionTitle - optional collection title
 * @param {Number} totalItems - true total card count for the collection
 * @returns {Object} - Schema.org ItemList
 */
export const buildCollectionJsonLd = (cards = [], filters = [], collectionTitle = '', totalItems = 0) => {
    const tagLabelMap = buildTagLabelMap(filters);
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        numberOfItems: Math.max(totalItems, cards.length),
        itemListElement: cards.slice(0, MAX_ITEMS).map((card, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: buildCardEntry(card, tagLabelMap),
        })),
    };
    if (collectionTitle) jsonLd.name = collectionTitle;
    return jsonLd;
};

/**
 * Injects (or replaces) the JSON-LD script tag for the collection.
 * Idempotent per container: re-renders replace the previous block.
 * Multiple collections on one page each manage their own block inside
 * their own container, so they never collide.
 * @param {Object} options
 * @param {Array} options.cards - cards currently shown
 * @param {Array} options.filters - authored filters (post-hashing)
 * @param {HTMLElement} options.container - collection root element
 * @param {String} options.collectionTitle - optional collection title
 * @param {Number} options.totalItems - true total card count
 * @returns {HTMLElement|null} - the injected script element, or null
 * when there is nothing to describe (any previous block is removed, so
 * the metadata never describes cards that are no longer shown)
 */
export const injectCollectionJsonLd = ({
    cards = [],
    filters = [],
    container,
    collectionTitle = '',
    totalItems = 0,
} = {}) => {
    if (typeof document === 'undefined') return null;

    const parent = container || document.head;
    const existing = parent.querySelector(`script[${SCRIPT_ATTR}]`);
    if (existing) existing.remove();
    if (!cards.length) return null;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(SCRIPT_ATTR, '');
    script.textContent = JSON.stringify(
        buildCollectionJsonLd(cards, filters, collectionTitle, totalItems),
    );
    parent.appendChild(script);
    return script;
};
