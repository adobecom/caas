// Left filter panel: selecting, deselecting, and clearing filters
const generateUrl = require('../helpers/generateUrl');

/**
 * test-group-filters.json has 7 cards with these tags:
 *   #1 card-photoshop-only:       caas:products/photoshop
 *   #2 card-creative-cloud-tag:   caas:products/creative-cloud
 *   #3 card-photoshop-illustrator: caas:products/photoshop, caas:products/illustrator
 *   #4 card-acrobat-only:         caas:products/acrobat
 *   #5 card-indesign-premiere:    caas:products/indesign, caas:products/premiere-pro
 *   #6 card-analytics-target:     caas:products/analytics, caas:products/target
 *   #7 card-no-products:          adobe-com-enterprise:topic/digital-trends (no product tags)
 */
const TOTAL_CARDS = 7;

const filterOverrides = {
    collection: {
        endpoint: '../../caas/mock-json/test-group-filters.json',
        totalCardsToShow: '-1',
        resultsPerPage: '20',
    },
    filterPanel: {
        enabled: 'true',
        type: 'left',
        filterLogic: 'or',
        showEmptyFilters: true,
        filters: [
            {
                group: 'Products',
                id: 'caas:products',
                openedOnLoad: true,
                items: [
                    { label: 'Photoshop', id: 'caas:products/photoshop' },
                    { label: 'Illustrator', id: 'caas:products/illustrator' },
                    { label: 'Acrobat', id: 'caas:products/acrobat' },
                ],
            },
        ],
    },
    sort: {
        enabled: 'false',
    },
    search: {
        enabled: 'false',
    },
    pagination: {
        enabled: 'false',
    },
};

const SEL = {
    card: '.consonant-Card',
    filterPanel: '.consonant-LeftFilters',
    filterGroup: '.consonant-LeftFilter',
    filterGroupLink: '.consonant-LeftFilter-link',
    filterItems: '.consonant-LeftFilter-items',
    clearAllBtn: '.consonant-LeftFilters-clearLink',
    groupBadge: '.consonant-LeftFilter-itemBadge',
};

const checkboxLabel = (itemId) => `label[for="${itemId}"]`;

const waitForCardCount = async (expectedCount) => {
    await browser.waitUntil(async () => {
        const cards = await $$('.consonant-Card');
        return cards.length === expectedCount;
    }, {
        timeout: 10000,
        timeoutMsg: `Expected ${expectedCount} cards but found a different count`,
    });
};

describe('Left Filter Panel', () => {
    const url = generateUrl(filterOverrides);

    beforeEach(async () => {
        await browser.url(url);
        await $(SEL.card).waitForExist({ timeout: 10000 });
    });

    it('should render the left filter panel when enabled', async () => {
        const panel = await $(SEL.filterPanel);
        expect(await panel.isDisplayed()).toBe(true);
    });

    it('should display all cards when no filters are selected', async () => {
        const cards = await $$(SEL.card);
        expect(cards.length).toBe(TOTAL_CARDS);
    });

    it('should narrow cards when selecting a single filter item', async () => {
        const label = await $(checkboxLabel('caas:products/photoshop'));
        await label.waitForDisplayed({ timeout: 10000 });
        await label.click();

        // Photoshop matches cards #1 and #3
        await waitForCardCount(2);
        const cards = await $$(SEL.card);
        expect(cards.length).toBe(2);
    });

    it('should widen results when selecting an additional item (OR logic)', async () => {
        const psLabel = await $(checkboxLabel('caas:products/photoshop'));
        await psLabel.waitForDisplayed({ timeout: 10000 });
        await psLabel.click();
        await waitForCardCount(2);

        // Add Acrobat: OR union includes cards #1, #3, #4
        const acLabel = await $(checkboxLabel('caas:products/acrobat'));
        await acLabel.click();
        await waitForCardCount(3);

        const cards = await $$(SEL.card);
        expect(cards.length).toBe(3);
    });

    it('should update results when deselecting a filter item', async () => {
        // Select both Photoshop and Acrobat
        const psLabel = await $(checkboxLabel('caas:products/photoshop'));
        await psLabel.waitForDisplayed({ timeout: 10000 });
        await psLabel.click();
        await waitForCardCount(2);

        const acLabel = await $(checkboxLabel('caas:products/acrobat'));
        await acLabel.click();
        await waitForCardCount(3);

        // Deselect Photoshop: only Acrobat remains, matching card #4
        await psLabel.click();
        await waitForCardCount(1);

        const cards = await $$(SEL.card);
        expect(cards.length).toBe(1);
    });

    it('should restore all cards when clearing all filters', async () => {
        const psLabel = await $(checkboxLabel('caas:products/photoshop'));
        await psLabel.waitForDisplayed({ timeout: 10000 });
        await psLabel.click();
        await waitForCardCount(2);

        const clearBtn = await $(SEL.clearAllBtn);
        await clearBtn.click();
        await waitForCardCount(TOTAL_CARDS);

        const cards = await $$(SEL.card);
        expect(cards.length).toBe(TOTAL_CARDS);
    });

    it('should clear a single filter group via the group badge', async () => {
        const psLabel = await $(checkboxLabel('caas:products/photoshop'));
        await psLabel.waitForDisplayed({ timeout: 10000 });
        await psLabel.click();
        await waitForCardCount(2);

        // Group badge appears showing "1" selected; clicking it clears the group
        const badge = await $(SEL.groupBadge);
        await badge.waitForDisplayed({ timeout: 5000 });
        await badge.click();
        await waitForCardCount(TOTAL_CARDS);

        const cards = await $$(SEL.card);
        expect(cards.length).toBe(TOTAL_CARDS);
    });

    it('should expand a collapsed filter group on click', async () => {
        const closedOverrides = JSON.parse(JSON.stringify(filterOverrides));
        closedOverrides.filterPanel.filters[0].openedOnLoad = false;
        const closedUrl = generateUrl(closedOverrides);
        await browser.url(closedUrl);

        await $(SEL.filterGroup).waitForExist({ timeout: 10000 });

        // Items hidden when group is collapsed
        const items = await $(SEL.filterItems);
        expect(await items.isDisplayed()).toBe(false);

        // Click group heading to expand
        const groupLink = await $(SEL.filterGroupLink);
        await groupLink.click();

        await items.waitForDisplayed({ timeout: 5000 });
        expect(await items.isDisplayed()).toBe(true);
    });
});
