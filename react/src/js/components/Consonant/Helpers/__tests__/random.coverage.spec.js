import {
  getRandomSort,
  getFeaturedCards,
  getUpdatedCardBookmarkData,
  getCollectionCards,
  getActivePanels,
  shouldDisplayPaginator,
  getTotalPages,
  sanitizeStr,
} from '../Helpers';

describe('random and misc helpers coverage', () => {
  const cards = Array.from({ length: 5 }).map((_, i) => ({ id: String(i+1) }));

  it('getRandomSort caches and returns deterministic when Math.random=0', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const sample1 = getRandomSort(cards, 'list1', 2, 5);
    expect(sample1.length).toBe(2);
    const sample2 = getRandomSort(cards, 'list1', 2, 5);
    expect(sample2).toBe(sample1); // from cache
    spy.mockRestore();
  });

  it('getFeaturedCards marks featured deep copies', () => {
    const res = getFeaturedCards(['1','3'], cards);
    expect(res.map(c => c.isFeatured)).toEqual([true, true]);
    expect(res[0]).not.toBe(cards[0]);
  });

  it('getUpdatedCardBookmarkData toggles bookmark flag', () => {
    const updated = getUpdatedCardBookmarkData([{ id: 'a' }, { id: 'b' }], ['b']);
    expect(updated).toEqual([{ id: 'a', isBookmarked: false }, { id: 'b', isBookmarked: true }]);
  });

  it('getCollectionCards picks bookmarked when flag true', () => {
    const res = getCollectionCards(true, [1], [1,2]);
    expect(res).toEqual([1]);
  });

  it('getActivePanels extracts panel ids', () => {
    const set = getActivePanels(['a/b', 'c/d']);
    expect(set.has('a')).toBe(true);
    expect(set.has('c')).toBe(true);
  });

  it('shouldDisplayPaginator handles simple falsey cases', () => {
    expect(shouldDisplayPaginator(true, 0, 100)).toBe(false);
    expect(shouldDisplayPaginator(true, 10, 5)).toBe(true);
  });

  it('getTotalPages returns 0 when perPage is 0', () => {
    expect(getTotalPages(0, 10)).toBe(0);
  });

  it('sanitizeStr replaces common entities', () => {
    expect(sanitizeStr('&amp;&lt;&gt;')).toBe('&<>');
  });
});

