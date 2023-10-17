var structuredClone = require("@ungap/structured-clone").default;
const PORT = 5000;
const config = {
    collection: {
        mode: 'lightest', // Can be empty, "light", "dark", "darkest";
        layout: {
            type: '4up', // Can be "2up", "3up", "4up", "5up";
            gutter: '4x', // Can be "2x", "3x", "4x";
            container: '1200MaxWidth', // Can be "83Percent", "1200MaxWidth", "32Margin";
        },
        lazyLoad: false,
        button: {
            style: 'call-to-action', // Can be "primary", "call-to-action";
        },
        banner: {
            upcoming: {
                description: 'Upcoming',
            },
            live: {
                description: 'Live',
            },
            onDemand: {
                description: 'On Demand',
            },
        },
        resultsPerPage: '5',
        endpoint: '../../caas/mock-json/smoke.json',
        totalCardsToShow: '8',
        cardStyle: '1:2', // available options: "1:2", "3:4", "full-card", "half-height", "custom-card", "product", "double-wide";
        showTotalResults: 'true',
        i18n: {
            prettyDateIntervalFormat: '{LLL} {dd} | {timeRange} {timeZone}',
            totalResultsText: '{total} Results',
            title: 'Lorem Ipsum',
            titleHeadingLevel: 'h2',
            cardTitleAccessibilityLevel: '3',
            onErrorTitle: 'Sorry there was a system error.',
            onErrorDescription: 'Please try reloading the page or try coming back to the page another time.',
            lastModified: 'Last modified {date}',
        },
        setCardBorders: 'true', // Can be true or false;
        useOverlayLinks: 'false', // Can be true or false;
    },
    featuredCards: ['c7d34f39-397c-3727-9dff-5d0d9d8cf731'],
    filterPanel: {
        enabled: 'false',
        type: 'left',
        eventFilter: 'all',
        showEmptyFilters: true,
        filters: [
            {
                group: 'Topic',
                id: 'adobe-com-enterprise:topic',
                items: [
                    {
                        label: 'Business Continuity',
                        id: 'adobe-com-enterprise:topic/business-continuity',
                    },
                    {
                        label: 'Creativity and Design',
                        id: 'adobe-com-enterprise:topic/creativity-design',
                    },
                    {
                        label: 'Customer Intelligence',
                        id: 'adobe-com-enterprise:topic/customer-intelligence',
                    },
                    {
                        label: 'Data Management Platform',
                        id: 'adobe-com-enterprise:topic/data-management-platform',
                    },
                    {
                        label: 'Digital Foundation',
                        id: 'adobe-com-enterprise:topic/digital-foundation',
                    },
                    {
                        label: 'Digital Trends',
                        id: 'adobe-com-enterprise:topic/digital-trends',
                    },
                    {
                        label: 'Document Management',
                        id: 'adobe-com-enterprise:topic/document-management',
                    },
                    {
                        label: 'Marketing Automation',
                        id: 'adobe-com-enterprise:topic/marketing-automation',
                    },
                    {
                        label: 'Personalization',
                        id: 'adobe-com-enterprise:topic/personalization',
                    },
                    {
                        label: 'Stock',
                        id: 'adobe-com-enterprise:topic/Stock',
                    },
                ],
            },
            {
                group: 'Availability',
                id: 'adobe-com-enterprise:availability',
                items: [
                    {
                        label: 'On-Demand',
                        id: 'adobe-com-enterprise:availability/on-demand',
                    },
                    {
                        label: 'Upcoming',
                        id: 'adobe-com-enterprise:availability/upcoming',
                    },
                ],
            },
            {
                group: 'Duration',
                id: 'adobe-com-enterprise:duration',
                items: [
                    {
                        label: 'Long',
                        id: 'adobe-com-enterprise:duration/long',
                    },
                    {
                        label: 'Short',
                        id: 'adobe-com-enterprise:duration/short',
                    },
                ],
            },
            {
                group: 'Rating',
                id: 'adobe-com-enterprise:rating',
                items: [
                    {
                        label: '5',
                        id: 'adobe-com-enterprise:rating/5',
                    },
                    {
                        label: '4',
                        id: 'adobe-com-enterprise:rating/4',
                    },
                ],
            },
        ],
        filterLogic: 'or',
        topPanel: {
            mobile: {
                blurFilters: true,
            },
        },
        i18n: {
            leftPanel: {
                header: 'My Favorites',
                // searchBoxTitle: 'Search',
                clearAllFiltersText: 'Clear All',
                mobile: {
                    filtersBtnLabel: 'Filters:',
                    panel: {
                        header: 'Filters',
                        totalResultsText: '{total} Results',
                        applyBtnText: 'Apply',
                        clearFilterText: 'Clear',
                        doneBtnText: 'Done',
                    },
                    group: {
                        totalResultsText: '{total} Results',
                        applyBtnText: 'Apply',
                        clearFilterText: 'Clear Left',
                        doneBtnText: 'Done',
                    },
                },
            },
            topPanel: {
                groupLabel: 'Filters',
                clearAllFiltersText: 'Clear All Top',
                moreFiltersBtnText: 'More Filters: +',
                mobile: {
                    group: {
                        totalResultsText: '{total} esults',
                        applyBtnText: 'Apply',
                        clearFilterText: 'Clear Top',
                        doneBtnText: 'Done',
                    },
                },
            },
        },
    },
    hideCtaIds: [''],
    sort: {
        enabled: 'true',
        defaultSort: 'customSort',
        options: '[{"label":"Random", "sort":"random"},{"label":"Featured","sort":"featured"},{"label":"Title: (A-Z)","sort":"titleAsc"},{"label":"Title: (Z-A)","sort":"titleDesc"},{"label":"Date: (Oldest to newest)","sort":"dateAsc"},{"label":"Date: (Newest to oldest)","sort":"dateDesc"}, {"label": "Custom Sort", "sort": "customSort"}]',
    },
    pagination: {
        animationStyle: 'paged',
        enabled: 'true',
        type: 'loadMore',
        loadMoreButton: {
            style: 'primary', // Can be "primary", "over-background";
            useThemeThree: 'true', // Can be "true" or "false";
        },
        i18n: {
            loadMore: {
                btnText: 'Load More',
                resultsQuantityText: 'Showing {start} of {end} cards',
            },
            paginator: {
                resultsQuantityText: '{start}-{end} of {total} results',
                prevLabel: 'Prev',
                nextLabel: 'Next',
            },
        },
    },
    bookmarks: {
        showOnCards: 'true',
        leftFilterPanel: {
            bookmarkOnlyCollection: 'false',
            showBookmarksFilter: 'true',
            selectBookmarksIcon: '',
            unselectBookmarksIcon: '',
        },
        i18n: {
            leftFilterPanel: {
                filterTitle: 'My Favorites',
            },
        },
    },
    search: {
        enabled: 'true',
        searchFields: '["contentArea.title","contentArea.description","search.meta.author","overlays.banner.description", "foo.bar"]',
        i18n: {
            noResultsTitle: 'No Results Found',
            noResultsDescription: 'We could not find any results. {break} Try checking your spelling or broadening your search.',
            leftFilterPanel: {
                searchTitle: 'Search',
                searchPlaceholderText: 'Search here...',
            },
            topFilterPanel: {
                searchPlaceholderText: 'i18n.topFilterPanel.searchPlaceholderText',
            },
            filterInfo: {
                searchPlaceholderText: 'i18n.filterInfo.searchPlaceholderText',
            },
        },
    },
    language: 'en-US',
    analytics: {
        trackImpressions: 'true',
        collectionIdentifier: 'Some Identifier',
    },
};

