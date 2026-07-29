import { researchCode } from './code-search.mjs';
const PROXY=process.env.PROXY_URL, MODEL=process.env.MODEL, TOKEN=process.env.IMS_ACCESS_TOKEN;
const REPO_ROOT='/private/tmp/schema-branch';
function extractJson(src){const t=String(src).replace(/```(?:json)?/gi,'').trim();const a=t.indexOf('{'),b=t.lastIndexOf('}');return JSON.parse(t.slice(a,b+1));}
async function llm(prompt, maxTokens=3000){
  const res=await fetch(PROXY,{method:'POST',headers:{Authorization:`Bearer ${TOKEN}`,'Content-Type':'application/json','anthropic-version':'2023-06-01'},body:JSON.stringify({model:MODEL,max_tokens:maxTokens,stream:true,messages:[{role:'user',content:prompt}]})});
  const raw=await res.text(); let text='';
  for(const line of raw.split('\n')){const s=line.trim();if(!s.startsWith('data:'))continue;const d=s.slice(5).trim();if(!d||d==='[DONE]')continue;let e;try{e=JSON.parse(d)}catch{continue}if(e.type==='content_block_delta'&&e.delta?.type==='text_delta')text+=e.delta.text||''}
  return text.trim();
}
async function probe(pr){
  const taskContext=`PR: ${pr.title}\nBody: ${pr.body}\nDiff:\n${pr.diff}`;
  const research=await researchCode({ ask: llm, repoRoot: REPO_ROOT, taskContext, maxSearches: 5 });
  const prompt=`Plan a browser feature test for this Adobe CaaS PR. Return ONLY JSON.\n\nPR: ${pr.title}\nBody: ${pr.body}\nDiff:\n${pr.diff}\n\nSource research (current checkout):\n${research.report}\n\nRULES: If the changed behavior only takes effect at a mobile/tablet screen width (window.innerWidth < ~1200, isMobile, or NOT_DESKTOP_SCREEN_SIZE), set "viewport":"mobile" instead of skipping; the harness renders at phone width (390px) before the bundle loads so isMobile is true. Only skip for hover/scroll/drag/URL-change/multi-step.\n\nReply ONLY JSON: {"expected":"...","viewport":"desktop|mobile","action":{"kind":"click|type","selector":"...","value":""},"skipReason":""}`;
  const plan=extractJson(await llm(prompt, 2000));
  console.log(`\n=== ${pr.title} ===`);
  console.log('  VIEWPORT picked:', plan.viewport||'(unset=desktop)');
  console.log('  skipReason:', plan.skipReason||'(none)');
}
const PRS=[
 { title:'fix: force modern carousel layout on mobile viewports',
   body:'On mobile viewports, force the modern carousel layout even when isModernCarousel is not set in config.',
   diff:'Helpers.js: export const isMobile = window.innerWidth < TABLET_BREAKPOINT; Container.jsx: modern-carousel class applied when isModernCarousel || isMobile' },
 { title:'fix: adds aria-label to the search field',
   body:'The search input in the filters info area should have an aria-label. The search field only renders on mobile/tablet width.',
   diff:'Search.jsx: input gets aria-label; Info.jsx shouldRenderSearch = searchEnabled && windowWidth < 1200' },
];
for(const pr of PRS){ try{ await probe(pr) }catch(e){ console.log(`\n=== ${pr.title} ===\n  ERROR: ${e.message}`) } }
