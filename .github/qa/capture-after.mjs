// Render localhost, perform the action (click the Digital Trends filter), capture the AFTER-action
// DOM signature using the same shape the real tool uses. Save to the given path.
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
const OUT = process.argv[2];
const URL = 'http://localhost:8899/index.html';
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
await p.waitForSelector('.consonant-Card', { timeout: 12000 });
for (const g of await p.$$('[data-testid="consonant-LeftFilter-name"]')) { try { await g.click(); await p.waitForTimeout(80); } catch {} }
// ACTION: click the "Digital Trends" filter (the tool's action step does exactly this)
const rows = await p.$$('[data-testid="consonant-LeftFilter-itemsItem"]');
const labels = await p.evaluate(() => [...document.querySelectorAll('[data-testid="consonant-LeftFilter-itemsItem"]')].map((el) => el.textContent.replace(/\s+/g, ' ').trim()));
const idx = labels.findIndex((t) => /digital trends/i.test(t));
if (idx >= 0) { await rows[idx].click(); await p.waitForTimeout(1200); }
// capture after-action signature (card count + card titles = the observable filtering result)
const sig = await p.evaluate(() => {
  const cards = [...document.querySelectorAll('.consonant-Card')];
  return { cardCount: cards.length, titles: cards.map((c) => (c.querySelector('[class*="-title"]')?.textContent || '').trim()).filter(Boolean) };
});
writeFileSync(OUT, JSON.stringify(sig, null, 2));
console.log(`captured after-click -> ${OUT}: ${sig.cardCount} cards`, sig.titles.slice(0,3));
await b.close();
