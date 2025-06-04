import React from 'react';
import classNames from 'classnames';
import {
    bool,
    string,
    func,
} from 'prop-types';

import Tooltip from './Tooltip';
import { useConfig } from '../../../Helpers/hooks';

const bookmarkType = {
    isBookmarked: bool,
    saveCardIcon: string,
    unsaveCardIcon: string,
    onClick: func.isRequired,
    cardId: string.isRequired,
    disableBookmarkIco: bool.isRequired,
    isProductCard: bool,
};

const defaultProps = {
    saveCardIcon: '',
    unsaveCardIcon: '',
    isBookmarked: false,
    isProductCard: false,
};

/**
 * Bookmark Infobit (shown in 3:2 Card Footer)
 * Used to save/unsave a card to local storage
 *
 * @component
 * @example
 * const props= {
    cardId: String,
    isBookmarked: String,
    saveCardIcon: String,
    unsaveCardIcon: String,
    cardSaveText: String,
    cardUnsaveText: String,
    onClick: Function,
    disableBookmarkIco: Boolean,
 * }
 * return (
 *   <Bookmark {...props}/>
 * )
 */
const Bookmark = ({
    cardId,
    isBookmarked,
    saveCardIcon,
    unsaveCardIcon,
    onClick,
    disableBookmarkIco,
    isProductCard,
}) => {
    const getConfig = useConfig();
    const showOnCards = getConfig('bookmarks', 'showOnCards');

    /**
     **** Authored Configs ****
     */
    const saveCardText = getConfig('bookmarks', 'i18n.card.saveText');
    const unsaveCardText = getConfig('bookmarks', 'i18n.card.unsaveText');

    const bookmarkInfobitClass = classNames({
        'consonant-BookmarkInfobit': true,
        'is-active': isBookmarked,
        'is-disabled': disableBookmarkIco,
    });

    const bookmarkIcon = () => {
        const cardIcon = isBookmarked ? saveCardIcon : unsaveCardIcon;
        return (
            <span
                data-testid="consonant-BookmarkInfobit-ico"
                className="consonant-BookmarkInfobit-ico"
                daa-ll="bookmark"
                style={{ backgroundImage: cardIcon ? `url(${cardIcon})` : '' }} />
        );
    };

    const handleClick = (clickEvt) => {
        clickEvt.stopPropagation();
        onClick(cardId);
    };

    const tooltipText = isBookmarked ? unsaveCardText : saveCardText;

    return (
        !isProductCard && showOnCards &&
        <button
            data-testid="consonant-BookmarkInfobit"
            data-tooltip-wrapper
            type="button"
            className={bookmarkInfobitClass}
            onClick={handleClick}
            tabIndex="0">
            {showOnCards && bookmarkIcon()}
            {showOnCards && <Tooltip
                data-testid="consonant-Tooltip"
                text={tooltipText} />}
        </button>
    );
};

Bookmark.propTypes = bookmarkType;
Bookmark.defaultProps = defaultProps;

export default Bookmark;
