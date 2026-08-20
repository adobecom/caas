export function isAuthor() {
    return typeof window.Granite !== 'undefined';
}

export function isEditor() {
    // This is wrapped in a try block to catch a DOMException that can be thrown
    // if the page is loaded in a cross domain iframe.
    try {
        return window.parent.location.href.indexOf('/editor.html/') >= 0;
    } catch (e) {
        return false;
    }
}
