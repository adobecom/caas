/**
 * Card Content
 * Generates the content section of the card. it may include any combination of these elements:
 * - DetailsText
 * - Title
 * - Description
 */
import React from 'react';
import { string, bool, func, number, node } from 'prop-types';
import { removeMarkDown } from '../../Helpers/general';

const CardContent = ({
    showLabel,
    detailText,
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
        {showIconAlt && (detailText === '') &&
        <span
            data-testid="consonant-Card-label"
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
    showTitle: true,
};

export default CardContent;
