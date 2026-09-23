export const loadLana = (options = {}) => {
    if (globalThis.lana) return;

    const lanaError = (e) => {
        if (globalThis.lana && globalThis.lana.logImpl) {
            globalThis.lana.logImpl(e.reason || e.error || e.message, { errorType: 'i' });
        }
    };

    let lanaLoaded = false;

    globalThis.lana = {
        logImpl: (...args) => {
            console.log('Lana not yet loaded, logging to console:', ...args);
        },
        log: async (...args) => {
            if (!lanaLoaded) {
                globalThis.removeEventListener('error', lanaError);
                globalThis.removeEventListener('unhandledrejection', lanaError);
                try {
                    // eslint-disable-next-line import/no-unresolved, import/extensions
                    await fetch('www.caas.com/libs/utils/lana.js');
                    lanaLoaded = true;
                } catch (error) {
                    console.error('Failed to load Lana:', error);
                }
            }
            return globalThis.lana.logImpl(...args);
        },
        debug: false,
        options,
    };
    globalThis.addEventListener('error', lanaError);
    globalThis.addEventListener('unhandledrejection', lanaError);
};

export const logLana = ({
    message, tags, e = '', sampleRate = 1,
} = {}) => {
    const msg = `${message} | referer: ${globalThis.location.href} | ${e.reason || e.error || e.message || e}`;
    if (globalThis.lana && typeof globalThis.lana.log === 'function') {
        globalThis.lana.log(msg, {
            clientId: 'chimera',
            sampleRate,
            tags,
        });
    }
};
