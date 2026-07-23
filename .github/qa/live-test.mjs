import { chromium } from 'playwright';
import path from 'path';
const DIST='/Users/sanjayrai/caas-qa-build/dist';
const ALLOW=new Set(['app.css','main.min.js','react.umd.js','react.dom.umd.js']);
const PAGE='https://business.adobe.com/customer-success-stories.html';
const browser=await chromium.connectOverCDP('http://127.0.0.1:9222');
const context=browser.contexts()[0]||await browser.newContext();
const page=await context.newPage();
const errs=[];
page.on('pageerror',e=>errs.push(String(e.message).slice(0,100)));
let served=0;
await page.addInitScript((qa)=>{window._qa=qa;},{config:{collection:{cardStyle:'blade-card',mode:'dark'}},cardPatch:{overlays:{videoButton:{url:'https://video.example.com/demo.mp4'}}},patchTarget:3});
await page.route('**/caas-libs/**', async (route)=>{
  const file=route.request().url().split('?')[0].split('/').pop();
  if(ALLOW.has(file)){try{served++;return await route.fulfill({path:path.join(DIST,file)});}catch{}}
  return route.continue();
});
await page.goto(PAGE,{waitUntil:'domcontentloaded',timeout:35000}).catch(e=>errs.push('goto:'+e.message.slice(0,60)));
await page.waitForSelector('.consonant-Card',{timeout:22000}).catch(()=>{});
await page.waitForTimeout(3000);
const r=await page.evaluate(()=>({
  cards:document.querySelectorAll('.consonant-Card').length,
  firstClass:(document.querySelector('.consonant-Card')||{}).className||null,
  themeDark:document.querySelectorAll('.consonant-u-themeDark').length,
  videoIco:document.querySelectorAll('[data-testid="consonant-Card-videoIco"]').length,
  qa: typeof window._qa,
}));
console.log('servedFiles='+served);
console.log(JSON.stringify(r));
if(errs.length)console.log('errors:',errs.slice(0,4));
await page.close();
