import { chromium } from 'playwright';
import { readFileSync } from 'fs';
const cat=JSON.parse(readFileSync('/private/tmp/schema-branch/.github/qa/mount-catalog.json','utf8'));
const byId=Object.fromEntries(cat.entries.map(e=>[e.id,e]));
const b=await chromium.launch({headless:true});

// mount a scenario (feature on/off) and report whether the feature's marker is present
async function render(entry, applyFeature){
  const p=await b.newPage();
  const qa = applyFeature ? {config:entry.config||{}, cardPatch:entry.cardPatch||null, patchTarget:3} : {config:{}, cardPatch:null};
  await p.addInitScript((q)=>{window._qa=q;}, qa);
  let present=0;
  try{await p.goto('http://localhost:8899/index.html',{waitUntil:'domcontentloaded',timeout:15000});
    await p.waitForSelector('.consonant-Card',{timeout:10000});
    await p.waitForSelector(entry.expect.selector,{timeout:applyFeature?7000:1200}).catch(()=>{});
    present=await p.evaluate(s=>document.querySelectorAll(s).length,entry.expect.selector);}catch(e){}
  await p.close(); return present>=(entry.expect.min||1);
}

// The pipeline: given a PR (feature it claims + whether the code actually applies it),
// mount NEW (post) and OLD (pre=control, feature never existed), and decide a verdict deterministically.
async function pipeline(pr){
  const e=byId[pr.feature];
  // NEW build: if the PR's code is broken, the feature does NOT apply even though we mount its scenario.
  const mountedNew = await render(e, !pr.broken);
  // OLD build: the feature did not exist yet -> control (never mounts).
  const mountedOld = await render(e, false);
  let verdict;
  if(!mountedNew) verdict='FLAG';                 // PR claims the feature but it did not render
  else if(mountedNew && !mountedOld) verdict='WORKS';   // appears on new, absent on old = the PR added it
  else verdict='NO_CHANGE';                        // present in both -> PR did not actually introduce it
  return {verdict, mountedNew, mountedOld};
}

const prs=[
 {name:'PR: add editorial card style', feature:'card-style:editorial-card', broken:false, expect:'WORKS'},
 {name:'PR: add video button',         feature:'feature:video-button',     broken:false, expect:'WORKS'},
 {name:'PR: add price infobit',        feature:'infobit:price',            broken:false, expect:'WORKS'},
 {name:'PR: add badge',                feature:'overlay:badge',            broken:false, expect:'WORKS'},
 {name:'PR: add editorial card [BROKEN]', feature:'card-style:editorial-card', broken:true, expect:'FLAG'},
 {name:'PR: add video button [BROKEN]',   feature:'feature:video-button',     broken:true, expect:'FLAG'},
];
console.log('PR'.padEnd(38),'new old verdict   expect  result');
let pass=0;
for(const pr of prs){const r=await pipeline(pr);
  const ok=r.verdict===pr.expect; if(ok)pass++;
  console.log(`${pr.name.padEnd(38)} ${r.mountedNew?'Y':'n'}   ${r.mountedOld?'Y':'n'}   ${r.verdict.padEnd(9)} ${pr.expect.padEnd(6)}  ${ok?'PASS':'FAIL'}`);}
console.log(`\n=== ${pass}/${prs.length} pipeline verdicts correct ===`);
await b.close();
