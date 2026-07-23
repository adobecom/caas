import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
const ROOT='/Users/sanjayrai/caas-qa-build';
const cat=JSON.parse(readFileSync('/private/tmp/schema-branch/.github/qa/mount-catalog.json','utf8'));
const baseHtml=readFileSync(`${ROOT}/index.html`,'utf8');
const baseColl=readFileSync(`${ROOT}/mock-json/test-group-filters.json`,'utf8');
const INST='const consonantCardCollection = new ConsonantCardCollection(config,';
const DM="(function dm(t,s){for(const k in s){const v=s[k];if(v&&typeof v==='object'&&!Array.isArray(v)){t[k]=t[k]||{};dm(t[k],v);}else{t[k]=v;}}return t;})";
function dm(t,s){for(const k in s){const v=s[k];if(v&&typeof v==='object'&&!Array.isArray(v)){t[k]=t[k]||{};dm(t[k],v);}else{t[k]=v;}}return t;}
const start=+process.argv[2]||0, count=+process.argv[3]||cat.entries.length, end=Math.min(start+count,cat.entries.length);
for(let i=start;i<end;i++){const e=cat.entries[i];
  let html=baseHtml.replace(INST,`${DM}(config, ${JSON.stringify(e.config||{})}); ${INST}`);
  if(e.cardPatch){const coll=JSON.parse(baseColl);const arr=coll.cards||coll.data||Object.values(coll).find(v=>Array.isArray(v));for(const c of arr.slice(0,3))dm(c,e.cardPatch);writeFileSync(`${ROOT}/mock-json/verify-${i}.json`,JSON.stringify(coll));html=html.replace('test-group-filters.json',`verify-${i}.json`);}
  writeFileSync(`${ROOT}/verify-${i}.html`,html);}
const b=await chromium.launch({headless:true});
async function check(i){const e=cat.entries[i];let found=0;
  for(let a=0;a<3;a++){const p=await b.newPage();found=0;
    try{await p.goto(`http://localhost:8899/verify-${i}.html`,{waitUntil:'domcontentloaded',timeout:15000});await p.waitForSelector('.consonant-Card',{timeout:10000});await p.waitForSelector(e.expect.selector,{timeout:7000}).catch(()=>{});found=await p.evaluate(s=>document.querySelectorAll(s).length,e.expect.selector);}catch(err){}
    await p.close(); if(found>=(e.expect.min||1))break;}
  return `${found>=(e.expect.min||1)?'PASS':'FAIL'}  ${e.id.padEnd(26)} found=${found}`;}
const idx=[];for(let i=start;i<end;i++)idx.push(i);
const CONC=3;const out=[];
for(let j=0;j<idx.length;j+=CONC){const wave=await Promise.all(idx.slice(j,j+CONC).map(check));out.push(...wave);}
console.log(out.join('\n'));
await b.close();
