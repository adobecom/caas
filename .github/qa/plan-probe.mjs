import { researchCode } from './code-search.mjs';
const PROXY=process.env.PROXY_URL, MODEL=process.env.MODEL, TOKEN=process.env.IMS_ACCESS_TOKEN;
const REPO_ROOT='/private/tmp/schema-branch';
function extractJson(src){
  const t=String(src).replace(/```(?:json)?/gi,'').trim();
  const a=t.indexOf('{'), b=t.lastIndexOf('}');
  return JSON.parse(t.slice(a,b+1));
}
async function llm(prompt, maxTokens=3000){
  const res=await fetch(PROXY,{method:'POST',headers:{Authorization:`Bearer ${TOKEN}`,'Content-Type':'application/json','anthropic-version':'2023-06-01'},body:JSON.stringify({model:MODEL,max_tokens:maxTokens,stream:true,messages:[{role:'user',content:prompt}]})});
  const raw=await res.text(); let text='';
  for(const line of raw.split('\n')){const s=line.trim();if(!s.startsWith('data:'))continue;const d=s.slice(5).trim();if(!d||d==='[DONE]')continue;let e;try{e=JSON.parse(d)}catch{continue}if(e.type==='content_block_delta'&&e.delta?.type==='text_delta')text+=e.delta.text||''}
  return text.trim();
}
async function probe(pr){
  const taskContext=`PR: ${pr.title}\nBody: ${pr.body}\nDiff:\n${pr.diff}`;
  const research=await researchCode({ ask: llm, repoRoot: REPO_ROOT, taskContext, maxSearches: 5 });
  const prompt=`Plan a browser feature test for this Adobe CaaS PR. Return ONLY JSON.\n\nPR: ${pr.title}\nBody: ${pr.body}\nDiff:\n${pr.diff}\n\nSource research (current checkout):\n${research.report}\n\nRULES: If the changed behavior becomes observable after ONE simple interaction (a single click on a visible control, or typing into a search field), return an "action" object naming that interaction. Use action for: clicking one filter item, clicking a load-more or carousel next/prev control, or typing into a search field. Only return a skipReason for interactions the harness cannot do (hover, scroll, drag, resize, URL change, or a SEQUENCE). For a pure initial-render assertion, omit action.\n\nReply ONLY JSON: {"expected":"the assertion","requiredInitial":[{"selector":"..."}],"action":{"kind":"click|type","selector":"CSS selector","value":"text if typing"},"skipReason":""}`;
  const plan=extractJson(await llm(prompt, 2000));
  console.log(`\n=== ${pr.title} ===`);
  console.log('  searches run:', research.searches.length);
  console.log('  ACTION picked:', JSON.stringify(plan.action||null));
  console.log('  skipReason:', plan.skipReason||'(none)');
}
const PRS=[
 { title:'fix: filter results narrow when a filter item is clicked',
   body:'Clicking a left-panel filter item should narrow the visible cards to only those matching the selected tag.',
   diff:'CardFilterer.js filterCards(): now calls getFilteredCards to narrow this.filteredCards by activeFilters' },
 { title:'fix: carousel next button advances to the next cards',
   body:'Clicking the carousel next control should scroll to reveal the next set of cards.',
   diff:'CardsCarousel.jsx nextButtonClick(): carousel.scrollLeft += (cardWidth + gridGap) * cardsShiftedPerClick' },
 { title:'fix: typing in the search box filters the cards',
   body:'Typing a query into the search field should show only cards whose title/description match.',
   diff:'CardFilterer.js searchCards(): sets this.filteredCards = getCardsMatchingSearch(query, cards, searchFields)' },
];
for(const pr of PRS){ try{ await probe(pr) }catch(e){ console.log(`\n=== ${pr.title} ===\n  ERROR: ${e.message}`) } }
