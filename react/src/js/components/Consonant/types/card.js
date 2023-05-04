import {
    string,
    oneOfType,
    arrayOf,
    shape,
    number,
    bool,
    array,
} from 'prop-types';

const appliesToType = {
    id: string,
};

const showCardType = {
    from: string,
    until: string,
};

export const tagsType = {
    id: oneOfType([string, number]),
};
const searchType = {};

export const footerLeftType = {
    src: string,
    type: string,
    term: string,
    text: string,
    label: string,
    price: string,
    color: string,
    linkHint: string,
    percentage: string,
    openInNewTab: bool,
    srcAltText: string,
    totalStars: number,
    starsFilled: number,
    saveCardIcon: string,
    cardSaveText: string,
    unsaveCardIcon: string,
    cardUnsaveText: string,
    completionText: string,
};

export const footerCenterType = {
    src: string,
    type: string,
    href: string,
    text: oneOfType([string, number]),
};

export const footerRightType = {
    src: string,
    type: string,
    style: string,
    endTime: string,
    startTime: string,
    text: oneOfType([string, number]),
};

const overlaysBannerType = {
    icon: string,
    fontColor: string,
    description: oneOfType([string, array]),
    backgroundColor: string,
};

const overlaysLogoType = {
    src: string,
    alt: string,
    borderColor: string,
    backgroundColor: string,
};

const overlaysLabelType = {
    description: oneOfType([string, array]),
};

const overlaysVideoButtonType = {
    url: string,
};

export const stylesType = {
    typeOverride: string,
    backgroundImage: string,
};

export const contentAreaType = {
    detailText: string,
    title: oneOfType([string, array]),
    description: oneOfType([string, array]),
    dateDetailText: shape({
        endTime: string,
        startTime: string,
    }),
};

export const overlaysType = {
    logo: shape(overlaysLogoType),
    label: shape(overlaysLabelType),
    banner: shape(overlaysBannerType),
    videoButton: shape(overlaysVideoButtonType),
};

export const footerType = {
    divider: bool,
    isFluid: bool,
    left: arrayOf(shape(footerLeftType)),
    right: arrayOf(shape(footerRightType)),
    center: arrayOf(shape(footerCenterType)),
};

export const cardType = {
    id: string,
    title: string,
    cardDate: string,
    styles: shape(stylesType),
    search: shape(searchType),
    showCard: shape(showCardType),
    overlays: shape(overlaysType),
    tags: arrayOf(shape(tagsType)),
    footer: arrayOf(shape(footerType)),
    contentArea: shape(contentAreaType),
    appliesTo: arrayOf(shape(appliesToType)),
};

export const offer = {
    id: string,
    selectorId: string,
};
