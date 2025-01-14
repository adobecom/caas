const readBookmarksFromLocalStorage = [
    {
        value: JSON.stringify([1, 2, 3]),
        expectedValue: [1, 2, 3],
    },
    {
        value: JSON.stringify(123),
        expectedValue: [],
    },
];

const truncateString = [
    {
        str: '123456789',
        num: 10,
        expectedValue: '123456789',
    },
    {
        str: '123456789',
        num: 1,
        expectedValue: '1...',
    },
];

const truncateList = [
    {
        limit: -1,
        list: [1, 2, 3],
        // returned array length
        expectedValue: 3,
    },
    {
        limit: 0,
        list: [1, 2, 3],
        // returned array length
        expectedValue: 0,
    },
    {
        limit: 1,
        list: [1, 2, 3],
        // returned array length
        expectedValue: 1,
    },
];

const removeDuplicatesByKey = [
    {
        key: 'id',
        list: [{ id: 1 }, { id: 1 }],
        expectedValue: [{ id: 1 }],
    },
    {
        key: 'id',
        list: [{ id: 1 }, { id: 1 }, { id: 2 }],
        expectedValue: [{ id: 1 }, { id: 2 }],
    },
    {
        key: 'id',
        list: [{ id: 1 }, { id: 2 }],
        expectedValue: [{ id: 1 }, { id: 2 }],
    },
    {
        key: 'randomKey',
        list: [{ randomKey: 1 }, { randomKey: 1 }, { randomKey: 1 }],
        expectedValue: [{ randomKey: 1 }],
    },
];

const isSuperset = [
    {
        superset: new Set([1, 2, 3]),
        subset: new Set([1]),
        expectedValue: true,
    },
    {
        superset: new Set([1, 2, 3]),
        subset: new Set([2, 3]),
        expectedValue: true,
    },
    {
        superset: new Set([1, 2, 3]),
        subset: new Set([2, 3, 4]),
        expectedValue: false,
    },
    {
        superset: new Set([1, 2, 3]),
        subset: new Set([4]),
        expectedValue: false,
    },
];

const intersection = [
    {
        superset: new Set([1, 2, 3]),
        subset: new Set([1]),
        expectedValue: new Set([1]),
    },
    {
        superset: new Set([1, 2, 3]),
        subset: new Set([2, 3]),
        expectedValue: new Set([2, 3]),
    },
    {
        superset: new Set([1, 2, 3]),
        subset: new Set([4]),
        expectedValue: new Set(),
    },
];

const sortByKey = [
    {
        iterable: [{ id: 1 }, { id: 2 }, { id: 1 }],
        keyFunc: ({ id }) => id,
        expectedValue: [{ id: 1 }, { id: 1 }, { id: 2 }],
    },
    {
        iterable: [{ id: 3 }, { id: 1 }, { id: 2 }, { id: 5 }, { id: 4 }],
        keyFunc: ({ id }) => id,
        expectedValue: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    },
    {
        iterable: [{ id: 3 }, { id: 1 }, { id: 2 }, { id: 5 }, { id: 4 }],
        keyFunc: ({ id }) => -id,
        expectedValue: [{ id: 5 }, { id: 4 }, { id: 3 }, { id: 2 }, { id: 1 }],
    },
];

const sanitizeText = [
    {
        text: 'text text',
        expectedValue: 'text text',
    },
    {
        text: ' teXT TExt ',
        expectedValue: 'text text',
    },
    {
        text: 'text javascript:alert(966)',
        expectedValue: 'text javascriptalert966',
    },
    {
        text: '%3Cscript%3Econsole.log%28%27hi%27%29%3C%2Fscript%3E',
        expectedValue: '3cscript3econsole.log2827hi27293c2fscript3e',
    },
];

const mapObject = [
    {
        object: { id: 1, name: 'Some Name', surname: 'Some Surname' },
        func: value => value,
        expectedValue: { id: 1, name: 'Some Name', surname: 'Some Surname' },
    },
    {
        object: { id: 1, name: 'Some Name', surname: 'Some Surname' },
        func: value => `${typeof value} ${value}`,
        expectedValue: {
            id: 'number 1',
            name: 'string Some Name',
            surname: 'string Some Surname',
        },
    },
];

