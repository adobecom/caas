import React from 'react';
import classNames from 'classnames';

import Group from '../../Infobit/Group';
import { footerType } from '../../types/card';
import { INFOBIT_TYPE } from '../../Helpers/constants';
import { isDateWithinInterval, getCurrentDate, isDateBeforeInterval } from '../../Helpers/general';

const defaultProps = {
    left: [],
    center: [],
    right: [],
    altRight: [],
    divider: false,
    isFluid: false,
    isBlog: false,
};

/**
 * The footer that is displayed for 3:2 cards
 *
 * @component
 * @example
 * const props= {
    divider: Boolean,
    left: Array,
    center: Array,
    right: Array,
    isFluid: Boolean,
 * }
 * return (
 *   <CardFooter {...props}/>
 * )
 */
const CardFooter = (props) => {
    const {
        divider,
        left,
        center,
        right,
        altRight,
        cardDate,
        startDate,
        endDate,
        staticDate,
        isFluid,
        onFocus,
        title,
        tabIndex,
        renderOverlay,
        hideCTA,
        isBlog,
        isFlexCard,
        showDateOnFooter,
    } = props;

    /**
     * Is the card currently live?
     * @type {Boolean}
     */
    const isLive = isDateWithinInterval(getCurrentDate(), startDate, endDate);
    const isUpcoming = isDateBeforeInterval(getCurrentDate(), startDate);

    /**
     * Class name for the card footer:
     * whether the card footer should have a horizontal divider
     * @type {Number}
     */
    const footerClassName = classNames({
        'consonant-CardFooter': true,
        'consonant-CardFooter--divider': divider,
    });

    /**
     * Class name for the card footer row:
     * whether the the card footer row should be fluid or of fixed width
     * @type {Number}
     */
    const rowClassName = classNames({
        'consonant-CardFooter-row': true,
        'consonant-CardFooter-row--fluid': isFluid,
    });

    /**
     * How many groups are displayed in the footer
     * @type {Number}
     */
    const dataCells = left.some(({ type }) => type === INFOBIT_TYPE.DATE) ? 2 : 1;

    /**
     * Whether the left footer infobits should render
     * @type {Boolean}
     */
    const shouldRenderLeft = (left && left.length > 0) || (isBlog && cardDate) || (isFlexCard && showDateOnFooter && cardDate);

    /**
     * Whether the center footer infobits should render
     * @type {Boolean}
     */
    const shouldRenderCenter = center && center.length > 0;

    /**
     * Whether the right footer infobits should render
     * @type {Boolean}
     */
    const shouldRenderRight = right && right.length > 0 &&
        (!isLive || altRight.length === 0) && (!isUpcoming || altRight.length === 0);

    /**
     * Whether an alternate right footer infobits should render for upcoming
     * @type {Boolean}
     */
    const shouldRenderAltRightUpcoming = altRight && altRight.length > 0 && isUpcoming;

    /**
     * Whether an alternate right footer infobets should render for live events
     */
    const shouldRenderAltRightLive = altRight && altRight.length > 0 && isLive;

    /**
     * This is some franken logic to make one alt cta space work for two different card states
     */
    const altRightUpcoming = []; // isUpcoming
    const altRightLive = []; // isLive
    /* istanbul ignore if */
    if (altRight && altRight.length > 0 && right && right.length > 0) {
        const upcoming = {
            href: right[0].href,
            text: altRight[0].text,
            type: right[0].type,
        };
        const live = {
            href: altRight[0].href,
            text: right[0].text,
            type: altRight[0].type,
        };
        altRightUpcoming.push(upcoming);
        altRightLive.push(live);
    }

    // Format date for flex card mm/dd/yyyy
    const formattedFlexCardDate = () => {
        const date = new Date(cardDate);
        if (date) {
            return `${String(date.getMonth() + 1)}/${String(date.getDate())}/${date.getFullYear()}`;
        }
        return '';
    }

    // Format date for blog card mm-dd-yyyy
    const formattedBlogCardDate = () => {
        const date = new Date(cardDate);
        if (date) {
            // Remove timezone by constructing a new Date from the date components only (local)
            const dateObj = typeof cardDate === 'string'
                ? new Date(cardDate.slice(0, 10)) // e.g. '2023-05-01T12:00:00Z' => '2023-05-01'
                : new Date(cardDate.getFullYear(), cardDate.getMonth(), cardDate.getDate());
            return `${String(dateObj.getMonth() + 1)
                .padStart(2, '0')}-${String(dateObj.getDate())
                .padStart(2, '0')}-${dateObj.getFullYear()}`;
        }
        return '';
    }
    
    return (
        <div
            className={footerClassName}
            data-testid="consonant-Card-footer">
            <div
                className={rowClassName}
                data-cells={dataCells}>
                {shouldRenderLeft &&
                <div
                    className="consonant-CardFooter-cell consonant-CardFooter-cell--left">
                    {isBlog && <span>{formattedBlogCardDate()}</span>}
                    {isFlexCard && showDateOnFooter && !endDate&& <span>{formattedFlexCardDate()}</span>}
                    <Group renderList={left} onFocus={onFocus} />
                </div>
                }
                {shouldRenderCenter && !hideCTA &&
                <div
                    className="consonant-CardFooter-cell consonant-CardFooter-cell--center">
                    <Group renderList={center} tabIndex={tabIndex} onFocus={onFocus} />
                </div>
                }
                {shouldRenderRight && !hideCTA &&
                <div
                    className="consonant-CardFooter-cell consonant-CardFooter-cell--right">
                    <Group
                        renderList={right}
                        onFocus={onFocus}
                        title={title}
                        tabIndex={tabIndex}
                        renderOverlay={renderOverlay}/>
                </div>
                }
                {shouldRenderAltRightUpcoming &&
                <div
                    className="consonant-CardFooter-cell consonant-CardFooter-cell--right">
                    <Group renderList={altRightUpcoming} onFocus={onFocus} title={title} />
                </div>
                }
                {shouldRenderAltRightLive &&
                <div
                    className="consonant-CardFooter-cell consonant-CardFooter-cell--right">
                    <Group renderList={altRightLive} onFocus={onFocus} title={title} />
                </div>
                }
            </div>
        </div>
    );
};

CardFooter.propTypes = footerType;
CardFooter.defaultProps = defaultProps;

export default CardFooter;
