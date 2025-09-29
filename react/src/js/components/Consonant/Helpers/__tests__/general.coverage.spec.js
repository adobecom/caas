import {
  truncateString,
  truncateList,
  removeDuplicatesByKey,
  chain,
  chainFromIterable,
  isSuperset,
  intersection,
  sortByKey,
  sanitizeText,
  mapObject,
  isObject,
  parseToPrimitive,
  isNullish,
  generateRange,
  getPageStartEnd,
  getStartNumber,
  getEndNumber,
  template,
  getByPath,
  getSelectedItemsCount,
  debounce,
  setByPath,
  mergeDeep,
  qs,
  isDateWithinInterval,
  isDateBeforeInterval,
  getSearchParam,
  sanitizeEventFilter,
  removeMarkDown,
} from '../general';

describe('general helpers coverage', () => {
  it('basic utilities', () => {
    expect(truncateString('abc', 5)).toBe('abc');
    expect(truncateString('abcdef', 3)).toBe('abc...');
    expect(truncateList(-1, [1,2,3])).toEqual([1,2,3]);
    expect(truncateList(2, [1,2,3])).toEqual([1,2]);

    const dedup = removeDuplicatesByKey([{id:1},{id:2},{id:1}], 'id');
    expect(dedup.length).toBe(2);

    expect(chain([1],[2],[3])).toEqual([1,2,3]);
    expect(chainFromIterable([[1,2],[3]])).toEqual([1,2,3]);

    expect(isSuperset(new Set([1,2,3]), new Set([2]))).toBe(true);
    expect([...intersection(new Set([1,2]), new Set([2,3]))]).toEqual([2]);

    expect(sortByKey([3,1,2], x=>x)).toEqual([1,2,3]);
    expect(sanitizeText('  Hello!@# ')).toBe('hello');

    expect(mapObject({a:1,b:2}, v=>v*2)).toEqual({a:2,b:4});
    expect(isObject({})).toBe(true);

    expect(parseToPrimitive('1')).toBe(1);
    expect(parseToPrimitive(['1','2'])).toEqual([1,2]);
    expect(parseToPrimitive({ a: '1', b: ['2'] })).toEqual({ a: 1, b: [2] });

    expect(isNullish(null)).toBe(true);

    expect(generateRange(1,3)).toEqual([1,2,3]);
    expect(generateRange(3,1)).toEqual([3,2,1]);

    expect(getPageStartEnd(5, 5, 4)).toEqual([1,4]);
    const [s,e] = getPageStartEnd(5, 5, 20);
    expect(s).toBeGreaterThan(0);
    expect(e).toBeGreaterThan(s);

    expect(getStartNumber(1, 10)).toBe(1);
    expect(getStartNumber(2, 10)).toBe(11);
    expect(getEndNumber(2, 10, 18)).toBe(18);
    expect(getEndNumber(2, 10, 25)).toBe(20);

    expect(template('Hi {name}', { name: 'Ada' })).toBe('Hi Ada');
    expect(getByPath({a:{b:2}}, 'a.b', 0)).toBe(2);
    expect(getByPath(null, 'a', 5)).toBe(5);

    expect(getSelectedItemsCount([{selected:true},{selected:false}])).toBe(1);

    jest.useFakeTimers();
    const fn = jest.fn();
    const deb = debounce(fn, 10);
    deb('x');
    jest.advanceTimersByTime(11);
    expect(fn).toHaveBeenCalledWith('x');
    jest.useRealTimers();

    const obj = {};
    setByPath(obj, 'a.b.c', 3);
    expect(obj).toEqual({ a: { b: { c: 3 } } });

    const merged = mergeDeep({a:{x:1}}, {a:{y:2}}, {b:3});
    expect(merged).toEqual({ a: { x:1, y:2 }, b:3 });

    expect(qs.parse('ch_a=1&x=2')).toEqual({ ch_a: '1', x: ['2'] });
    expect(qs.stringify({ ch_a: ['1','2'], x: '3' }, { array:'comma' })).toContain('ch_a');

    const now = new Date().toISOString();
    const later = new Date(Date.now()+1000).toISOString();
    expect(isDateWithinInterval(now, now, later)).toBe(true);
    expect(isDateBeforeInterval(now, later)).toBe(true);

    expect(getSearchParam('https://x.test?y=1', 'y')).toBe('1');
    expect(getSearchParam('', 'y')).toBeNull();

    expect(sanitizeEventFilter('all')).toEqual([]);
    expect(sanitizeEventFilter(['a'])).toEqual(['a']);

    expect(removeMarkDown('<b>{**Hi**}</b>')).toBe('Hi');
  });
});

