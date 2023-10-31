export const loadLana = (options = {}) => {
    if (window.lana) return;

    const lanaError = (e) => {
        if (window.lana) {
            window.lana.log(e.reason || e.error || e.message, { errorType: 'i' });
        }
    };

    window.lana = {
        log: async (...args) => {
            window.removeEventListener('error', lanaError);
            window.removeEventListener('unhandledrejection', lanaError);
            // eslint-disable-next-line import/no-unresolved, import/extensions
            await fetch('www.adobe.com/libs/utils/lana.js');
            return window.lana.log(...args);
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
    window.lana.log(msg, {
        clientId: 'chimera',
        sampleRate,
        tags,
    });
};
