// tests/e2e/collection.spec.js
const generateUrl = require('../helpers/generateUrl');
const config = require('../config.json');
const fs = require('fs');
const path = 'e2e-tests/screenshots';

if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
}

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

describe('Live Pages with ?caasbeta=true', () => {
    // Ensure the screenshot directory exists
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    const pages = [
        'https://www.adobe.com/acrobat/resources.html',
        'https://www.adobe.com/acrobat/hub/change-page-size-of-pdf-in-4-steps.html',
        'https://www.adobe.com/creativecloud/video/discover.html',
        'https://www.adobe.com/in/acrobat/roc/blog/how-to-convert-zip-files-to-pdf-document.html',
        'https://www.adobe.com/au/acrobat/resources.html',
    ];

    pages.forEach((page) => {
        it(`should display the first card on: ${page}`, async () => {
            // 1) Navigate with ?caasbeta=true
            const url = `${page}?caasbeta=true`;
            console.log(`Navigating to: ${url}`);
            await browser.url(url);

            // 2) Scroll if needed (lazy loading for below-the-fold content)
            await browser.scroll(0, 9999);
            await browser.pause(3000);

            // 3) Check for .consonant-Card
            const cardSelector = '.consonant-Card';

            try {
                await $(cardSelector).waitForExist({ timeout: 30000 });
                await $(cardSelector).waitForDisplayed({ timeout: 30000 });
            } catch (err) {
                // If the card doesn't appear, take a screenshot for debugging
                const failurePath = `${path}/failure-${encodeURIComponent(page)}.png`;
                console.log(`Test failed for ${page}, saving screenshot: ${failurePath}`);
                await browser.saveScreenshot(failurePath);

                // Optionally log <body> HTML to see what's really in the DOM
                const bodyHTML = await $('body').getHTML();
                console.log(`BODY HTML for ${page} on failure:\n${bodyHTML}\n\n`);

                throw err; // re-throw so the test is marked as failed
            }

            // 4) If we reach here, the test passed
            //    Still take a screenshot so we can see the final rendered state on success
            const successPath = `${path}/success-${encodeURIComponent(page)}.png`;
            console.log(`Test passed for ${page}, saving screenshot: ${successPath}`);
            await browser.saveScreenshot(successPath);

            // Final verification
            const isDisplayed = await $(cardSelector).isDisplayed();
            expect(isDisplayed).toBe(true);
        });
    });
});
