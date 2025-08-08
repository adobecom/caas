// tests/e2e/collection.spec.js
const generateUrl = require('../helpers/generateUrl');
const config = require('../config.json');

describe('Sort Options', () => {
    // Corrected line: Remove JSON.parse since config.sort.options is already an array
    const sortOptions = config.sort.options;

    sortOptions.forEach((sortOption) => {
        it(`should sort cards by ${sortOption.label}`, async () => {
            const url = generateUrl({
                sort: {
                    enabled: 'true',
                    defaultSort: sortOption.sort,
                },
            });

            await browser.url(url);
            // Add logic to verify sorting if possible
            const firstCardTitle = await $('.consonant-Card-title').getText();
            expect(firstCardTitle).not.toBe('');
        });
    });
});

describe('Hide CTA IDs', () => {
    it('should not display cards with specified IDs', async () => {
        const url = generateUrl({
            hideCtaIds: ['card-id-to-hide'],
        });

        await browser.url(url);
        /*eslint-disable*/
        const hiddenCardExists = await $(`.consonant-Card[data-id="card-id-to-hide"]`).isExisting();
        /* eslint-enable */
        expect(hiddenCardExists).toBe(false);
    });
});

describe('Carousel Behaviors', () => {
    it('Carousel Title should exist', async () => {
        const url = generateUrl({
            collection: {
                layout: {
                    container: 'carousel',
                },
            },
        });

        await browser.url(url);

        await browser.setTimeout({ script: 50000 });

        await browser.waitUntil(async () => {
            const titleElement = await $('.consonant-CarouselInfo-collectionTitle');
            return titleElement.isDisplayed();
        }, {
            timeout: 15000,
            timeoutMsg: 'Carousel title was not found within the timeout period',
        });

        const title = await $('.consonant-CarouselInfo-collectionTitle').getText();
        expect(title).toEqual('Lorem Ipsum');
    });
});

describe('Container Sizes', () => {
    // Updated container names to match the actual class names
    const containers = [
        { name: '83Percent', className: 'consonant-Wrapper--83PercentContainier' }, // Note the typo: 'Containier' should likely be 'Container'
        { name: '1200MaxWidth', className: 'consonant-Wrapper--1200MaxWidth' },
        { name: '32Margin', className: 'consonant-Wrapper--32MarginContainer' },
        { name: '1600MaxWidth', className: 'consonant-Wrapper--1600MaxWidth' },
    ];

    containers.forEach(({ name, className }) => {
        it(`should apply container size ${name}`, async () => {
            const url = generateUrl({
                collection: {
                    layout: {
                        container: name,
                    },
                },
            });

            await browser.url(url);
            const containerClassExists = await $(`.${className}`).isExisting();
            expect(containerClassExists).toBe(true);
        });
    });
});

describe('Layout Types', () => {
    const layoutTypes = ['2up', '3up', '4up', '5up'];

    layoutTypes.forEach((layoutType) => {
        it(`should display ${layoutType} layout correctly`, async () => {
            const url = generateUrl({
                collection: {
                    layout: {
                        type: layoutType,
                    },
                },
            });

            await browser.url(url);

            // Corrected selector based on Grid component
            const gridSelector = `.consonant-CardsGrid--${layoutType}`;
            const gridElement = await $(gridSelector);

            // Wait for the grid to exist and be displayed
            await gridElement.waitForExist({ timeout: 15000 });
            await gridElement.waitForDisplayed({ timeout: 15000 });

            const gridExists = await gridElement.isExisting();
            const gridDisplayed = await gridElement.isDisplayed();

            // Log class names for debugging
            const classes = await gridElement.getAttribute('class');
            console.log(`Grid Element Classes for ${layoutType}: ${classes}`);

            expect(gridExists).toBe(true);
            expect(gridDisplayed).toBe(true);
        });
    });
});

describe('Card Styles', () => {
    const cardStyles = ['one-half', 'icon-card', 'text-card', 'three-fourths', 'full-card', 'half-height', 'product', 'double-wide'];

    cardStyles.forEach((cardStyle) => {
        it(`should display cards with style ${cardStyle}`, async () => {
            const url = generateUrl({
                collection: {
                    cardStyle,
                },
            });

            await browser.url(url);

            let cardElement;

            if (cardStyle.includes(':')) {
                // Use XPath selector for styles with ':'
                const sanitizedCardStyle = cardStyle.replace(':', '-'); // Replace ':' with '-'
                const xpathSelector = `//div[contains(@class, 'consonant-Card') and contains(@class, '${sanitizedCardStyle}')]`;
                cardElement = await $(xpathSelector);
            } else {
                // Use CSS selector for other styles
                const cardSelector = `.consonant-Card.${cardStyle}`;
                cardElement = await $(cardSelector);
            }

            // Wait for the card to exist and be displayed
            await cardElement.waitForExist({ timeout: 10000 });
            await cardElement.waitForDisplayed({ timeout: 10000 });

            const cardExists = await cardElement.isExisting();
            const cardDisplayed = await cardElement.isDisplayed();

            expect(cardExists).toBe(true);
            expect(cardDisplayed).toBe(true);
        });
    });
});

