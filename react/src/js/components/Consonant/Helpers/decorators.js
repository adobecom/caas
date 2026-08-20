import React from 'react';
import { parseToPrimitive } from './general';

/* eslint-disable react/prop-types  */
/* eslint-disable import/prefer-default-export  */
export const parseDataConfig = Component => ({ dataConfig }) => {
    const config = parseToPrimitive(dataConfig);

    return <Component config={config} />;
};
