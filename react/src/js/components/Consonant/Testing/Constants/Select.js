export const options = [
    { label: 'label 1' },
    { label: 'label 2' },
    { label: 'label 3' },
    { label: 'label 4' },
    { label: 'label 5' },
];

export const DEFAULT_PROPS = {
    val: {},
    id: 'select-id',
    opened: false,
    values: options,
    autoWidth: false,

    onOpen: jest.fn(),
    onSelect: jest.fn(),
};
