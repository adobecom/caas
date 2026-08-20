import React, {
    useMemo,
    useState,
    useCallback,
} from 'react';
import {
    node,
    shape,
} from 'prop-types';

import { configType } from '../../types/config';
import {
    ConfigContext,
    ExpandableContext,
} from '../../Helpers/contexts';

const ContextProvider = ({ context, children }) => {
    const [isOpen, toggle] = useState(null);

    const handleChangeVisibility = useCallback(
        (value) => {
            toggle(value);
        },
        [toggle],
    );

    const expandableContext = useMemo(
        () => ({
            value: isOpen,
            setValue: handleChangeVisibility,
        }),
        [isOpen, handleChangeVisibility],
    );

    return (
        <ExpandableContext.Provider value={expandableContext}>
            <ConfigContext.Provider value={context}>
                {children}
            </ConfigContext.Provider>
        </ExpandableContext.Provider>
    );
};

ContextProvider.propTypes = {
    context: shape(configType),
    children: node.isRequired,
};

ContextProvider.defaultProps = {
    context: {},
};

export default ContextProvider;
