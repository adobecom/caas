import React from 'react';
import { string } from 'prop-types';

import getPrettyDateInterval from '../../Helpers/prettyFormat';

const dateIntervalType = {
    locale: string.isRequired,
    endTime: string.isRequired,
    startTime: string.isRequired,
    dateFormat: string.isRequired,
};

/**
 * Date Interval Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    startTime: String,
    endTime: String,
    locale: String,
    dateFormat: String,
 * }
 * return (
 *   <DateInterval {...props}/>
 * )
 */
const DateInterval = ({
    startTime,
    endTime,
    locale,
    dateFormat,
}) => {
    const prettyDateInterval = getPrettyDateInterval(startTime, endTime, locale, dateFormat);
    const { country } = JSON.parse(sessionStorage.getItem('feds_location')) || '';
    return (
        <span
            title={prettyDateInterval}
            data-testid="consonant-DateIntervalInfobit"
            className="consonant-DateIntervalInfobit">
            {country === 'GB' ? prettyDateInterval.replace(/GMT.*$/, 'BST') : prettyDateInterval}
        </span>
    );
};

DateInterval.propTypes = dateIntervalType;

export default DateInterval;
