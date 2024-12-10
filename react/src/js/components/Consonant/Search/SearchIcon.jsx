import React from 'react';
import { func } from 'prop-types';

const searchIconType = {
    onClick: func.isRequired,
};

/**
 * Search Icon (Used in Top Filter View Only)
 *
 * Only function it has is to toggle Search Box
 *
 * @component
 * @example
 * const props= {
    onClick: Function,
 * }
 * return (
 *   <Select {...props}/>
 * )
 */
const SearchIcon = (props) => {
    const { onClick } = props;

    return (
        <button
            data-testid="search-icon"
            aria-label="Search"
            type="button"
            className="consonant-SearchIco"
            onClick={onClick}
            tabIndex="0">
            <span />
        </button>
    );
};

SearchIcon.propTypes = searchIconType;

export default SearchIcon;
