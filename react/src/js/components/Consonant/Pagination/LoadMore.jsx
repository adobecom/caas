import React from 'react';
import classNames from 'classnames';
import {
    number,
    func,
} from 'prop-types';

import { useConfig } from '../Helpers/hooks';

const loadMoreType = {
    show: number.isRequired,
    total: number.isRequired,
    onClick: func.isRequired,
};

/**
 * Load More - Button That Naviates Users To The Next Page
 *
 * @component
 * @example
 * const props= {
    show: Int,
    total: Int,
    onClick: Function,
 * }
 * return (
 *   <LoadMore {...props}/>
 * )
 */
const LoadMore = ({
    show,
    total,
    onClick,
}) => {
    const getConfig = useConfig();

    /**
     * Authored Button Style
     * @type {String}
     */
    const loadMoreButtonStyle = getConfig('pagination', 'loadMoreButton.style');

    /**
     * Whether we should show the quantity of results shown
     * @type {string}
     */
    const showQuantity = getConfig('pagination', 'resultsQuantityShown');

    /**
     * Whether we should apply theme "Three" for the load more button;
     * @type {String}
     */
    const useThemeThree = getConfig('pagination', 'loadMoreButton.useThemeThree');

    /**
     * Authored Button Text
     * @type {String}
     */
    const loadMoreButtonText = getConfig('pagination', 'i18n.loadMore.btnText');

    /**
     * Authored Summary Text
     * @type {String}
     */
    const loadMoreQuantityText = getConfig('pagination', 'i18n.loadMore.resultsQuantityText');

    /**
     * Class name for the load more component:
     * whether it should be primary or over background;
     * @type {String}
     */
    const loadMoreClass = classNames({
        'consonant-LoadMore': true,
        'consonant-LoadMore--overBg': loadMoreButtonStyle === 'over-background' && !useThemeThree,
        'consonant-LoadMore--themeThree': useThemeThree,
    });

    /**
     * Summary Of Load More Results To Show To Users
     * @type {String}
     */
    const summaryText = loadMoreQuantityText
        .replace('{start}', show)
        .replace('{end}', total);

    const shouldDisplayLoadMore = show > 0 && total > 0;
    const shouldDisplayLoadMoreBtn = show < total;

    return (shouldDisplayLoadMore) ? (
        <div
            data-testid="consonant-LoadMore"
            className={loadMoreClass}>
            <div className="consonant-LoadMore-inner">
                {showQuantity &&
                    <p
                        data-testid="consonant-LoadMore-text"
                        className="consonant-LoadMore-text">
                        {summaryText}
                    </p>
                }
                {shouldDisplayLoadMoreBtn &&
                    <button
                        type="button"
                        data-testid="consonant-LoadMore-btn"
                        daa-ll={loadMoreButtonText}
                        className="consonant-LoadMore-btn"
                        onClick={onClick}
                        tabIndex="0">
                        {loadMoreButtonText}
                    </button>
                }
            </div>
        </div>)
        : null;
};

LoadMore.propTypes = loadMoreType;

export default LoadMore;