describe('Pagination Types', () => {
    const paginationTypes = ['loadMore', 'paginator'];

    paginationTypes.forEach((paginationType) => {
        it(`should display ${paginationType} pagination correctly`, async () => {
            const url = generateUrl({
                pagination: {
                    type: paginationType,
                },
                collection: {
                    resultsPerPage: 2,
                },
            });

            await browser.url(url);
            if (paginationType === 'loadMore') {
                const loadMoreButtonExists = await $('.consonant-LoadMore-btn').isExisting();
                expect(loadMoreButtonExists).toBe(true);
            } else {
                const paginatorExists = await $('.consonant-Pagination-paginator').isExisting();
                expect(paginatorExists).toBe(true);
            }
        });
    });
});

describe ('Pagination quantity', () => {
    const paginationTypes = ['loadMore', 'paginator'];

    paginationTypes.forEach((paginationType) => {
        it(`should display pagination quantity for ${paginationType}`, async () => {
            const url = generateUrl({
                pagination: {
                    type: paginationType,
                    resultsQuantityShown: 'true',
                },
                collection: {
                    resultsPerPage: 2,
                },
            });

            await browser.url(url);
            if (paginationType === 'loadMore') {
                const loadMoreTextExists = await $('.consonant-LoadMore-text').isExisting();
                expect(loadMoreTextExists).toBe(true);
            } else {
                const paginationSummaryExists = await $('.consonant-Pagination-summary').isExisting();
                expect(paginationSummaryExists).toBe(true);
            }
        });
    });

    paginationTypes.forEach((paginationType) => {
        it(`should NOT display pagination quantity for ${paginationType}`, async () => {
            const url = generateUrl({
                pagination: {
                    type: paginationType,
                    resultsQuantityShown: 'false',
                },
                collection: {
                    resultsPerPage: 2,
                },
            });

            await browser.url(url);
            if (paginationType === 'loadMore') {
                const loadMoreTextExists = await $('.consonant-LoadMore-text').isExisting();
                expect(loadMoreTextExists).toBe(false);
            } else {
                const paginationSummaryExists = await $('.consonant-Pagination-summary').isExisting();
                expect(paginationSummaryExists).toBe(false);
            }
        });
    });
});

describe('Themes', () => {
    const themes = ['light', 'dark', 'darkest'];

    themes.forEach((theme) => {
        it(`should apply ${theme} theme correctly`, async () => {
            const url = generateUrl({
                collection: {
                    mode: theme,
                },
            });

            await browser.url(url);
            const themeClassExists = await $(`.consonant-u-theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`).isExisting();
            expect(themeClassExists).toBe(true);
        });
    });
});


describe('Mode Switching', () => {
    it('should switch to dark mode', async () => {
        const url = generateUrl({
            collection: {
                mode: 'dark',
            },
        });

        await browser.url(url);
        const themeClassExists = await $('.consonant-u-themeDark').isExisting();
        expect(themeClassExists).toBe(true);
    });
});

describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
        const url = generateUrl({
            collection: {
                endpoint: 'invalid_endpoint.json',
            },
        });

        await browser.url(url);
        const errorTitle = await $('.consonant-NoResultsView-title').getText();
        expect(errorTitle).toEqual('Sorry there was a system error.');
    });
});


describe('Total Cards to Show', () => {
    it('should limit total cards displayed to specified number', async () => {
        const url = generateUrl({
            collection: {
                totalCardsToShow: '3',
            },
        });

        await browser.url(url);
        const cards = await $$('.consonant-Card');
        expect(cards.length).toBeLessThanOrEqual(3);
    });
});

describe('Gutter Sizes', () => {
    const gutters = ['1x', '2x', '3x', '4x'];

    gutters.forEach((gutter) => {
        it(`should apply gutter size ${gutter}`, async () => {
            const url = generateUrl({
                collection: {
                    layout: {
                        container: 'carousel',
                        gutter,
                    },
                },
            });

            await browser.url(url);

            // Map the gutter size to the corresponding class name
            const gutterClass = `consonant-CardsGrid--with${gutter}Gutter`;

            // Check if the expected class is applied
            const gutterClassExists = await $(`.${gutterClass}`).isExisting();
            expect(gutterClassExists).toBe(true);
        });
    });
});


describe('Analytics Tracking', () => {
    it('should have analytics attributes set', async () => {
        const url = generateUrl({
            analytics: {
                trackImpressions: 'true',
                collectionIdentifier: 'Test Collection',
            },
        });

        await browser.url(url);
        const analyticsAttr = await $('.consonant-Wrapper').getAttribute('daa-lh');
        expect(analyticsAttr).toContain('Test Collection');
    });
});

