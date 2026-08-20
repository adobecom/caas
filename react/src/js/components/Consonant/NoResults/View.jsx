import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

import { RenderDisplayMsg } from '../Helpers/rendering';
import { useConfig } from '../Helpers/hooks';

const viewType = {
    description: string,
    replaceValue: string,
    title: string.isRequired,
};

const defaultProps = {
    description: '',
    replaceValue: '',
};

/**
 * No results message that is shown when search returned 0 results;
 *
 * @component
 * @example
 * const props= {
    title: String
    description: String,
    replaceValue: String,
 * }
 * return (
 *   <NoResultsView {...props}/>
 * )
 */
const View = (props) => {
    const {
        title,
        description,
        replaceValue,
    } = props;

    const getConfig = useConfig();

    const displayMsg = RenderDisplayMsg(description, replaceValue);
    const useLightText = getConfig('collection', 'useLightText');

    /**
     * Class name for the NoResultsView:
     * whether we should apply dark or light theme
     * @type {String}
     */
    const noResultsViewClass = classNames({
        'consonant-NoResultsView': true,
        'consonant-NoResultsView--withLightText': useLightText,
    });

    return (
        <div
            data-testid="consonant-NoResultsView"
            className={noResultsViewClass}>
            <strong
                className="consonant-NoResultsView-title">
                {title}
            </strong>
            {description &&
                <div
                    className="consonant-NoResultsView-description">
                    {displayMsg}
                </div>
            }
        </div>
    );
};

View.propTypes = viewType;
View.defaultProps = defaultProps;

export default View;
