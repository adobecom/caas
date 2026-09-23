/** @jest-environment node */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const source = fs.readFileSync(path.join(__dirname, '../polyfills.js'), 'utf8');

test('installs a non-enumerable globalThis alias before app code in older browsers', () => {
    const context = vm.createContext({});
    vm.runInContext('this.self = this; delete this.globalThis;', context);
    vm.runInContext(source, context);
    expect(vm.runInContext('globalThis === self', context)).toBe(true);
    expect(vm.runInContext("Object.getOwnPropertyDescriptor(self, 'globalThis').enumerable", context)).toBe(false);
    vm.runInContext('globalThis.lana = { ready: true };', context);
    expect(vm.runInContext('self.lana.ready', context)).toBe(true);
});

test('preserves the native globalThis property', () => {
    const native = {};
    const context = vm.createContext({ globalThis: native, self: {} });
    vm.runInContext(source, context);
    expect(context.globalThis).toBe(native);
    expect(context.self).not.toHaveProperty('globalThis');
});

test('does nothing when neither a globalThis nor a browser global exists', () => {
    const context = vm.createContext({});
    vm.runInContext('delete this.globalThis;', context);
    expect(() => vm.runInContext(source, context)).not.toThrow();
    expect(vm.runInContext('typeof globalThis', context)).toBe('undefined');
});
