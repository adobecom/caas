import React from 'react';
import {
    string,
    func,
} from 'prop-types';

const chosenFilterItemType = {
    id: string.isRequired,
    name: string.isRequired,
    onClick: func.isRequired,
    parentId: string.isRequired,
};

/**
 * Component for what filter item was chosen
 * (Only shows up for the Left Filter Panel - on desktop breakpoint)
 *
 * @component
 * @example
 * const props= {
    name: String,
    id: String,
    parentId: String,
    onClick: Function,
 * }
 * return (
 *   <ChosenFilterItem {...props}/>
 * )
 */
const ChosenFilterItem = (props) => {
    const {
        name,
        id,
        parentId,
        onClick,
    } = props;

    /**
     * Unselects the chosen filter option when the filter is clicked
     * @param {ClickEvent} e
     * @listens ClickEvent
     */
    const handleClick = () => {
        onClick(parentId, id, false);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            data-testid="consonant-ChosenFilter"
            className="consonant-ChosenFilter"
            tabIndex="0">
            {name.replaceAll('&amp;', '&')}
        </button>
    );
};

ChosenFilterItem.propTypes = chosenFilterItemType;

export default ChosenFilterItem;