const isObject = [
    {
        val: {},
        expectedValue: true,
    },
    {
        val: 1,
        expectedValue: false,
    },
    {
        val: 'string',
        expectedValue: false,
    },
    {
        val: null,
        expectedValue: false,
    },
    {
        val: NaN,
        expectedValue: false,
    },
    {
        val: undefined,
        expectedValue: false,
    },
    {
        val: [],
        expectedValue: false,
    },
    {
        val: () => {},
        expectedValue: false,
    },
    {
        val: new Date(),
        expectedValue: false,
    },
    {
        val: new Set(),
        expectedValue: false,
    },
    {
        val: new Map(),
        expectedValue: false,
    },
];

const parseToPrimitive = [
    {
        value: 1,
        expectedValue: 1,
    },
    {
        value: '1',
        expectedValue: 1,
    },
    {
        value: 'string',
        expectedValue: 'string',
    },
    {
        value: '[]',
        expectedValue: [],
    },
    {
        value: '{}',
        expectedValue: {},
    },
    {
        value: [
            1,
            '1',
            'string',
            { id: 1 },
            { id: '1' },
            [1, 2, 3],
            ['1', '2', '3'],
            '["1", "2", "3"]',
        ],
        expectedValue: [
            1,
            1,
            'string',
            { id: 1 },
            { id: 1 },
            [1, 2, 3],
            [1, 2, 3],
            [1, 2, 3],
        ],
    },
    {
        value: {
            key1: 1,
            key2: '1',
            key3: 'string',
            key4: { id: 1 },
            key5: { id: '1' },
            key6: [1, 2, 3],
            key7: ['1', '2', '3'],
            key8: '["1", "2", "3"]',
        },
        expectedValue: {
            key1: 1,
            key2: 1,
            key3: 'string',
            key4: { id: 1 },
            key5: { id: 1 },
            key6: [1, 2, 3],
            key7: [1, 2, 3],
            key8: [1, 2, 3],
        },
    },
];

const isNullish = [
    {
        val: undefined,
        expectedValue: true,
    },
    {
        val: null,
        expectedValue: true,
    },
    {
        val: NaN,
        expectedValue: true,
    },
    {
        val: {},
        expectedValue: false,
    },
    {
        val: 1,
        expectedValue: false,
    },
    {
        val: 'string',
        expectedValue: false,
    },
    {
        val: [],
        expectedValue: false,
    },
    {
        val: () => {},
        expectedValue: false,
    },
    {
        val: new Date(),
        expectedValue: false,
    },
    {
        val: new Set(),
        expectedValue: false,
    },
    {
        val: new Map(),
        expectedValue: false,
    },
];

const isAtleastOneFilterSelected = [
    {
        filters: [{ items: { selected: false } }],
        expectedValue: false,
    },
    {
        filters: [{ items: { selected: false } }, { items: { selected: true } }],
        expectedValue: true,
    },
];

const generateRange = [
    {
        startVal: 0,
        end: 5,
        expectedValue: [0, 1, 2, 3, 4, 5],
    },
    {
        startVal: 5,
        end: 0,
        expectedValue: [5, 4, 3, 2, 1, 0],
    },
];

const getPageStartEnd = [
    {
        currentPageNumber: 0,
        pageCount: 0,
        totalPages: 0,
        expectedValue: [1, 0],
    },
    {
        currentPageNumber: 0,
        pageCount: 4,
        totalPages: 4,
        expectedValue: [1, 4],
    },
    {
        currentPageNumber: 4,
        pageCount: 0,
        totalPages: 4,
        expectedValue: [4, 4],
    },
    {
        currentPageNumber: 4,
        pageCount: 4,
        totalPages: 0,
        expectedValue: [1, 0],
    },
    {
        currentPageNumber: -1,
        pageCount: 4,
        totalPages: 4,
        expectedValue: [1, 4],
    },
    {
        currentPageNumber: 4,
        pageCount: -1,
        totalPages: 4,
        expectedValue: [5, 3],
    },
    {
        currentPageNumber: 4,
        pageCount: 4,
        totalPages: -1,
        expectedValue: [1, -1],
    },
];

const getStartNumber = [
    {
        currentPageNumber: 1,
        showItemsPerPage: 0,
        expectedValue: 1,
    },
    {
        currentPageNumber: 2,
        showItemsPerPage: 2,
        expectedValue: 3,
    },
    {
        currentPageNumber: 2,
        showItemsPerPage: 0,
        expectedValue: 1,
    },
];

