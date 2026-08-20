import React from 'react';
import { string } from 'prop-types';

const priceType = {
    term: string,
    price: string.isRequired,
};

const defaultProps = {
    term: '',
};

/**
 * Price Infobit (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    price: String,
    term: String,
 * }
 * return (
 *   <Price {...props}/>
 * )
 */
const Price = ({ price, term }) => (
    <span
        className="consonant-PriceInfobit">
        <strong
            className="consonant-PriceInfobit-price">
            {price}
        </strong>
        <span
            className="consonant-PriceInfobit-term">
            {term}
        </span>
    </span>
);

Price.propTypes = priceType;
Price.defaultProps = defaultProps;

export default Price;
