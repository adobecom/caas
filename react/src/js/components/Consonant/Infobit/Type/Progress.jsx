import React from 'react';
import { string } from 'prop-types';

const progressType = {
    label: string,
    color: string,
    percentage: string,
    completionText: string,
};

const defaultProps = {
    label: '',
    percentage: '0',
    color: '#1473E6',
    completionText: '',
};

/**
 * Progress Bar infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    label: String,
    completionText: String,
    percentage: String,
    color: String
 * }
 * return (
 *   <Progress {...props}/>
 * )
 */
const Progress = ({
    label,
    completionText,
    percentage,
    color,
}) => {
    const valueStyles = {
        width: `calc(${percentage} + 2px)`,
        backgroundColor: color,
    };

    const BASE_10 = 10;
    /**
     * Percentage as int to be used in Aria Label
     *
     * This is different than Percentage prop @type {String} which is diplayed
     * to user
     * @type {Number}
     */
    const percentageInt = parseInt(percentage, BASE_10);

    return (
        <div
            className="consonant-ProgressInfobit">
            <div
                className="consonant-ProgressInfobit-wrapper">
                <span
                    className="consonant-ProgressInfobit-text"
                    title={label}>
                    {label}
                </span>
                <span
                    className="consonant-ProgressInfobit-text consonant-ProgressInfobit-text--italic"
                    title={completionText}>
                    {completionText}
                </span>
            </div>
            <div
                className="consonant-ProgressInfobit-el">
                <span
                    className="consonant-ProgressInfobit-val"
                    style={valueStyles}
                    role="progressbar"
                    aria-valuenow={percentageInt}
                    aria-valuemin="0"
                    aria-valuemax="100">
                    {percentage}
                </span>
            </div>
        </div>
    );
};

Progress.propTypes = progressType;
Progress.defaultProps = defaultProps;

export default Progress;
