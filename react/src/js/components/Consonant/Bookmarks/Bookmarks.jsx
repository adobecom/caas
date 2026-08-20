import React from 'react';
import classNames from 'classnames';
import {
    bool,
    func,
    number,
} from 'prop-types';

import { useConfig } from '../Helpers/hooks';

const bookmarksType = {
    showBookmarks: bool,
    savedCardsCount: number,
    onClick: func.isRequired,
};

const defaultProps = {
    showBookmarks: false,
    savedCardsCount: 0,
};

/**
 * Bookmarks button with the icon and quanity of the bookmarked cards
 *
 * @component
 * @example
 * const props= {
    showBookmarks: Boolean,
    onClick: Function,
    savedCardsCount: Number,
 * }
 * return (
 *   <Bookmarks {...props}/>
 * )
 */
const Bookmarks = (props) => {
    const {
        onClick,
        showBookmarks,
        savedCardsCount,
    } = props;

    const getConfig = useConfig();

    /**
     **** Authored Configs ****
     */
    const bookmarkTitle = getConfig('bookmarks', 'i18n.leftFilterPanel.filterTitle');
    const bookmarkSelectedIcon = getConfig('bookmarks', 'leftFilterPanel.selectBookmarksIcon');
    const bookmarkUnselectedIcon = getConfig('bookmarks', 'leftFilterPanel.unselectBookmarksIcon');

    /**
     * Whether the bookmarks icon should be selected or not
     * @type {String}
     */
    const bookmarkIcon = showBookmarks ? bookmarkSelectedIcon : bookmarkUnselectedIcon;

    /**
     * Background image CSS styles for the bookmarks icon
     * @type {Object}
     */
    const iconStyles = {
        backgroundImage: bookmarkIcon ? `url(${bookmarkIcon})` : '',
    };

    /**
     * Class name for the bookmarks button:
     * CSS that handles whether the bookmarks icon is selected or not
     * @type {String}
     */
    const bookmarkClass = classNames({
        'consonant-Bookmarks': true,
        'is-selected': showBookmarks,
    });

    return (
        <button
            data-testid="consonant-Bookmarks"
            type="button"
            onClick={onClick}
            className={bookmarkClass}
            tabIndex="0">
            <span
                className="consonant-Bookmarks-icoWrapper">
                <span
                    style={iconStyles}
                    className="consonant-Bookmarks-ico"
                    data-testid="consonant-Bookmarks-ico" />
                <span
                    className="consonant-Bookmarks-title">
                    {bookmarkTitle}
                </span>
            </span>
            <span
                data-testid="consonant-Bookmarks-itemBadge"
                className="consonant-Bookmarks-itemBadge">
                {savedCardsCount}
            </span>
        </button>
    );
};

Bookmarks.propTypes = bookmarksType;
Bookmarks.defaultProps = defaultProps;

export default Bookmarks;
