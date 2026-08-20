import React from 'react';

/**
 * A funtion-placeholder, used to handle cleanups
 * Defined explicitly so react doesn't re-create during re-renders
 * @returns {undefined} - returns undefined
 */
export const noOp = () => {};

/**
 * Creates context for expandable components
 * @returns {Object} - ExpandableContext context object
 */
export const ExpandableContext = React.createContext({ value: null, setValue: noOp });

/**
 * Creates configuration context
 * @returns {Object} - ConfigContext context object
 */
export const ConfigContext = React.createContext({});
