import cuid from 'cuid';
import React, { Fragment } from 'react';
import {
    oneOfType,
    arrayOf,
    shape,
    func,
    string,
    bool,
    number,
} from 'prop-types';

import Icon from './Type/Icon';
import Text from './Type/Text';
import Price from './Type/Price';
import Button from './Type/Button';
import TextLink from './Type/Link';
import Rating from './Type/Rating';
import Progress from './Type/Progress';
import IconWithText from './Type/IconWithText';
import LinkWithIcon from './Type/LinkWithIcon';
import DateInterval from './Type/DateInterval';
import Bookmark from './Type/Bookmark/Bookmark';
import Gated from './Type/Gated';
import { INFOBIT_TYPE } from '../Helpers/constants';
import { parseToPrimitive } from '../Helpers/general';
import {
    footerLeftType,
    footerCenterType,
    footerRightType,
} from '../types/card';

const groupType = {
    renderList: arrayOf(oneOfType([
        shape(footerLeftType),
        shape(footerRightType),
        shape(footerCenterType),
    ])),
    onFocus: func,
    title: string,
    tabIndex: number,
    renderOverlay: bool,
};

const defaultProps = {
    renderList: [],
    onFocus: () => {},
    title: '',
    tabIndex: 0,
    renderOverlay: false,
};

/**
 * Group of Infobits (shown in 3:2 Card Footer)
 *
 * @component
 * @example
 * const props= {
    renderList: Array,
 * }
 * return (
 *   <Group {...props}/>
 * )
 */
const Group = (props) => {
    const {
        renderList,
        onFocus,
        title,
        tabIndex,
        renderOverlay,
    } = props;

    return (
        <Fragment>
            {renderList.map((infobit) => {
                switch (infobit.type) {
                    case INFOBIT_TYPE.PRICE:
                        return (
                            <Price
                                {...infobit}
                                key={cuid()} />
                        );

                    case INFOBIT_TYPE.BUTTON:
                        return (
                            <Button
                                {...infobit}
                                key={cuid()}
                                onFocus={onFocus}
                                title={title}
                                tabIndex={tabIndex}
                                renderOverlay={renderOverlay} />
                        );

                    case INFOBIT_TYPE.ICON_TEXT:
                        return (
                            <IconWithText
                                {...infobit}
                                tabIndex={tabIndex}
                                key={cuid()} />
                        );

                    case INFOBIT_TYPE.LINK_ICON:
                        return (
                            <LinkWithIcon
                                {...infobit}
                                tabIndex={tabIndex}
                                key={cuid()} />
                        );

                    case INFOBIT_TYPE.TEXT:
                        return (
                            <Text
                                {...infobit}
                                key={cuid()} />
                        );

                    case INFOBIT_TYPE.ICON:
                        return (
                            <Icon
                                {...infobit}
                                key={cuid()} />
                        );

                    case INFOBIT_TYPE.LINK:
                        return (
                            <TextLink
                                {...infobit}
                                tabIndex={tabIndex}
                                key={cuid()}
                                title={title} />
                        );

                    case INFOBIT_TYPE.PROGRESS:
                        return (
                            <Progress
                                {...infobit}
                                key={cuid()} />
                        );

                    case INFOBIT_TYPE.RATING:
                        return (
                            <Rating
                                key={cuid()}
                                label={infobit.label}
                                totalStars={parseToPrimitive(infobit.totalStars)}
                                starsFilled={parseToPrimitive(infobit.starsFilled)} />
                        );

                    case INFOBIT_TYPE.BOOKMARK:
                        return (
                            <Bookmark
                                {...infobit}
                                key={cuid()} />
                        );

                    case INFOBIT_TYPE.DATE:
                        return (
                            <DateInterval
                                {...infobit}
                                key={cuid()} />
                        );

                    case INFOBIT_TYPE.GATED:
                        return (
                            <Gated
                                {...infobit}
                                key={cuid()} />
                        );

                    default: return null;
                }
            })}
        </Fragment>
    );
};

Group.propTypes = groupType;
Group.defaultProps = defaultProps;

export default Group;
