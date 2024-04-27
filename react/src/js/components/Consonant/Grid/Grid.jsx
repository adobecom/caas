import React from 'react';
import classNames from 'classnames';
import {
    arrayOf,
    bool,
    func,
    number,
    shape,
    string,
    object,
} from 'prop-types';
import parseHTML from 'html-react-parser';

import { cardType } from '../types/card';
import { getByPath } from '../Helpers/general';
import { useConfig } from '../Helpers/hooks';
import Card from '../Cards/Card';

import {
    CARD_STYLES,
    DEFAULT_SHOW_ITEMS_PER_PAGE,
    GRID_TYPE,
    GUTTER_SIZE,
} from '../Helpers/constants';

const cardsGridType = {
    pages: number,
    resultsPerPage: number,
    cards: arrayOf(shape(cardType)),
    onCardBookmark: func.isRequired,
    containerType: string,
    isAriaLiveActive: bool,
    // eslint-disable-next-line react/forbid-prop-types
    forwardedRef: object,
};

const defaultProps = {
    pages: 1,
    cards: [],
    resultsPerPage: DEFAULT_SHOW_ITEMS_PER_PAGE,
    containerType: 'default',
    isAriaLiveActive: false,
    forwardedRef: null,
};

/**
 * Contains a grid of cards (of different styles)
 *
 * @component
 * @example
 * const props= {
    resultPerPage: Int,
    pages: Int,
    onCardBookmark: Boolean,
    cards: [],
 * }
 * return (
 *   <Grid {...props}/>
 * )
 */