let serverPath = 'https://adobecom.github.io/caas';
const args = process.argv.slice(2);
if (args.includes('env=LOCAL')) {
    serverPath = `http://localhost:${PORT}`;
    config.collection.endpoint = '../../mock-json/smoke.json';
}

describe('Carousel Behaviors', async () => {
    const cloneConfig = structuredClone(config);
    cloneConfig.collection.layout.container = 'carousel';

    const state = btoa(JSON.stringify(cloneConfig));
    const url = `${serverPath}/html/e2e/carousel.html?state=${state}`;

    // example
    it('Carousel Title should exist', async () => {
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const title = await $('.consonant-CarouselInfo-collectionTitle').getText();
        await expect(title).toEqual('Lorem Ipsum');
    });

    // example
    it('All cards should appear', async () => {
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const grid = await $('.consonant-CardsGrid');
        await expect(grid).toHaveChildren(8);
    });

    it('You should be able to click to the next page', async () => {
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const nextButton = await $('.consonant-Button--next');
        await nextButton.click();
        const prevButton = await $('.consonant-Button--previous');
        await expect(prevButton).toBeDisplayed();
    });
});

describe('Card Behaviors', async () => {
    // checking if time has passed upcoming becomes live
});

// contains good examples of changing the config and seeing the results
describe('CTA Behaviors', async () => {
    /* it('CTA should exist', async () => {
        const cloneConfig = structuredClone(config);
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const buttonText=await $('#ac578dee-f01b-3ea0-a282-2116619e4251 .consonant-BtnInfobit--cta')
            .getText();
        expect(buttonText).toEqual('Read More');
    } */

    it('MWPW-130075: Individual CTA should be hidden', async () => {
        const cloneConfig = structuredClone(config);
        cloneConfig.hideCtaIds = ['ac578dee-f01b-3ea0-a282-2116619e4251'];
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const exists = await $('#ac578dee-f01b-3ea0-a282-2116619e4251 .consonant-BtnInfobit--cta').isDisplayed();
        expect(exists).toEqual(false);
    });
    it('MWPW-130075: Card with hidden CTA should be clickable', async () => {
        const cloneConfig = structuredClone(config);
        cloneConfig.hideCtaIds = ['ac578dee-f01b-3ea0-a282-2116619e4251'];
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const hiddenCTA = await $('#ac578dee-f01b-3ea0-a282-2116619e4251 .consonant-LinkBlocker').isDisplayed();
        expect(hiddenCTA).toEqual(true);
    });
    it('MWPW-128711: ALL CTAs should be hidden', async () => {
        const cloneConfig = structuredClone(config);
        cloneConfig.collection.collectionButtonStyle = 'hidden';
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        for await (const oneCTA of $$('.consonant-Card .consonant-BtnInfobit--cta')) {
            expect(await oneCTA.isDisplayed()).toEqual(false);
        }
    });
    it('MWPW-134272: Cards with "hide CTA tags" should be hidden while others are still visible', async () => {
        const cloneConfig = structuredClone(config);
        cloneConfig.hideCtaTags = ['adobe-com-enterprise:topic/digital-foundation'];
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const taggedCta = await $('#ad83970f-c987-3c86-846f-4edaec827fb1 .consonant-BtnInfobit--cta').isDisplayed();
        const untaggedCta = await $('#ac578dee-f01b-3ea0-a282-2116619e4251 .consonant-BtnInfobit--cta').isDisplayed();
        expect(taggedCta).toEqual(false);
        expect(untaggedCta).toEqual(true);
    });
});

