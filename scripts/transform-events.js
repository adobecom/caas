#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Transform events results.json into Consonant card schema (like mock-json/dexter/events.json)
 * Usage:
 *   node scripts/transform-events.js --in mock-json/results.json --out mock-json/smoke.json
 * Options:
 *   --in    Input file path (default: mock-json/results.json)
 *   --out   Output file path (default: mock-json/smoke.json)
 */

const fs = require('fs');
const path = require('path');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

function getArg(name, def) {
  const i = process.argv.indexOf(name);
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  return def;
}

function asArray(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

function mapTags(tags) {
  // Input: [{ tagId, title, description }]
  // Output: [{ id }]
  return asArray(tags).map(t => ({ id: t.tagId || t.id || String(t) }));
}

function toIsoOrEmpty(v) {
  if (!v) return '';
  try {
    // normalize to ISO if parsable
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  } catch (e) {}
  return String(v);
}

function buildFooter(cardUrl, start, end) {
  return [
    {
      divider: false,
      left: [
        { type: 'bookmark', saveCardIcon: '', unsaveCardIcon: '', cardSaveText: '', unsaveCardText: '' },
        { type: 'date-interval', startTime: start || '', endTime: end || '' },
      ],
      center: [],
      right: [
        { type: 'button', style: '', text: 'View event', href: cardUrl || '' },
      ],
      altCta: [],
    },
  ];
}

function mapCard(item) {
  // Prefer session fields when present
  const id = item.id || item.entityId || item.sessionId || item.sessionCode || String(Math.random()).slice(2);
  const title = item.title || item.sessionTitle || item.name || '';
  const description = item.description || item.summary || '';
  const url = item.cardUrl || item.url || item.sessionUrl || '';
  const start = toIsoOrEmpty(item.sessionStartTime || item.startDate || item.session?.start);
  const end = toIsoOrEmpty(item.sessionEndTime || item.endDate || item.session?.end);

  const backgroundImage = item.backgroundImage || (item.styles && item.styles.backgroundImage) || '';

  const out = {
    id,
    showCard: { from: '', until: '' },
    styles: {
      typeOverride: 'event',
      backgroundImage,
      mnemonic: '',
      icon: 'https://www.adobe.com/content/dam/cc/images/shared/icons/9-nothing.svg',
      iconAlt: '',
    },
    overlays: {
      banner: { backgroundColor: '#EAEAEA', fontColor: '#323232', description: '', icon: '' },
      logo: { src: '' },
      label: { description: '' },
      videoButton: { url: '' },
    },
    tags: mapTags(item.tags || item.labels),
    contentArea: {
      detailText: '',
      title,
      url,
      description,
      dateDetailText: { type: 'date-interval', startTime: start, endTime: end },
    },
    footer: buildFooter(url, start, end),
    search: {
      // Placeholders for additional fields; copy through some known ones if available
      timezone: item.timezone || '',
      venue: item.venue || '',
      venueAddress: item.venueAddress || '',
      venueCity: item.venueCity || '',
      venueState: item.venueState || '',
      venueZipcode: item.venueZipcode || '',
      startDate: start,
      endDate: end,
      creationTime: item.creationTime || '',
      modificationTime: item.modificationTime || '',
      localStartDate: item.localStartDate || '',
      localEndDate: item.localEndDate || '',
      // Preserve speaker/session info to support future modals
      speakers: item.eventSpeakers || [],
      sessionId: item.sessionId || '',
      sessionCode: item.sessionCode || '',
    },
    cardDate: item.cardDate || item.creationTime || '',
    createdDate: item.createdDate || item.creationTime || '',
    modifiedDate: item.modifiedDate || item.modificationTime || '',
    startDate: start,
    endDate: end,
    ctaLink: url,
    overlayLink: url,
    origin: item.origin || '',
  };

  return out;
}

function main() {
  const inPath = getArg('--in', 'mock-json/results.json');
  const outPath = getArg('--out', 'mock-json/smoke.json');

  const input = readJson(inPath);
  const list = input.cards || input.results || input.items || [];

  // Map only items that look like sessions or have basic fields
  const cards = list.map(mapCard);
  const totalCount = input.totalResults || input.total || cards.length;

  const output = { cards, totalCount };
  writeJson(outPath, output);
  console.log(`Wrote ${cards.length} cards to ${outPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error('Transform failed:', e.message);
    process.exit(1);
  }
}

