/** Saved identifiers describe legacy layouts, not the media's aspect ratio. */
export const CARD_LAYOUT_ALIASES = {
    '1:2': 'one-half',
    'one-half': 'one-half',
};

/** C2 terminology and media geometry live here, independently of persisted IDs. */
export const C2_CARD_PRESENTATIONS = {
    'one-half': {
        name: 'media',
        mediaAspectRatio: '16:9',
    },
};

/** Unsupported/mixed collections deliberately retain their entire legacy presentation. */
export const getC2Presentation = (collection = {}) => {
    const { presentation, cardStyle, mode = '', layout = {} } = collection;
    const canonicalLayout = CARD_LAYOUT_ALIASES[cardStyle];
    const supported = presentation === 'c2'
        && ['', 'light', 'lightest'].includes(mode)
        && (layout.type || '3up') === '3up'
        && ['', '32Margin', '83Percent', '1200MaxWidth', '1600MaxWidth'].includes(layout.container || '');
    return supported && canonicalLayout ? C2_CARD_PRESENTATIONS[canonicalLayout] : null;
};

export const isC2Presentation = collection => Boolean(getC2Presentation(collection));
