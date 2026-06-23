/**
 * Card Content
 * Generates the content section of the card. it may include any combination of these elements:
 * - DetailsText
 * - Title
 * - Description
 */
import React from 'react';
import { string, bool, func, number, node, shape } from 'prop-types';
import { removeMarkDown } from '../../Helpers/general';
import { productInfoType } from '../../types/card';

const CardContent = ({
    showLabel,
    detailText,
    productInfo,
    showIconAlt,
    iconAlt,
    isTitleOnly,
    highlightedTitle,
    title,
    headingAria,
    headingLevel,
    parseMarkDown,
    showText,
    highlightedDescription,
    description,
    showTitle,
}) => (
    <>
        {showLabel && detailText &&
        <span
            data-testid="consonant-Card-label"
            className="consonant-Card-label">
            {detailText}
        </span>
        }
        {productInfo && (
            <span
                data-testid="consonant-Card-label-product-info"
                className="consonant-Card-label product-info">
                {productInfo.tagImage && (
                    <img className="product-info-icon" src={productInfo.tagImage} alt={productInfo.title || ''} />
                )}
                <span className="product-info-title">{productInfo.title || ''}</span>
            </span>
        )}
        {showIconAlt && (detailText === '') &&
        <span
            data-testid="consonant-Card-label-icon-alt"
            className="consonant-Card-label">
            {iconAlt}
        </span>
        }
        { (showTitle && isTitleOnly && highlightedTitle) &&
            <p
                data-testid="consonant-Card-title"
                className="consonant-Card-title">
                {highlightedTitle}
            </p>
        }
        { (showTitle && isTitleOnly && !highlightedTitle) &&
            <p
                data-testid="consonant-Card-title"
                className="consonant-Card-title"
                title={removeMarkDown(title)}
                dangerouslySetInnerHTML={{ __html: parseMarkDown(title) }} />
        }
        { (showTitle && !isTitleOnly && highlightedTitle) &&
            <p
                role="heading"
                {...(headingAria && { 'aria-label': headingAria })}
                aria-level={headingLevel}
                data-testid="consonant-Card-title"
                className="consonant-Card-title"
                title={removeMarkDown(title)}>
                {highlightedTitle}
            </p>
        }
        { (showTitle && !isTitleOnly && !highlightedTitle) &&
            <p
                role="heading"
                {...(headingAria && { 'aria-label': headingAria })}
                aria-level={headingLevel}
                data-testid="consonant-Card-title"
                className="consonant-Card-title"
                title={removeMarkDown(title)}
                dangerouslySetInnerHTML={{ __html: parseMarkDown(title) }} />
        }
        { showText && (
            highlightedDescription ? (
                <p
                    data-testid="consonant-Card-text"
                    className="consonant-Card-text">
                    {highlightedDescription}
                </p>
            ) : (
                description && (
                    <p
                        data-testid="consonant-Card-text"
                        className="consonant-Card-text"
                        dangerouslySetInnerHTML={{ __html: parseMarkDown(description) }} />
                )
            )
        ) }
    </>
);

CardContent.propTypes = {
    showLabel: bool,
    detailText: string,
    showIconAlt: bool,
    iconAlt: string,
    isTitleOnly: bool,
    highlightedTitle: node,
    title: string,
    headingAria: string,
    headingLevel: number,
    parseMarkDown: func,
    showText: bool,
    highlightedDescription: node,
    description: string,
    productInfo: shape(productInfoType),
    showTitle: bool,
};

CardContent.defaultProps = {
    showLabel: false,
    detailText: '',
    showIconAlt: false,
    iconAlt: '',
    isTitleOnly: false,
    highlightedTitle: null,
    title: '',
    headingAria: '',
    headingLevel: 3,
    parseMarkDown: undefined,
    showText: false,
    highlightedDescription: null,
    description: '',
    productInfo: null,
    showTitle: true,
};

export default CardContent;