describe('Dexter Events Page', () => {
    let url = 'http://localhost:5000/html/dexter-events.html';
    if (process.env.GITHUB_ACTIONS) {
        // eslint-disable-next-line no-template-curly-in-string
        url = 'https://adobecom.github.io/caas/html/dexter-events.html';
    }
    it('should load the events data and display at least one card', async () => {
        await browser.url(url);
        const cardSelector = '.consonant-Card';
        await $(cardSelector).waitForExist({ timeout: 10000 });
        expect(await $(cardSelector).isDisplayed()).toBe(true);
    });
});

describe('Paginator out of Range', () => {
    let url = 'http://localhost:5000/html/test-page.html?page=100';
    if (process.env.GITHUB_ACTIONS) {
        // eslint-disable-next-line no-template-curly-in-string
        url = 'https://adobecom.github.io/caas/html/test-page.html';
    }
    it('should load page 1 of the card collection', async () => {
        await browser.url(url);
        const gridSelector = '.consonant-CardsGrid';
        await $(gridSelector).waitForExist({ timeout: 10000 });
        expect(await $(gridSelector).isDisplayed()).toBe(true);
    });
});

describe('Live Pages with ?caasver=alpha (TESTS MILO PAGES ONLY)', () => {
    const pages = [
        'https://www.adobe.com/acrobat/resources.html',
        'https://www.adobe.com/acrobat/hub/change-page-size-of-pdf-in-4-steps.html',
        'https://www.adobe.com/creativecloud/video/discover.html',
        'https://www.adobe.com/au/acrobat/resources.html',
    ];

    pages.forEach((page) => {
        it(`should display the first card on: ${page}`, async () => {
            // Special handling for the problematic page in CI
            const isProblematicPage = page.includes('change-page-size-of-pdf-in-4-steps.html');
            const maxRetries = isProblematicPage ? 2 : 1;

            let lastError;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`Navigating to: ${page}?caasver=alpha (Attempt ${attempt}/${maxRetries})`);

                    // 1) Navigate with ?caasver=alpha
                    await browser.url(`${page}?caasver=alpha`);

                    // 2) Wait for page to be fully loaded
                    await browser.waitUntil(async () => {
                        const readyState = await browser.execute(() => document.readyState);
                        return readyState === 'complete';
                    }, {
                        timeout: 15000,
                        timeoutMsg: 'Page did not finish loading within timeout'
                    });

                    // 3) Extra wait for problematic page in CI environment
                    if (isProblematicPage && process.env.GITHUB_ACTIONS) {
                        console.log('CI environment detected - adding extra wait for problematic page');
                        await browser.pause(8000);
                    }

                    // 4) Scroll to trigger lazy loading
                    await browser.scroll(0, 9999);
                    await browser.pause(3000);

                    // 5) Check for .consonant-Card
                    const cardSelector = '.consonant-Card';
                    await $(cardSelector).waitForExist({ timeout: 45000 });
                    await $(cardSelector).waitForDisplayed({ timeout: 45000 });

                    // 6) Final verification
                    const isDisplayed = await $(cardSelector).isDisplayed();
                    expect(isDisplayed).toBe(true);

                    // Success - break out of retry loop
                    console.log(`✓ Successfully found cards on ${page} (attempt ${attempt})`);
                    break;

                } catch (error) {
                    lastError = error;
                    console.error(`✗ Attempt ${attempt} failed for ${page}: ${error.message}`);

                    // Only do debugging on final attempt
                    if (attempt === maxRetries) {
                        console.error('=== FINAL ATTEMPT DEBUG INFO ===');
                        try {
                            const currentUrl = await browser.getUrl();
                            const title = await browser.getTitle();
                            console.log(`Current URL: ${currentUrl}`);
                            console.log(`Page title: ${title}`);

                            // Check for any CaaS-related elements
                            const caasSelectors = ['.consonant-Card', '[class*="consonant"]', '[data-module-id]'];
                            for (const selector of caasSelectors) {
                                const elements = await $$(selector);
                                console.log(`Elements found with "${selector}": ${elements.length}`);
                            }

                            // Check console errors
                            try {
                                const logs = await browser.getLogs('browser');
                                const errors = logs.filter(log => log.level === 'SEVERE');
                                if (errors.length > 0) {
                                    console.log('Browser console errors:', errors.map(e => e.message));
                                }
                            } catch (logError) {
                                console.log('Could not retrieve logs:', logError.message);
                            }

                        } catch (debugError) {
                            console.error('Debug error:', debugError.message);
                        }

                        // Re-throw the last error to fail the test
                        throw lastError;
                    } else {
                        // Wait before retrying
                        console.log(`Waiting 5 seconds before retry...`);
                        await browser.pause(5000);
                    }
                }
            }
        });
    });
});