const getEndNumber = [
    {
        currentPageNumber: 1,
        showItemsPerPage: 1,
        totalResults: 2,
        expectedValue: 1,
    },
    {
        currentPageNumber: 2,
        showItemsPerPage: 2,
        totalResults: 3,
        expectedValue: 3,
    },
];

const template = [
    {
        text: '{first} {second}',
        props: { first: 1, second: 2 },
        expectedValue: '1 2',
    },
    {
        text: '{first} {second}',
        props: { first: 1 },
        expectedValue: '1 {second}',
    },
    {
        text: '{first} {second}',
        props: { third: 1 },
        expectedValue: '{first} {second}',
    },
    {
        text: '{} {}',
        props: {},
        expectedValue: '{} {}',
    },
    {
        text: undefined,
        props: { first: 1 },
        expectedValue: '',
    },
    {
        text: '{first}',
        props: undefined,
        expectedValue: '{first}',
    },
];

const getByPath = [
    {
        object: { a: { b: { c: 123 } } },
        path: 'a.b.c',
        expectedValue: 123,
    },
    {
        object: { a: { b: { c: 123 } } },
        path: 'a.b.c.d',
        defaultValue: 'defaultValue',
        expectedValue: 'defaultValue',
    },
    {
        object: { a: { b: { c: 123 } } },
        defaultValue: 'defaultValue',
        expectedValue: 'defaultValue',
    },
    {
        path: 'a.b.c,d',
        defaultValue: 'defaultValue',
        expectedValue: 'defaultValue',
    },
];

const getSelectedItemsCount = [
    {
        items: [{ selected: true }, { selected: true }, { selected: false }],
        expectedValue: 2,
    },
];

const setByPath = [
    {
        object: { a: { b: { c: 'aaa' } } },
        path: 'a.b.c',
        value: 'bbb',
        expectedValue: { a: { b: { c: 'bbb' } } },
    },
    {
        object: { a: 1 },
        path: 'a.b.c',
        value: 'bbb',
        expectedValue: { a: { b: { c: 'bbb' } } },
    },
    {
        object: { a: 1 },
        path: undefined,
        value: 'bbb',
        expectedValue: { a: 1 },
    },
    {
        object: undefined,
        path: 'a.b.c',
        value: 'bbb',
        expectedValue: undefined,
    },
];

const mergeDeep = [
    {
        firstObj: { a: { b: 123 }, c: undefined },
        secondObj: { a: undefined, c: 100 },
        expectedValue: { a: { b: 123 }, c: 100 },
    },
    {
        firstObj: { a: 1 },
        secondObj: { randomKey: { key: 'asd' } },
        expectedValue: { a: 1, randomKey: { key: 'asd' } },
    },
    {
        firstObj: { a: { b: 1 } },
        secondObj: { randomKey: { key: 'asd' } },
        expectedValue: { a: { b: 1 }, randomKey: { key: 'asd' } },
    },
    {
        firstObj: { a: { b: 1 } },
        secondObj: { a: { c: 1 } },
        expectedValue: { a: { b: 1, c: 1 } },
    },
    {
        firstObj: 123,
        secondObj: { randomKey: { key: 'asd' } },
        expectedValue: 123,
    },
    {
        firstObj: { a: 1 },
        secondObj: 123,
        expectedValue: { a: 1 },
    },
];

const getLinkTarget = [
    {
        domain: 'example.com',
        link: 'http://example.com',
        authoredPageProp: '',
        expectedValue: '_self',
    },
    {
        domain: 'example.com',
        link: 'http://some-url.com',
        authoredPageProp: '',
        expectedValue: '_blank',
    },
    {
        domain: 'example.com',
        link: 'http://some-url.com',
        authoredPageProp: '_self',
        expectedValue: '_self',
    },
];

export default {
    isObject,
    template,
    getByPath,
    setByPath,
    sortByKey,
    mapObject,
    isNullish,
    mergeDeep,
    isSuperset,
    intersection,
    sanitizeText,
    truncateList,
    getEndNumber,
    generateRange,
    getStartNumber,
    truncateString,
    getPageStartEnd,
    parseToPrimitive,
    removeDuplicatesByKey,
    getSelectedItemsCount,
    isAtleastOneFilterSelected,
    readBookmarksFromLocalStorage,
    getLinkTarget,
};
