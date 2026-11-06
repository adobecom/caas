/* Repo-local authoring demo. The production Milo configurator is a separate integration. */
(() => {
    const checkbox = document.getElementById('c2');
    const style = document.getElementById('style');
    const status = document.getElementById('status');
    const output = document.getElementById('config');
    const preview = document.getElementById('preview');
    const storageKey = 'caas-c2-poc';
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (_) { /* optional */ }
    checkbox.checked = saved.presentation === 'c2';
    style.value = ['1:2', 'text-card'].includes(saved.cardStyle) ? saved.cardStyle : '1:2';
    let config;
    function update() {
        config = {
            collection: {
                presentation: checkbox.checked ? 'c2' : 'legacy',
                cardStyle: style.value,
                mode: 'light',
                layout: { type: '3up', gutter: '4x', container: '1200MaxWidth' },
                endpoint: new URL('./cards.json', window.location.href).href,
                resultsPerPage: 3,
                totalCardsToShow: 3,
                lazyLoad: false,
                showCardBadges: true,
                button: { style: 'secondary' },
                useOverlayLinks: false,
                i18n: { title: '', cardTitleAccessibilityLevel: '2' },
            },
            filterPanel: { enabled: false },
            search: { enabled: false },
            pagination: { enabled: false },
            bookmarks: { enabled: false },
        };
        status.textContent = !checkbox.checked ? 'Legacy presentation.'
            : style.value === '1:2' ? 'C2 pilot active for this collection.'
                : 'C2 requested, but this style is unsupported: the entire collection stays legacy.';
        output.textContent = JSON.stringify(config.collection, null, 2);
        try { localStorage.setItem(storageKey, JSON.stringify(config.collection)); } catch (_) { /* optional */ }
        new window.ConsonantCardCollection(config, preview);
    }
    checkbox.addEventListener('change', update);
    style.addEventListener('change', update);
    document.getElementById('export').addEventListener('click', () => {
        const url = URL.createObjectURL(new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'caas-c2-poc.json';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    update();
})();
