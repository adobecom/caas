/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { string, object } from 'prop-types';
// Slot registry to allow injecting UI components into predefined locations
const root = (typeof window !== 'undefined') ? window : global;
const ns = root.CAAS_EXT || (root.CAAS_EXT = {});
if (!ns.slots) ns.slots = new Map();
const { slots } = ns;
export { slots };

const SLOT_EVENT = 'CAAS_SLOTS_UPDATED';

export function registerSlot(slotId, Component) {
    if (!slots.has(slotId)) slots.set(slotId, []);
    slots.get(slotId).push(Component);
    if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent(SLOT_EVENT, { detail: { slotId } }));
    }
}

export function getSlotComponents(slotId) {
    return slots.get(slotId) || [];
}

export function SlotRenderer({ slotId, slotProps }) {
    const [, setTick] = useState(0);
    useEffect(() => {
        const handler = (e) => {
            if (!e || !e.detail) { setTick(t => t + 1); return; }
            if (!slotId || e.detail.slotId === slotId) setTick(t => t + 1);
        };
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener(SLOT_EVENT, handler);
        }
        return () => {
            if (typeof window !== 'undefined' && window.removeEventListener) {
                window.removeEventListener(SLOT_EVENT, handler);
            }
        };
    }, [slotId]);

    const list = getSlotComponents(slotId);
    if (!list.length) return null;
    return (
        <React.Fragment>
            {list.map((Comp, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Comp key={`${slotId}-${i}`} {...slotProps} />
            ))}
        </React.Fragment>
    );
}

SlotRenderer.propTypes = {
    slotId: string.isRequired,
    slotProps: object, // eslint-disable-line react/forbid-prop-types
};

SlotRenderer.defaultProps = {
    slotProps: {},
};
