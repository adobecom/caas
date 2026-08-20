export default ({ onLoadDelay }) => {
    let timeout = null;

    const properties = {
        enumerable: true,
        configurable: true,
        get() {
            return this.onload;
        },
        set(callback = () => {}) {
            clearTimeout(timeout);
            /**
             * if onLoadDelay exists
             * then simulate image onload with delay
             * else simulate image onload without delay
             */
            if (onLoadDelay) {
                timeout = setTimeout(() => {
                    callback();
                }, onLoadDelay);
            } else {
                callback();
            }
        },

    };
    Object.defineProperty(Image.prototype, 'onload', properties);
};
