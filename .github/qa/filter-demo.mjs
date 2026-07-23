import { chromium } from 'playwright';
const URL = 'http://localhost:8899/index.html';
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
await p.waitForSelector('.consonant-Card', { timeout: 12000 });
const count = () => p.evaluate(() => document.querySelectorAll('.consonant-Card').length);
const before = await count();
for (const g of await p.$$('[data-testid="consonant-LeftFilter-name"]')) { try { await g.click(); await p.waitForTimeout(100); } catch {} }

const rows = await p.$$('[data-testid="consonant-LeftFilter-itemsItem"]');
const labels = await p.evaluate(() =>
  [...document.querySelectorAll('[data-testid="consonant-LeftFilter-itemsItem"]')].map((el) => el.textContent.replace(/\s+/g, ' ').trim().slice(0, 28)));
console.log('cards before:', before, '| filter rows:', rows.length);
console.log('labels:', labels.join(' | '));
const idx = labels.findIndex((t) => /digital trends/i.test(t));
if (idx >= 0) {
  await rows[idx].click();
  await p.waitForTimeout(1000);
  const after = await count();
  console.log(`\nclicked "${labels[idx]}" -> cards ${before} -> ${after}   ${after !== before ? 'FILTER WORKED ✓' : 'no change'}`);
} else {
  console.log('\nno Photoshop row; clicking first row to prove click changes results:');
  await rows[0].click(); await p.waitForTimeout(1000);
  console.log(`"${labels[0]}" -> cards ${before} -> ${await count()}`);
}
await b.close();
