import { chromium } from 'playwright';
const b=await chromium.launch({headless:true});const p=await b.newPage();
await p.addInitScript((q)=>{window._qa=q;},{config:{collection:{layout:{container:'carousel'}}},cardPatch:null});
await p.goto('http://localhost:8899/index.html',{waitUntil:'load',timeout:20000}).catch(()=>{});
await p.waitForSelector('.consonant-Card',{timeout:10000}).catch(()=>{});
await p.waitForTimeout(1000);
const r=await p.evaluate(()=>({wrapperCarousel:document.querySelectorAll('.consonant-Wrapper--carousel').length,nav:document.querySelectorAll('.consonant-Navigation--carousel,[class*=Carousel]').length,cards:document.querySelectorAll('.consonant-Card').length}));
console.log(JSON.stringify(r));await b.close();
