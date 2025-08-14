import { registerDataHook } from '../extensions/data';
import { makeConfigGetter } from '../components/Consonant/Helpers/consonant';

// Build request: optionally switch to alternate endpoint
registerDataHook('data.buildRequest', (config) => {
    const getCfg = makeConfigGetter(config);
    const events = getCfg('events', '') || {};
    const useAlt = events && events.useAltEndpoint;
    const altEndpoint = events && events.altEndpoint;

    let endpoint = getCfg('collection', 'endpoint');
    if (useAlt && altEndpoint) endpoint = altEndpoint;

    const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    const url = r.test(endpoint)
        ? new URL(endpoint)
        : new URL(endpoint, window.location.origin);
    return { url: url.toString(), options: { credentials: 'include' } };
});

// Map response: normalize to { cards, totalCount } when events.enabled
registerDataHook('data.mapResponse', (json, config) => {
    const getCfg = makeConfigGetter(config);
    const events = getCfg('events', '') || {};
    if (!events || !events.enabled) return json;

    const toCard = item => ({
        id: item.entityId || item.id,
        tags: (item.labels || item.tags || [])
            .map(l => ({ id: l.id || l, title: l.name || String(l) })),
        contentArea: {
            title: item.title || item.name,
            description: item.summary || item.description || '',
            dateTetailText: item.dateDetail || '',
            detailText: item.detailText || '',
        },
        overlays: {
            banner: { description: item.bannerText || '' },
        },
        startDate: item.session && item.session.start,
        endDate: item.session && item.session.end,
    });

    const results = json.results || json.items || [];
    return {
        cards: results.map(toCard),
        totalCount: json.total || results.length,
    };
});
