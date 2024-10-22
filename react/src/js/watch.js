// watch.js
/**
 *
 * @param {Class} registry The React DOM Component Registry
 */
export const watch = (registry) => {
    // Ensure registry.element is a valid Node
    const body = registry.element instanceof Node ? registry.element : document.querySelector('body');

    const config = {
        childList: true,
        subtree: true,
    };

    const callback = (mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.addedNodes.length === 1) {
                const { addedNodes } = mutation;
                addedNodes.forEach((addedNode) => {
                    if (addedNode.nodeType === 1) {
                        registry.init(addedNode);
                    }
                });
            }
        });
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    observer.observe(body, config);
};

/**
 *
 * @param {Class} registry The React DOM Component Registry
 */
export const authorWatch = (registry) => {
    if (global.CQ) {
        watch(registry);
    }
};
