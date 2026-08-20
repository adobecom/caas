
import { filterPanel } from '../Mocks/config.json';

const { clearFilterText, filters } = filterPanel;
const [{
    id,
    group,
    icon,
    items,
}] = filters;

export const DEFAULT_PROPS = {
    id,
    icon,
    items,
    clearFilterText,

    key: id,
    results: 0, // filtered cards count
    name: group,
    isOpened: false,
    numItemsSelected: 0,

    onCheck: jest.fn(),
    onClick: jest.fn(),
    onClearAll: jest.fn(),
};

export const selectedAllItems = {
    numItemsSelected: DEFAULT_PROPS.items.length,
    items: DEFAULT_PROPS.items.map(item => ({ ...item, selected: true })),
};

export const ANALYTICS_ITEMS = {
    leftFilter: [
        'First Tag Group Label',
    ],
    'leftFilter-name': [
        'First Tag Group Label Open',
    ],
    itemsItem: [
        'Tag 1 Label',
        'Tag 2 Label',
        'Tag 3 Label',
        'Tag 4 Label',
        'Tag 5 Label',
        'Tag 6 Label',
        'Tag 7 Label',
        'Tag 8 Label',
        'Tag 9 Label',
        'Tag 10 Label',
    ],
};
