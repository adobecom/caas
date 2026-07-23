// ACTION-LAYER PROOF: render -> perform a real browser action (click / type) -> re-check.
// Proves the browser can DRIVE the page, not just set it up. Runs on localhost harness.
import { chromium } from 'playwright';
const URL = 'http://localhost:8899/index.html';
const b = await chromium.launch({ headless: true });

async function newPage(qa) {
  const p = await b.newPage();
  if (qa) await p.addInitScript((q) => { window._qa = q; }, qa);
  await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await p.waitForSelector('.consonant-Card', { timeout: 12000 });
  return p;
}
const countCards = (p) => p.evaluate(() => document.querySelectorAll('.consonant-Card').length);

console.log('=== CLICK test: load-more pagination ===');
{
  const p = await newPage({ config: { pagination: { type: 'loadMore' }, collection: { resultsPerPage: '2' } } });
  const before = await countCards(p);
  const btn = await p.$('[data-testid="consonant-LoadMore-btn"]');
  console.log(`cards before click: ${before}   load-more button present: ${btn ? 'yes' : 'NO'}`);
  if (btn) {
    await btn.click();
    await p.waitForTimeout(700);
    const after = await countCards(p);
    console.log(`cards after click:  ${after}   => ${after > before ? 'CLICK WORKED (more cards shown)' : 'no change'}`);
  }
  await p.close();
}

console.log('\n=== TYPE test: search box filters cards ===');
{
  const p = await newPage(null);
  const before = await countCards(p);
  const input = await p.$('[data-testid="consonant-Search-input"]');
  console.log(`cards before typing: ${before}   search box present: ${input ? 'yes' : 'NO'}`);
  if (input) {
    // grab a distinctive word from the first card's title, type it, expect fewer cards
    const title = await p.evaluate(() => {
      const t = document.querySelector('.consonant-Card [class*="-title"]');
      return t ? t.textContent.trim() : '';
    });
    const word = (title.split(/\s+/).find((w) => w.length >= 4) || title.slice(0, 5) || 'the');
    await input.click();
    await input.type(word, { delay: 20 });
    await p.waitForTimeout(900);
    const after = await countCards(p);
    console.log(`typed "${word}"  (from title "${title}")`);
    console.log(`cards after typing:  ${after}   => ${after !== before ? 'TYPE WORKED (results changed)' : 'no change'}`);
  }
  await p.close();
}
await b.close();
