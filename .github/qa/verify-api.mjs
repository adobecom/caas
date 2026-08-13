import { chromium } from 'playwright';
import { readFileSync } from 'fs';
const cat=JSON.parse(readFileSync('/private/tmp/schema-branch/.github/qa/mount-catalog.json','utf8'));
const start=+process.argv[2]||0, count=+process.argv[3]||cat.entries.length, end=Math.min(start+count,cat.entries.length);
const b=await chromium.launch({headless:true});
const CONC=3; const idx=[]; for(let i=start;i<end;i++)idx.push(i);
async function check(i){const e=cat.entries[i];let found=0;
  for(let a=0;a<3;a++){const p=await b.newPage();found=0;
    await p.addInitScript((qa)=>{window._qa=qa;}, {config:e.config||{}, cardPatch:e.cardPatch||null, patchTarget:3});
    try{await p.goto('http://localhost:8899/index.html',{waitUntil:'domcontentloaded',timeout:15000});await p.waitForSelector('.consonant-Card',{timeout:10000});await p.waitForSelector(e.expect.selector,{timeout:7000}).catch(()=>{});found=await p.evaluate(s=>document.querySelectorAll(s).length,e.expect.selector);}catch(err){}
    await p.close(); if(found>=(e.expect.min||1))break;}
  return `${found>=(e.expect.min||1)?'PASS':'FAIL'}  ${e.id.padEnd(26)} found=${found}`;}
const out=[];for(let j=0;j<idx.length;j+=CONC){out.push(...await Promise.all(idx.slice(j,j+CONC).map(check)));}
console.log(out.join('\n'));
await b.close();
