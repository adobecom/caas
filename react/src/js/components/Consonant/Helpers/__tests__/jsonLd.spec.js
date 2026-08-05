import {
    buildTagLabelMap,
    buildCardEntry,
    buildCollectionJsonLd,
    injectCollectionJsonLd,
} from '../jsonLd';

const filters = [{
    id: 'caas:products',
    group: 'Products',
    items: [
        { id: 'caas:products/photoshop', label: 'Photoshop' },
        {
            id: 'caas:products/video',
            label: 'Video',
            isCategory: true,
            items: [{ id: 'caas:products/video/premiere', label: 'Premiere Pro' }],
        },
    ],
}];

const hashedFilters = [{
    id: 'h4x2',
    group: 'Products',
    items: [{ id: '4x24/l1s1', label: 'Photoshop' }],
}];

const card = {
    id: '1.0.0',
    contentArea: { title: 'Getting started with Photoshop' },
    ctaLink: 'https://adobe.com/resources/photoshop-guide',
    tags: [{ id: 'caas:products/photoshop' }],
};

const hashedCard = {
    ...card,
    tags: [{ id: '4x24/l1s1' }, { id: 'zz99/qq11' }],
};

describe('buildTagLabelMap', () => {
    test('maps item ids to labels, including nested category items', () => {
        const map = buildTagLabelMap(filters);
        expect(map['caas:products/photoshop']).toBe('Photoshop');
        expect(map['caas:products/video/premiere']).toBe('Premiere Pro');
    });

    test('works with hashed ids', () => {
        expect(buildTagLabelMap(hashedFilters)['4x24/l1s1']).toBe('Photoshop');
    });

    test('returns empty object for empty input', () => {
        expect(buildTagLabelMap()).toEqual({});
    });
});

describe('buildCardEntry', () => {
    test('emits name, url and resolved keywords', () => {
        const entry = buildCardEntry(card, buildTagLabelMap(filters));
        expect(entry).toEqual({
            '@type': 'CreativeWork',
            name: 'Getting started with Photoshop',
            url: 'https://adobe.com/resources/photoshop-guide',
            keywords: 'Photoshop',
        });
    });

    test('resolves hashed tags via the filter map and skips unresolvable hashes', () => {
        const entry = buildCardEntry(hashedCard, buildTagLabelMap(hashedFilters));
        expect(entry.keywords).toBe('Photoshop');
    });

    test('omits url and keywords when absent', () => {
        const entry = buildCardEntry({ contentArea: { title: 'X' } }, {});
        expect(entry).toEqual({ '@type': 'CreativeWork', name: 'X' });
    });
});

describe('buildCollectionJsonLd', () => {
    test('builds a valid ItemList with collection title', () => {
        const jsonLd = buildCollectionJsonLd([card], filters, 'All resources');
        expect(jsonLd['@context']).toBe('https://schema.org');
        expect(jsonLd['@type']).toBe('ItemList');
        expect(jsonLd.name).toBe('All resources');
        expect(jsonLd.numberOfItems).toBe(1);
        expect(jsonLd.itemListElement[0].position).toBe(1);
        expect(jsonLd.itemListElement[0].item.name).toBe('Getting started with Photoshop');
    });

    test('caps serialized entries at 50 while reporting the true total', () => {
        const manyCards = Array.from({ length: 200 }, (_, i) => ({ ...card, id: `card-${i}` }));
        const jsonLd = buildCollectionJsonLd(manyCards, [], '', 4000);
        expect(jsonLd.itemListElement).toHaveLength(50);
        expect(jsonLd.numberOfItems).toBe(4000);
    });

    test('true total never underreports the rendered count', () => {
        expect(buildCollectionJsonLd([card, hashedCard], [], '', 0).numberOfItems).toBe(2);
    });

    test('round-trips through JSON serialization', () => {
        const parsed = JSON.parse(JSON.stringify(buildCollectionJsonLd([card], filters)));
        expect(parsed.itemListElement[0].item.keywords).toBe('Photoshop');
    });
});

describe('injectCollectionJsonLd', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('injects one parseable script tag into the container', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        injectCollectionJsonLd({ cards: [card], filters, container });
        const script = container.querySelector('script[type="application/ld+json"]');
        expect(script).not.toBeNull();
        expect(JSON.parse(script.textContent)['@type']).toBe('ItemList');
    });

    test('replaces the previous block on re-injection', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        injectCollectionJsonLd({ cards: [card], filters: [], container });
        injectCollectionJsonLd({ cards: [card, hashedCard], filters: [], container });
        const scripts = container.querySelectorAll('script[type="application/ld+json"]');
        expect(scripts).toHaveLength(1);
        expect(JSON.parse(scripts[0].textContent).numberOfItems).toBe(2);
    });

    test('returns null with no cards', () => {
        expect(injectCollectionJsonLd({ cards: [] })).toBeNull();
    });

    test('removes the stale block when the card list becomes empty', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        injectCollectionJsonLd({ cards: [card], filters: [], container });
        expect(container.querySelector('script[data-caas-jsonld]')).not.toBeNull();
        injectCollectionJsonLd({ cards: [], filters: [], container });
        expect(container.querySelector('script[data-caas-jsonld]')).toBeNull();
    });

    test('supports multiple collections on one page independently', () => {
        const containerA = document.createElement('div');
        const containerB = document.createElement('div');
        document.body.appendChild(containerA);
        document.body.appendChild(containerB);
        injectCollectionJsonLd({ cards: [card], filters: [], container: containerA });
        injectCollectionJsonLd({ cards: [card, hashedCard], filters: [], container: containerB });
        injectCollectionJsonLd({ cards: [card], filters: [], container: containerA });
        expect(document.querySelectorAll('script[data-caas-jsonld]')).toHaveLength(2);
        expect(JSON.parse(containerA.querySelector('script').textContent).numberOfItems).toBe(1);
        expect(JSON.parse(containerB.querySelector('script').textContent).numberOfItems).toBe(2);
    });
});
