/* eslint-disable */
//import "./polyfills";
import React from 'react';
import { render } from 'preact';
import { PureComponent } from 'preact/compat';
// import ReactDOM, {render} from 'react-dom'
//import * as ReactDOM from 'react-dom/client';
// import { DOMRegistry } from 'react-dom-components';
import { parseToPrimitive } from './components/Consonant/Helpers/general';
import Container from './components/Consonant/Container/Container';
// import consonantPageRDC from './components/Consonant/Page/ConsonantPageDOM';
//
// const domRegistry = new DOMRegistry(React, render);
// domRegistry.register({
//     consonantPageRDC,
// });
//
// const initReact = (element) => {
//     domRegistry.init(element);
// };
//
// initReact(document);
//
// function collectionLoadedThroughXf(el) {
//     const container = el.firstElementChild;
//     let consonantCardCollection = null;
//     if (container !== null) {
//         consonantCardCollection = container.querySelectorAll('.consonantcardcollection');
//     }
//     return el.className.indexOf('experiencefragment')
//         && consonantCardCollection
//         && consonantCardCollection.length > 0;
// }
//
// let prev = null;
// function authorWatch(el) {
//     if (prev !== el && collectionLoadedThroughXf(el)) {
//         prev = el;
//         domRegistry.render(consonantPageRDC);
//     }
// }
//
// console.log("hi");
//
// // Add to DXF Registry
// try {
//     window.dexter.dxf.registerApp(initReact);
// } catch (e) {
//     /* eslint-disable no-empty */
// }

// export class ConsonantCardCollection {
//     constructor(config) {
//         const root = ReactDOM.createRoot(document.getElementById('someDivId'));
//         root.render(<React.Fragment>
//             <Container />
//         </React.Fragment>);
//     }
// }
//
// window.ConsonantCardCollection = ConsonantCardCollecton;

