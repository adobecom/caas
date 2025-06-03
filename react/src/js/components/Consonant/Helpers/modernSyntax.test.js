import {
  testNullish,
  testLogicalAssign,
  testOptionalCatch,
  testNumericSeparator,
  testBigInt,
  testOptionalChaining,
} from './modernSyntax';

describe('modernSyntax utilities', () => {
  test('testNullish falls back only on null/undefined', () => {
    expect(testNullish(undefined)).toBe('default');
    expect(testNullish(null)).toBe('default');
    expect(testNullish(0)).toBe(0);
    expect(testNullish(false)).toBe(false);
    expect(testNullish('')).toBe('');
    expect(testNullish('value')).toBe('value');
  });

  test('testLogicalAssign defaults count to 1 when falsy', () => {
    const a = {};
    expect(testLogicalAssign(a)).toBe(1);
    expect(a.count).toBe(1);
    const b = { count: 0 };
    expect(testLogicalAssign(b)).toBe(1);
    expect(b.count).toBe(1);
    const c = { count: 5 };
    expect(testLogicalAssign(c)).toBe(5);
    expect(c.count).toBe(5);
  });

  test('testOptionalCatch returns caught', () => {
    expect(testOptionalCatch()).toBe('caught');
  });

  test('testNumericSeparator returns correct number', () => {
    expect(testNumericSeparator()).toBe(1000000);
  });

  test('testBigInt returns correct BigInt arithmetic', () => {
    expect(testBigInt()).toBe(3n);
    expect(typeof testBigInt()).toBe('bigint');
  });

  test('testOptionalChaining returns nested value or undefined', () => {
    expect(testOptionalChaining(undefined)).toBeUndefined();
    expect(testOptionalChaining({})).toBeUndefined();
    expect(testOptionalChaining({ nested: {} })).toBeUndefined();
    expect(testOptionalChaining({ nested: { value: 42 } })).toBe(42);
  });
});