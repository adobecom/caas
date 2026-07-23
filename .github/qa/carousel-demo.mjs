import { chromium } from 'playwright';
const URL = 'http://localhost:8899/index.html';
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
await p.addInitScript(() => { window._qa = { config: { collection: { layout: { container: 'carousel' } } } }; });
await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
await p.waitForSelector('.consonant-Card', { timeout: 12000 });
const track = await p.$('.consonant-Container--carousel');
if (!track) { console.log('carousel did not render'); await b.close(); process.exit(0); }
const scrollOf = () => p.evaluate(() => { const el = document.querySelector('.consonant-Container--carousel'); return el ? Math.round(el.scrollLeft) : -1; });
const before = await scrollOf();
const next = await p.$('.consonant-Button--next');
console.log('carousel present: yes  next button:', next ? 'yes' : 'NO');
await p.evaluate(() => { const nb = document.querySelector(".consonant-Button--next"); if (nb) nb.click(); }); await p.waitForTimeout(900);
const after = await scrollOf();
console.log(`carousel scroll: ${before} -> ${after}   ${after > before ? 'NEXT WORKED ✓ (advanced)' : 'no change (did not advance)'}`);
await b.close();
