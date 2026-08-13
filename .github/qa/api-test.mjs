import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
await p.addInitScript(() => {
  window._qa = {
    config: { collection: { cardStyle: 'blade-card', mode: 'dark' } },
    cardPatch: { overlays: { videoButton: { url: 'https://video.example.com/demo.mp4' } } },
    patchTarget: 3,
  };
});
await p.goto('http://localhost:8899/index.html', { waitUntil: 'load', timeout: 20000 }).catch(()=>{});
await p.waitForSelector('.consonant-Card', { timeout: 10000 }).catch(()=>{});
await p.waitForTimeout(800);
const r = await p.evaluate(() => ({
  firstCardClass: (document.querySelector('.consonant-Card')||{}).className,
  themeDark: document.querySelectorAll('.consonant-u-themeDark').length,
  videoIco: document.querySelectorAll('[data-testid="consonant-Card-videoIco"]').length,
  cards: document.querySelectorAll('.consonant-Card').length,
}));
console.log(JSON.stringify(r));
await b.close();
