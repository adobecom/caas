// Optional component override registry to enable full swaps of core components
const root = (typeof window !== 'undefined') ? window : global;
const ns = root.CAAS_EXT || (root.CAAS_EXT = {});
if (!ns.overrides) ns.overrides = new Map();
const { overrides } = ns;
export { overrides };

export function registerComponentOverride(key, Component) {
    overrides.set(key, Component);
}

export function getComponent(key, Default) {
    return overrides.get(key) || Default;
}