// var ReactDOMServer = require('react-dom/server');
var config = {
    collection: {
        mode: "lightest", // Can be empty, "light", "dark", "darkest";
        layout: {
            type: '3up', // Can be "2up", "3up", "4up", "5up";
            gutter: '4x', // Can be "2x", "3x", "4x";
            container: '1200MaxWidth', // Can be "83Percent", "1200MaxWidth", "32Margin";
        },
        lazyLoad: false,
        button: {
            style: "call-to-action", // Can be "primary", "call-to-action";
        },
        banner: {
            upcoming: {
                description: "Upcoming"
            },
            live: {
                description: "Live"
            },
            onDemand: {
                description: "On Demand"
            }
        },
        resultsPerPage: '5',
        endpoint: location.hostname === "localhost" ? "../../mock-json/smoke.json" : "../../caas/mock-json/smoke.json",
        totalCardsToShow: '55',
        cardStyle: "1:2", // available options: "1:2", "3:4", "full-card", "half-height", "custom-card", "product", "double-wide";
        showTotalResults: 'true',
        i18n: {
            prettyDateIntervalFormat: '{LLL} {dd} | {timeRange} {timeZone}',
            totalResultsText: '{total} Results',
            title: 'Lorem Ipsum 7',
            titleHeadingLevel: 'h2',
            cardTitleAccessibilityLevel: '3',
            onErrorTitle: 'Sorry there was a system error.',
            onErrorDescription: 'Please try reloading the page or try coming back to the page another time.',
            lastModified: "Last modified {date}"
        },
        setCardBorders: "true", // Can be true or false;
        useOverlayLinks: "false", // Can be true or false;
    },
    featuredCards: ['c7d34f39-397c-3727-9dff-5d0d9d8cf731'],
    filterPanel: {
        enabled: 'true',
        type: 'left',
        eventFilter: 'all',
        showEmptyFilters: true,
        filters: [
            {
                "group": "By Solution",
                "id": "adobe-com-enterprise:topic",
                "items": [
                    {
                        "label": "Business Continuity",
                        "id": "adobe-com-enterprise:topic/business-continuity"
                    },
                    {
                        "label": "Creativity and Design",
                        "id": "adobe-com-enterprise:topic/creativity-design"
                    },
                    {
                        "label": "Customer Intelligence",
                        "id": "adobe-com-enterprise:topic/customer-intelligence"
                    },
                    {
                        "label": "Data Management Platform",
                        "id": "adobe-com-enterprise:topic/data-management-platform"
                    },
                    {
                        "label": "Digital Foundation",
                        "id": "adobe-com-enterprise:topic/digital-foundation"
                    },
                    {
                        "label": "Digital Trends",
                        "id": "adobe-com-enterprise:topic/digital-trends"
                    },
                    {
                        "label": "Document Management",
                        "id": "adobe-com-enterprise:topic/document-management"
                    },
                    {
                        "label": "Marketing Automation",
                        "id": "adobe-com-enterprise:topic/marketing-automation"
                    },
                    {
                        "label": "Personalization",
                        "id": "adobe-com-enterprise:topic/personalization"
                    },
                    {
                        "label": "Stock",
                        "id": "adobe-com-enterprise:topic/Stock"
                    }
                ]
            },
            {
                "group": "Availability",
                "id": "adobe-com-enterprise:availability",
                "items": [
                    {
                        "label": "On-Demand",
                        "id": "adobe-com-enterprise:availability/on-demand"
                    },
                    {
                        "label": "Upcoming",
                        "id": "adobe-com-enterprise:availability/upcoming"
                    }
                ]
            },
            {
                "group": "Duration",
                "id": "adobe-com-enterprise:duration",
                "items": [
                    {
                        "label": "Long",
                        "id": "adobe-com-enterprise:duration/long"
                    },
                    {
                        "label": "Short",
                        "id": "adobe-com-enterprise:duration/short"
                    }
                ]
            },
            {
                "group": "Rating",
                "id": "adobe-com-enterprise:rating",
                "items": [
                    {
                        "label": "5",
                        "id": "adobe-com-enterprise:rating/5"
                    },
                    {
                        "label": "4",
                        "id": "adobe-com-enterprise:rating/4"
                    }
                ]
            }
        ],
        filterLogic: 'or',
        topPanel: {
            mobile: {
                blurFilters: true,
            }
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
                    }
                }
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
                    }
                }
            }
        }
    },
    hideCtaIds: [''],
    sort: {
        enabled: 'true',
        defaultSort: 'customSort',
        options: '[{"label":"Random", "sort":"random"},{"label":"Featured","sort":"featured"},{"label":"Title: (A-Z)","sort":"titleAsc"},{"label":"Title: (Z-A)","sort":"titleDesc"},{"label":"Date: (Oldest to newest)","sort":"dateAsc"},{"label":"Date: (Newest to oldest)","sort":"dateDesc"}, {"label": "Custom Sort", "sort": "customSort"}]',
        customSort: function(card){console.log("customSort: ", card); return card;}
    },
    pagination: {
        animationStyle: 'paged',
        enabled: 'true',
        type: 'loadMore',
        loadMoreButton: {
            style: "primary", // Can be "primary", "over-background";
            useThemeThree: "true", // Can be "true" or "false";
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
            }
        }
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
            }
        }
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
            }
        }
    },
    language: 'en-US',
    analytics: {
        trackImpressions: 'true',
        collectionIdentifier: 'Some Identifier',
    },
    customCard: ["data", "return `<div class=customCard><div class=backgroundImg></div> <section><label>PHOTO EDITING</label><p><b>Transform a landscape with Sky Replacement.</b></p></div></section> </div>`"],
    onCardSaved: function(){},
    onCardUnsaved: function(){}
};

// class Foo extends PureComponent {
//     render(props) {
//         console.log("render");
//         return <div> Hi </div>
//     }
// }

const dom = document.getElementById('someDivId');
render(<Container config={parseToPrimitive(config)} />, dom);

// var a = ReactDOMServer.renderToString(<React.Fragment>
//     <Container config={parseToPrimitive(config)} />
// </React.Fragment>);
//
// window.a = a;
// console.log(a);

// ReactDOM.hydrate(<React.Fragment>
//     <Container config={parseToPrimitive(config)} />
// </React.Fragment>, document.getElementById('someDivId'));

// if (window.Granite && window.dx) {
//     window.dx.author.watch.registerFunction(authorWatch);
// }
// export default initReact;
