import React from 'react';
import classNames from 'classnames';
import {
    string,
    number,
} from 'prop-types';

const maxAllowedStars = 5;
const defaultFilledStars = 0;

const ratingType = {
    label: string,
    totalStars: number,
    starsFilled: number,
};

const defaultProps = {
    label: '',
    totalStars: maxAllowedStars,
    starsFilled: defaultFilledStars,
};

/**
 * Will calculate the rating (percentage) that is shown
 * @param {Number} id - How many stars should be filled
 * @param {Number} id - Total amount of stars to display
 * @returns {Number} - Rating Percentage
 */
const getRating = (starsFilled, totalStars) => {
    const starsFilledNotValid = starsFilled < 0 || starsFilled > totalStars;
    const totalStarsNotValid = totalStars <= 0 || totalStars > maxAllowedStars;

    if (starsFilledNotValid) {
        /* eslint-disable-next-line no-param-reassign */
        starsFilled = defaultFilledStars;
    }

    if (totalStarsNotValid) {
        /* eslint-disable-next-line no-param-reassign */
        totalStars = Number.MAX_SAFE_INTEGER;
    }

    const scalingFactor = 100;
    const ratingPercentage = starsFilled / totalStars;
    const rating = Math.round(ratingPercentage * scalingFactor);
    return rating;
};

/**
 * Rating Infobit (shown in 3:2 Card Footer)
 *
 * Displays how many stars should be shown for a giving rating
 *
 * @component
 * @example
 * const props= {
    totalStars: Int,
    starsFilled: Int,
    label: String,
 * }
 * return (
 *   <Rating {...props}/>
 * )
 */
const Rating = ({
    label,
    totalStars,
    starsFilled,
}) => {
    const className = classNames({
        'consonant-RatingInfobit': true,
        'consonant-RatingInfobit--negMargin': !label,
    });

    const ratingToDisplay = getRating(starsFilled, totalStars);

    return (
        <div
            className={className}
            data-stars={totalStars}>
            <span
                data-testid="consonant-RatingInfobit-stars"
                className="consonant-RatingInfobit-stars"
                data-rating={ratingToDisplay} />
            {label &&
            <span
                className="consonant-RatingInfobit-text">
                {label}
            </span>
            }
        </div>
    );
};

Rating.propTypes = ratingType;
Rating.defaultProps = defaultProps;

export default Rating;
