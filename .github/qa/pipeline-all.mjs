import { chromium } from 'playwright';
import { readFileSync } from 'fs';
const cat=JSON.parse(readFileSync('/private/tmp/schema-branch/.github/qa/mount-catalog.json','utf8'));
const b=await chromium.launch({headless:true});
async function render(e, applyFeature){
  for(let a=0;a<3;a++){
    const p=await b.newPage();
    await p.addInitScript((q)=>{window._qa=q;}, applyFeature?{config:e.config||{},cardPatch:e.cardPatch||null,patchTarget:3}:{config:{},cardPatch:null});
    let present=0;
    try{await p.goto('http://localhost:8899/index.html',{waitUntil:'domcontentloaded',timeout:15000});
      await p.waitForSelector('.consonant-Card',{timeout:10000});
      await p.waitForSelector(e.expect.selector,{timeout:applyFeature?7000:1500}).catch(()=>{});
      present=await p.evaluate(s=>document.querySelectorAll(s).length,e.expect.selector);}catch(err){}
    await p.close();
    if(present>=(e.expect.min||1)) return true;
    if(!applyFeature) return false; // control absence is fine on first try
  }
  return false;
}
async function verdict(e, broken){
  const nw=await render(e, !broken); const old=await render(e,false);
  if(!nw) return 'FLAG'; if(nw && !old) return 'WORKS'; return 'NO_CHANGE';
}
// working: every feature should be WORKS
const CONC=3; const ids=cat.entries.map((_,i)=>i);
let works=0, worksFail=[];
for(let j=0;j<ids.length;j+=CONC){
  const wave=await Promise.all(ids.slice(j,j+CONC).map(async i=>{const v=await verdict(cat.entries[i],false); return {id:cat.entries[i].id, v};}));
  for(const w of wave){ if(w.v==='WORKS')works++; else worksFail.push(`${w.id}=${w.v}`); }
}
// broken samples: should FLAG
const brokenSamples=['card-style:editorial-card','feature:video-button','overlay:badge','infobit:price','filter:top'];
let flagged=0, flagFail=[];
for(const id of brokenSamples){const e=cat.entries.find(x=>x.id===id); if(!e)continue; const v=await verdict(e,true); if(v==='FLAG')flagged++; else flagFail.push(`${id}=${v}`);}
console.log(`WORKING FEATURES: ${works}/${cat.entries.length} determined WORKS`);
if(worksFail.length)console.log('  not-WORKS:', worksFail.join(', '));
console.log(`BROKEN SAMPLES: ${flagged}/${brokenSamples.length} determined FLAG`);
if(flagFail.length)console.log('  not-FLAG:', flagFail.join(', '));
await b.close();
