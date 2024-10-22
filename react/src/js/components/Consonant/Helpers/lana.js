export const loadLana = (options = {}) => {
    if (window.lana) return;

    const lanaError = (e) => {
        if (window.lana && window.lana.logImpl) {
            window.lana.logImpl(e.reason || e.error || e.message, { errorType: 'i' });
        }
    };

    let lanaLoaded = false;

    window.lana = {
        logImpl: (...args) => {
            console.log('Lana not yet loaded, logging to console:', ...args);
        },
        log: async (...args) => {
            if (!lanaLoaded) {
                window.removeEventListener('error', lanaError);
                window.removeEventListener('unhandledrejection', lanaError);
                try {
                    // eslint-disable-next-line import/no-unresolved, import/extensions
                    await fetch('www.caas.com/libs/utils/lana.js');
                    lanaLoaded = true;
                } catch (error) {
                    console.error('Failed to load Lana:', error);
                }
            }
            return window.lana.logImpl(...args);
        },
        debug: false,
        options,
    };
    window.addEventListener('error', lanaError);
    window.addEventListener('unhandledrejection', lanaError);
};

export const logLana = ({
    message, tags, e = '', sampleRate = 1,
} = {}) => {
    const msg = `${message} | referer: ${window.location.href} | ${e.reason || e.error || e.message || e}`;
    if (window.lana && typeof window.lana.log === 'function') {
        window.lana.log(msg, {
            clientId: 'chimera',
            sampleRate,
            tags,
        });
    }
};
