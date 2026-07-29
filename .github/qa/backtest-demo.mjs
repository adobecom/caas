import { chromium } from 'playwright';
import { readFileSync } from 'fs';
const cat=JSON.parse(readFileSync('/private/tmp/schema-branch/.github/qa/mount-catalog.json','utf8'));
const byId=Object.fromEntries(cat.entries.map(e=>[e.id,e]));
// Sample "PRs" — a feature each PR would introduce; we mount ON (feature present) vs OFF (control)
const samples=['card-style:editorial-card','feature:video-button','infobit:price','overlay:badge','theme:dark','filter:top','pagination:paginator'];
const b=await chromium.launch({headless:true});
async function count(entry, withFeature){const p=await b.newPage();let n=0;
  const qa=withFeature?{config:entry.config||{},cardPatch:entry.cardPatch||null,patchTarget:3}:{config:{},cardPatch:null};
  await p.addInitScript((q)=>{window._qa=q;},qa);
  try{await p.goto('http://localhost:8899/index.html',{waitUntil:'domcontentloaded',timeout:15000});await p.waitForSelector('.consonant-Card',{timeout:10000});await p.waitForSelector(entry.expect.selector,{timeout:withFeature?7000:1500}).catch(()=>{});n=await p.evaluate(s=>document.querySelectorAll(s).length,entry.expect.selector);}catch(e){}
  await p.close();return n;}
console.log('feature'.padEnd(26),'ON  OFF  verdict');
for(const id of samples){const e=byId[id];if(!e){console.log(id,'(missing)');continue;}
  const on=await count(e,true), off=await count(e,false);
  const detected = on>= (e.expect.min||1) && off===0;
  console.log(`${id.padEnd(26)} ${String(on).padStart(2)}  ${String(off).padStart(3)}   ${detected?'DISCRIMINATES (on-only) ✓':'x'}`);}
await b.close();
