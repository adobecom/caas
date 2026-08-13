import { chromium } from 'playwright';
const URL = 'http://localhost:8899/index.html';
const b = await chromium.launch({ headless: true });
async function run(query, useEnter) {
  const p = await b.newPage();
  await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await p.waitForSelector('.consonant-Card', { timeout: 12000 });
  const before = await p.evaluate(() => document.querySelectorAll('.consonant-Card').length);
  const input = await p.$('[data-testid="consonant-Search-input"]');
  await input.click();
  await input.type(query, { delay: 25 });
  if (useEnter) await p.keyboard.press('Enter');
  await p.waitForTimeout(1000);
  const after = await p.evaluate(() => document.querySelectorAll('.consonant-Card').length);
  console.log(`type "${query}"${useEnter ? ' +Enter' : ''}:  ${before} -> ${after}   ${after !== before ? 'CHANGED ✓' : 'no change'}`);
  await p.close();
}
// list the card titles first so we know what to search
{
  const p = await b.newPage();
  await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await p.waitForSelector('.consonant-Card', { timeout: 12000 });
  const titles = await p.evaluate(() => [...document.querySelectorAll('.consonant-Card [class*="-title"]')].map(t => t.textContent.trim()));
  console.log('titles:'); titles.forEach(t => console.log('  - ' + t));
  await p.close();
}
await run('zzqqxx', false);   // gibberish -> expect drop to 0
await run('PHOTOSHOP', false);// distinctive tag word
await run('#2', false);       // one specific card
await b.close();
