// Simple data hook registry for pluggable request/response handling
const root = (typeof window !== 'undefined') ? window : global;
// Create a shared global namespace so multiple bundles share hooks
const ns = root.CAAS_EXT || (root.CAAS_EXT = {});
if (!ns.dataHooks) ns.dataHooks = new Map();
const { dataHooks } = ns;
export { dataHooks };

export function registerDataHook(key, fn) {
    dataHooks.set(key, fn);
}

export function getDataHook(key, defaultFn) {
    return dataHooks.get(key) || defaultFn;
}
