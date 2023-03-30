const PORT = 5000;
const config = {
    collection: {
        mode: 'lightest', // Can be empty, "light", "dark", "darkest";
        layout: {
            type: '3up', // Can be "2up", "3up", "4up", "5up";
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
        customSort(card) { console.log('customSort: ', card); return card; },
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
    customCard: ['data', 'return `<div class=customCard><div class=backgroundImg></div> <section><label>PHOTO EDITING</label><p><b>Transform a landscape with Sky Replacement.</b></p></div></section> </div>`'],
    onCardSaved() {},
    onCardUnsaved() {},
};

let serverPath = 'https://adobecom.github.io/caas';
const args = process.argv.slice(2);
if (args.includes('env=LOCAL')) {
    serverPath = `http://localhost:${PORT}`;
    config.collection.endpoint = '../../mock-json/smoke.json';
}

describe('MWPW-126169: Hide CTAs', async () => {
    it('CTA should exist', async () => {
        const state = btoa(JSON.stringify(config));
        const url = `${serverPath}/html/e2e/MWPW-126169.html?state=${state}`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const buttonText = await $('#ac578dee-f01b-3ea0-a282-2116619e4251 .consonant-BtnInfobit--cta').getText();
        await expect(buttonText).toEqual('Read More');
    });
    it('CTA should not exist', async () => {
        const cloneConfig = { ...config };
        cloneConfig.hideCtaIds = ['ac578dee-f01b-3ea0-a282-2116619e4251'];
        const state = btoa(JSON.stringify(cloneConfig));
        const url = `${serverPath}/html/e2e/MWPW-126169.html?state=${state}`;
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        await browser.pause();
        const exists = await $('#ac578dee-f01b-3ea0-a282-2116619e4251 .consonant-BtnInfobit--cta').isDisplayed();
        expect(exists).toEqual(false);
    });
});
describe('Carousel', async () => {
    const cloneConfig = { ...config };
    cloneConfig.collection.layout.container = 'carousel';

    const state = btoa(JSON.stringify(config));
    const url = `${serverPath}/html/e2e/carousel.html?state=${state}`;

    it('Carousel Title should exist', async () => {
        await browser.url(url);
        await browser.setTimeout({ script: 50000 });
        const title = await $('.consonant-CarouselInfo-collectionTitle').getText();
        await expect(title).toEqual('Lorem Ipsum');
    });

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