// contains good examples of clicking behaviors
describe('Filter and Search Behaviors', async () => {
    const cloneConfig = structuredClone(config);
    cloneConfig.filterPanel.enabled = true;
    it('MWPW-137132: can filter results using both search terms and filters by url', async () => {
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}&&ch_Topic=Creativity%2520and%2520Design`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const cardRes = await $('.consonant-LoadMore-text').getText();
        expect(cardRes).toEqual('Showing 3 of 3 cards');
    });
    it('MWPW-136333: can use "clear all" to clear terms from url and grid', async () => {
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}&sh_=Ze&ch_Topic=Stock%252CPersonalization`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const clearAll = await $('.consonant-LeftFilters-clearLink');
        await clearAll.click();
        const cardRes = await $('.consonant-LoadMore-text').getText();
        expect(cardRes).toEqual('Showing 5 of 8 cards');
        const newUrl = await browser.getUrl();
        expect(newUrl.replaceAll('%3D', '=')).toEqual(`${serverPath}/html/e2e/e2e-grid.html?state=${state}`);
    });
    it('MWPW-137140: can clear search and still have filters selected', async () => {
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}&sh_=Ze&ch_Topic=Stock%252CPersonalization`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const clearSearch = await $('.consonant-Search-inputClear');
        await clearSearch.click();
        const cardRes = await $('.consonant-LoadMore-text').getText();
        expect(cardRes).toEqual('Showing 5 of 6 cards');
        const newUrl = await browser.getUrl();
        expect(newUrl.replaceAll('%3D', '=')).toEqual(`${serverPath}/html/e2e/e2e-grid.html?state=${state}&ch_Topic=Stock%252CPersonalization`);
    });
    it('MWPW-137141: can clear a singluar selected filter from checkbox and see the updated results', async () => {
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}&sh_=Ze&ch_Topic=Stock%252CPersonalization`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const clearCheckbox = await $('.consonant-LeftFilter-itemsItemLabel=Stock');
        await clearCheckbox.click();
        const cardRes = await $('.consonant-LoadMore-text').getText();
        expect(cardRes).toEqual('Showing 1 of 1 cards');
        const newUrl = await browser.getUrl();
        expect(newUrl.replaceAll('%3D', '=')).toEqual(`${serverPath}/html/e2e/e2e-grid.html?state=${state}&sh_=Ze&ch_Topic=Personalization`);
    });
    it('MWPW-137142 can clear all topics while preserving search terms', async () => {
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/e2e-grid.html?state=${state}&sh_=Ze&ch_Topic=Stock%252CPersonalization`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const clearFilters = await $('.consonant-LeftFilter-itemBadge');
        await clearFilters.click();
        const cardRes = await $('.consonant-LoadMore-text').getText();
        expect(cardRes).toEqual('Showing 3 of 3 cards');
        const newUrl = await browser.getUrl();
        expect(newUrl.replaceAll('%3D', '=')).toEqual(`${serverPath}/html/e2e/e2e-grid.html?state=${state}&sh_=Ze`);
    });
    // if you are on page 20 and then you set a new filter it should reset to page one
});

describe('Grid Behaviors', async () => {
    // pagination and load more clicking behaviors
    // clicking through grid
    // 3 up 4 up stuff changing layouts
});
