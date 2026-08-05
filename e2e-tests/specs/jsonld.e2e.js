// e2e-tests/specs/jsonld.e2e.js
const generateUrl = require('../helpers/generateUrl');

describe('JSON-LD Collection Emission', () => {
    it('emits a parseable Schema.org ItemList when showJsonLd is enabled', async () => {
        const url = generateUrl({ collection: { showJsonLd: true } });
        await browser.url(url);

        await browser.waitUntil(
            async () => $('#caas-collection-jsonld').isExisting(),
            { timeout: 15000, timeoutMsg: 'JSON-LD script tag was not injected' },
        );

        /* eslint-disable-next-line */
        const jsonText = await browser.execute(() => document.querySelector('#caas-collection-jsonld').textContent);
        const jsonLd = JSON.parse(jsonText);

        expect(jsonLd['@context']).toEqual('https://schema.org');
        expect(jsonLd['@type']).toEqual('ItemList');
        expect(jsonLd.numberOfItems).toBeGreaterThan(0);
        expect(jsonLd.itemListElement.length).toBeGreaterThan(0);
        expect(jsonLd.itemListElement.length).toBeLessThanOrEqual(50);
        expect(jsonLd.itemListElement[0].item['@type']).toEqual('CreativeWork');
        expect(jsonLd.itemListElement[0].item.name).not.toBe('');
    });

    it('does not emit the block when showJsonLd is disabled', async () => {
        const url = generateUrl({});
        await browser.url(url);

        await browser.waitUntil(
            async () => $('.consonant-Card').isExisting(),
            { timeout: 15000, timeoutMsg: 'Cards did not render' },
        );

        const exists = await $('#caas-collection-jsonld').isExisting();
        expect(exists).toBe(false);
    });
});
