import React from 'react';
import {
    string,
    func,
} from 'prop-types';
import { sanitizeStr } from '../../../Helpers/Helpers';
import { useConfig } from '../../../Helpers/hooks';

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
     **** Authored Configs ****
        */
    const getConfig = useConfig();
    const removeFilterAria = getConfig('collection', 'i18n.removeFilterAria');

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
            aria-label={removeFilterAria && removeFilterAria.replace('{filter}', sanitizeStr(name))}
            tabIndex="0">
            {sanitizeStr(name)}
        </button>
    );
};

ChosenFilterItem.propTypes = chosenFilterItemType;

export default ChosenFilterItem;
