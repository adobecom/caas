// Feed the AFTER-CLICK difference (old good code vs new broken code) to the REAL LLM judge.
import { readFileSync } from 'fs';
const pre = JSON.parse(readFileSync('/tmp/after-good.json','utf8'));   // old code after click
const post = JSON.parse(readFileSync('/tmp/after-bugged.json','utf8')); // new (broken) code after click
const summary = `[after action] The tool clicked the "Digital Trends" filter on both builds. `
  + `OLD (pre) render after the click: ${pre.cardCount} card(s) [${pre.titles.slice(0,3).join('; ')}]. `
  + `NEW (post) render after the click: ${post.cardCount} card(s) [${post.titles.slice(0,3).join('; ')}]. `
  + `NEW shows ${post.cardCount - pre.cardCount} more card(s) than OLD after the same filter click.`;
const domDiff = { changed: pre.cardCount !== post.cardCount, summary };
const intent = {
  title: 'Card collection filtering',
  body: 'Clicking a filter in the left filter panel narrows the visible cards to only those matching the selected tag.',
  diff: 'filter selection -> CardFilterer.filterCards narrows the card set to matching tags',
};

async function judge(intent, domDiff) {
  const PROXY=process.env.PROXY_URL, MODEL=process.env.MODEL, TOKEN=process.env.IMS_ACCESS_TOKEN;
  const prompt = `A historical PR was tested by forcing its feature to render on OLD (pre) and NEW (post) code, performing one interaction, then diffing the two after-interaction renders. Decide whether the PR does what it claims.\n\n`
    + `=== INTENT ===\nTitle: ${intent.title}\nDescription: ${intent.body}\nCode change (intent only): ${intent.diff}\n\n`
    + `=== WHAT ACTUALLY CHANGED ON THE PAGE (source of truth) ===\nStructural change (new vs old, after the interaction): ${domDiff.summary}\n\n`
    + `The rendered page after the interaction is the source of truth. If the feature (filtering narrows results) works, OLD and NEW should both narrow to the matching card(s). If NEW no longer narrows (shows all cards) while OLD did, the feature is broken on NEW.\n`
    + `Reply ONLY JSON: {"verdict":"WORKS"|"FLAG"|"NO_CHANGE","reason":"one sentence"}.\n`
    + `- WORKS: NEW behaves like the feature intends (narrows on click).\n`
    + `- FLAG: NEW contradicts the intent (e.g. filtering no longer narrows; the click has no effect on NEW though it did on OLD).\n`
    + `- NO_CHANGE: no visible difference and none intended.`;
  const res = await fetch(PROXY,{method:'POST',headers:{Authorization:`Bearer ${TOKEN}`,'Content-Type':'application/json','anthropic-version':'2023-06-01'},body:JSON.stringify({model:MODEL,max_tokens:400,stream:true,messages:[{role:'user',content:prompt}]})});
  const raw=await res.text(); let text='';
  for(const line of raw.split('\n')){const t=line.trim();if(!t.startsWith('data:'))continue;const d=t.slice(5).trim();if(!d||d==='[DONE]')continue;let e;try{e=JSON.parse(d)}catch{continue}if(e.type==='content_block_delta'&&e.delta?.type==='text_delta')text+=e.delta.text||''}
  const j=JSON.parse(text.slice(text.indexOf('{'),text.lastIndexOf('}')+1));
  return j;
}
console.log('diff given to judge:', summary);
const v = await judge(intent, domDiff);
console.log(`\nAI JUDGE VERDICT: ${v.verdict}\n  reason: ${v.reason}`);
