import React from 'react';
import {
    number,
    func,
    string,
} from 'prop-types';
import { useConfig } from '../../../Helpers/hooks';

const selectedItemType = {
    name: string.isRequired,
    numItemsSelected: number,
    handleClear: func.isRequired,
};

const defaultProps = {
    numItemsSelected: 0,
};

/**
 * Badge displaying how many filter options were selected
 * (Only for Left Filter Panel - on desktop breakpoint)
 *
 * @component
 * @example
 * const props= {
    numItemsSelected: Number,
    handleClear: Function,
 * }
 * return (
 *   <SelectedItem {...props}/>
 * )
 */
const SelectedItem = (props) => {
    const {
        name,
        numItemsSelected,
        handleClear,
    } = props;

    /**
     **** Authored Configs ****
        */
    const getConfig = useConfig();
    const removeAllFiltersAria = getConfig('collection', 'i18n.removeAllFiltersAria');

    /**
     * Text - quantity of selected left filter options
     * @type {String}
     */
    const displayNumItemsSelected = numItemsSelected > 0 ? `${numItemsSelected}` : '';

    const ariaLabel = removeAllFiltersAria
        && removeAllFiltersAria.replace('{num}', displayNumItemsSelected).replace('{filter}', name);

    return (
        <button
            data-testid="consonant-LeftFilter-itemBadge"
            type="button"
            className="consonant-LeftFilter-itemBadge"
            onClick={handleClear}
            tabIndex="0"
            aria-label={ariaLabel}>
            {displayNumItemsSelected}
        </button>
    );
};

SelectedItem.propTypes = selectedItemType;
SelectedItem.defaultProps = defaultProps;

/* eslint-disable-next-line import/prefer-default-export */
export { SelectedItem };