const Grid = (props) => {
    const {
        resultsPerPage,
        pages,
        onCardBookmark,
        cards,
        containerType,
        isAriaLiveActive,
        // eslint-disable-next-line react/forbid-prop-types
        forwardedRef,
    } = props;

    /**
     **** Authored Configs ****
     */
    const getConfig = useConfig();
    const collectionStyleOverride = getConfig('collection', 'cardStyle')
        .replace('1:2', 'one-half')
        .replace('3:4', 'three-fourths');
    const cardsGridLayout = getConfig('collection', 'layout.type');
    const cardsGridGutter = getConfig('collection', 'layout.gutter');
    const renderCardsBorders = getConfig('collection', 'setCardBorders');
    const renderFooterDivider = getConfig('collection', 'showFooterDivider');
    const renderCardsOverlay = getConfig('collection', 'useOverlayLinks');
    const dateFormat = getConfig('collection', 'i18n.prettyDateIntervalFormat');
    const locale = getConfig('language', '');
    const paginationType = getConfig('pagination', 'type');
    const collectionButtonStyle = getConfig('collection', 'collectionButtonStyle');

    let customCard;
    try {
        /* eslint-disable-next-line no-new-func */
        customCard = new Function('card', getConfig('customCard', '')[1]);
    } catch (e) {
        customCard = () => {};
    }

    /**
     * Class name for the cards grid:
     * whether the grid should show 2, 3, 4 or 5 cards in a row;
     * whether the grid should have a gutter of 8px, 16px, 24px or 32px;
     * @type {String}
     */
    const gridClass = classNames({
        'consonant-CardsGrid': true,
        'consonant-CardsGrid--2up': cardsGridLayout === GRID_TYPE.TWO_UP,
        'consonant-CardsGrid--3up': cardsGridLayout === GRID_TYPE.THREE_UP,
        'consonant-CardsGrid--4up': cardsGridLayout === GRID_TYPE.FOUR_UP,
        'consonant-CardsGrid--5up': cardsGridLayout === GRID_TYPE.FIVE_UP,
        'consonant-CardsGrid--with1xGutter': cardsGridGutter === GUTTER_SIZE.GUTTER_1_X,
        'consonant-CardsGrid--with2xGutter': cardsGridGutter === GUTTER_SIZE.GUTTER_2_X,
        'consonant-CardsGrid--with3xGutter': cardsGridGutter === GUTTER_SIZE.GUTTER_3_X,
        'consonant-CardsGrid--with4xGutter': cardsGridGutter === GUTTER_SIZE.GUTTER_4_X,
        'consonant-CardsGrid--doubleWideCards': collectionStyleOverride === CARD_STYLES.DOUBLE_WIDE,
    });

    const bannerMap = {
        live: {
            description: getConfig('collection', 'banner.live.description'),
            backgroundColor: '#ffffff',
            fontColor: '#d7373f',
            icon: 'https://www.adobe.com/content/dam/cc/icons/live_banner_icon.svg',
        },
        upcoming: {
            description: getConfig('collection', 'banner.upcoming.description'),
            backgroundColor: '#FC6B35',
            fontColor: '#000000',
            icon: '',
        },
        onDemand: {
            description: getConfig('collection', 'banner.onDemand.description'),
            backgroundColor: '#2D9D78',
            fontColor: '#000000',
            icon: '',
        },
        register: {
            description: getConfig('collection', 'banner.register.description'),
            backgroundColor: '#EBC526',
            fontColor: '#323232',
            icon: '',
        },
    };

    /**
     * Whether the paginator component is being used
     * @type {Boolean}
     */
    const isPaginator = paginationType === 'paginator';
    const isLoadMore = paginationType === 'loadMore' || containerType === 'carousel';

    /**
     * Total pages to show (used if paginator component is set)
     * @type {Number}
     */
    const totalPages = resultsPerPage * pages;

    /**
     * The final cards to show in the collection
     * @type {Array}
     */
    let cardsToshow = cards;

    /**
     * Current page (used if paginator component is authored)
     * @type {Number}
     */
    const currentPage = resultsPerPage * (pages - 1);

    if (isPaginator) {
        cardsToshow = cards.slice(currentPage, totalPages);
    }

    /**
     * Current page (used if load more button is authored)
     * @type {Number}
     */
    if (isLoadMore) {
        cardsToshow = cards.slice(0, resultsPerPage * pages);
    }

    const cleanTitle = title => title.toString().replace(/\|/g, '-');

    /**
     * Scrolls a card into view if any of its children is on focus.
     * @param {string} card - ID of the card to display
     */
    const scrollCardIntoView = (card) => {
        if (!card) return;
        const element = document.getElementById(card);
        element.scrollIntoView({ block: 'nearest' });
    };

    /**
     * Determines whether ctas should be hidden on a given card
     * @param {Object} card - object to get value
     * @param {String} style - the collection button style
     * @returns {bool} - whether a cta should be hidden
     */
    const getHideCta = (card, style) => {
        if (card.hideCtaId || card.hideCtaTags || style === 'hidden') return true;
        return false;
    };

    return cardsToshow.length > 0 && (
        <div
            ref={forwardedRef}
            data-card-style={collectionStyleOverride}
            data-testid="consonant-CardsGrid"
            className={gridClass}
            aria-live={isAriaLiveActive ? 'polite' : 'off'}>
            {cardsToshow.map((card, index) => {
                const cardStyleOverride = getByPath(card, 'styles.typeOverride');
                const cardStyle = collectionStyleOverride || cardStyleOverride;
                const { contentArea: { title = '' } = {}, id } = card;
                const cardNumber = index + 1;
                const hideCTA = getHideCta(card, collectionButtonStyle);

                switch (cardStyle) {
                    case CARD_STYLES.CUSTOM:
                        return parseHTML(customCard(card));
                    default:
                        return (
                            <Card
                                cardStyle={cardStyle}
                                lh={`Card ${cardNumber} | ${cleanTitle(title)} | ${id}`}
                                key={card.id}
                                {...card}
                                bannerMap={bannerMap}
                                onClick={onCardBookmark}
                                dateFormat={dateFormat}
                                locale={locale}
                                renderBorder={renderCardsBorders}
                                renderDivider={renderFooterDivider}
                                renderOverlay={renderCardsOverlay}
                                hideCTA={hideCTA}
                                onFocus={() => scrollCardIntoView(card.id)} />
                        );
                }
            })}
        </div>
    );
};

Grid.propTypes = cardsGridType;
Grid.defaultProps = defaultProps;

export default Grid;
