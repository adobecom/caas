import { chromium } from 'playwright';
const url = process.argv[2];
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
const errs = [];
p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 100)); });
await p.goto(url, { waitUntil: 'load', timeout: 20000 }).catch(e => console.log('GOTO_ERR', e.message.slice(0,100)));
await p.waitForSelector('.consonant-CardsGrid, .consonant-Card', { timeout: 15000 }).catch(() => {});
const info = await p.evaluate(() => {
  const grid = document.querySelector('.consonant-CardsGrid, [class*="consonant-Container"]');
  const cards = Array.from(document.querySelectorAll('.consonant-Card'));
  return {
    gridPresent: !!grid,
    cardCount: cards.length,
    firstCardClasses: cards[0] ? cards[0].className.trim() : null,
    testids: [...new Set(Array.from(document.querySelectorAll('[data-testid]')).map(e => e.getAttribute('data-testid')))].slice(0, 10),
  };
});
console.log(JSON.stringify(info, null, 2));
if (errs.length) console.log('CONSOLE_ERRORS:', errs.slice(0, 4));
await b.close();
