import { removeEmptyFilters } from '../Container';
import { EVENT_TIMING_IDS, DESKTOP_MIN_WIDTH } from '../../Helpers/constants';

describe('removeEmptyFilters util', () => {
  const sampleFilters = [
    {
      group: 'group1',
      openedOnLoad: false,
      items: [
        { id: 'a', label: 'ItemA' },
        { id: 'b', label: 'ItemB' },
      ],
    },
    {
      group: 'group2',
      openedOnLoad: true,
      items: [
        { id: 'c', label: 'ItemC' },
      ],
    },
  ];
  const sampleCards = [
    { tags: [{ id: 'a', label: 'ItemA' }] },
    { tags: [{ id: 'x', label: 'ItemX' }] },
  ];

  beforeEach(() => {
    // default window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: DESKTOP_MIN_WIDTH + 1,
    });
  });

  it('removes filters with no matching items', () => {
    const result = removeEmptyFilters(sampleFilters, sampleCards);
    expect(result).toHaveLength(1);
    expect(result[0].group).toBe('group1');
    expect(result[0].items).toEqual([{ id: 'a', label: 'ItemA' }]);
  });

  it('sets opened based on DESKTOP_SCREEN_SIZE and openedOnLoad', () => {
    // desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: DESKTOP_MIN_WIDTH + 1,
    });
    let result = removeEmptyFilters(sampleFilters, sampleCards);
    expect(result[0].opened).toBe(false);

    // mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: DESKTOP_MIN_WIDTH - 1,
    });
    result = removeEmptyFilters(sampleFilters, sampleCards);
    expect(result[0].opened).toBe(true);
  });
});