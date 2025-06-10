// Utilities demonstrating new JS syntax features enabled via Babel

// 1. Nullish coalescing (??)
export function testNullish(val) {
  return val ?? 'default';
}

// 2. Logical assignment (||=, &&=, ??=)
export function testLogicalAssign(obj) {
  // default count to 1 if falsy
  obj.count ||= 1;
  return obj.count;
}

// 3. Optional catch binding
export function testOptionalCatch() {
  try {
    throw new Error('error');
  } catch {
    return 'caught';
  }
}

// 4. Numeric separator
export function testNumericSeparator() {
  return 1_000_000;
}

// 5. BigInt literals
export function testBigInt() {
  return 1n + 2n;
}

// 6. Optional chaining
export function testOptionalChaining(obj) {
  return obj?.nested?.value;
}