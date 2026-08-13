// LOCAL AI-JUDGE TEST
// Renders a scenario NEW vs OLD on localhost via window._qa, computes a real DOM diff,
// and asks the ACTUAL LLM judge (same prompt as the batch) for WORKS/FLAG/NO_CHANGE.
// Creds sourced from env (PROXY_URL/MODEL/IMS_ACCESS_TOKEN); values never printed.
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { diffSignatures, summarizeDiff } from './dom-diff.mjs';

const cat = JSON.parse(readFileSync('/private/tmp/schema-branch/.github/qa/mount-catalog.json', 'utf8'));
const byId = Object.fromEntries(cat.entries.map((e) => [e.id, e]));
const URL = 'http://localhost:8899/index.html';
const b = await chromium.launch({ headless: true });

// capture the SAME domSignature shape the worker uses
function captureSignature() {
  const sigRoot = document.querySelector('.consonant-CardsGrid, [class*="consonant-Container"], #caas, .caas-preview') || document.body;
  const classes = {}; const attrs = {}; const tags = {}; const testidSet = new Set(); const texts = [];
  for (const el of sigRoot.querySelectorAll('*')) {
    const tag = (el.tagName || '').toLowerCase(); if (!tag) continue;
    tags[tag] = (tags[tag] || 0) + 1;
    String(el.className || '').split(/\s+/).filter(Boolean).forEach((c) => { classes[c] = (classes[c] || 0) + 1; });
    if (el.getAttributeNames) for (const n of el.getAttributeNames()) {
      if (n === 'class' || n === 'style' || n === 'id') continue;
      if (n === 'data-testid') { const t = el.getAttribute(n); if (t) testidSet.add(t); }
      if (n.startsWith('data-') || n.startsWith('aria-') || ['role', 'href', 'type', 'alt'].includes(n)) {
        const v = String(el.getAttribute(n) || '').slice(0, 40); attrs[`${n}=${v}`] = (attrs[`${n}=${v}`] || 0) + 1;
      }
    }
  }
  sigRoot.querySelectorAll('.consonant-Card [class*="-title"], [class*="Card-label"], [class*="Card-content"]').forEach((e) => {
    const t = String(e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60); if (t) texts.push(t);
  });
  return { classes, attrs, tags, testids: [...testidSet].sort(), texts };
}

async function renderSig(entry, applyFeature) {
  const p = await b.newPage();
  const qa = applyFeature ? { config: entry.config || {}, cardPatch: entry.cardPatch || null, patchTarget: 3 } : { config: {}, cardPatch: null };
  await p.addInitScript((q) => { window._qa = q; }, qa);
  try {
    await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await p.waitForSelector('.consonant-Card', { timeout: 10000 });
    if (applyFeature) await p.waitForSelector(entry.expect.selector, { timeout: 7000 }).catch(() => {});
    else await p.waitForTimeout(800);
  } catch (e) {}
  const sig = await p.evaluate(captureSignature);
  await p.close();
  return sig;
}

// ---- the real LLM judge (copied verbatim from feature-backtest-batch.mjs) ----
async function judgeExpected(intent, domDiff, visualDiff) {
  const PROXY = process.env.PROXY_URL; const MODEL = process.env.MODEL; const TOKEN = process.env.IMS_ACCESS_TOKEN;
  if (!PROXY || !MODEL || !TOKEN) return { error: 'missing creds' };
  const { title = '', body = '', diff = '' } = intent || {};
  const prompt = `A historical PR was tested by forcing its feature to render on the OLD (pre-PR) code and the NEW (post-PR) code, then diffing the two renders. Decide whether the PR actually does what it claims.\n\n`
    + `=== WHAT THE PR INTENDED (from its own title, description, and code change) ===\n`
    + `Title: ${title}\n`
    + `Description: ${(body || '(none)').slice(0, 1200)}\n`
    + `Code change (context for INTENT only, NOT proof it works):\n${(diff || '(none)').slice(0, 6000)}\n\n`
    + `=== WHAT ACTUALLY CHANGED ON THE PAGE (the only evidence of real behavior) ===\n`
    + `Structural change (new vs old render): ${domDiff ? domDiff.summary : 'none captured'}\n`
    + `Visual change: ${visualDiff ? (visualDiff.changed ? `yes (${visualDiff.pct}% of pixels)` : 'no') : 'n/a'}\n\n`
    + `The rendered page diff is the source of truth for what the code ACTUALLY did. The code change only shows what was INTENDED; never assume it worked because it looks correct.\n`
    + `IMPORTANT: the harness forces ONE scenario/variant to render, so not every detail in the code or description will be visible. Judge against the feature's CORE purpose, not a specific sub-detail — do NOT flag merely because one described variant, state, or edge case is not shown in this single render.\n`
    + `Decide from the CODE CHANGE whether the PR alters the DOM. Any change to markup, an element, a CSS CLASS applied to an element, an attribute, a data-testid, or rendered text is a DOM change (toggling a class on or off counts). A DOM-altering PR MUST produce a structural change in the render; if the structural diff shows none, the change did NOT apply -> FLAG, no matter how large or small the visual diff is (a small visual diff is often just render noise). Only a PR that changes CSS VALUES alone (color, size, spacing, line-clamp) with no markup/class/attribute change may legitimately be visual-only.\n`
    + `Reply ONLY JSON: {"verdict":"WORKS"|"FLAG"|"NO_CHANGE","reason":"one sentence"}.\n`
    + `- WORKS: the render shows a change consistent with the PR's core purpose — a structural change when the PR alters markup/classes/attributes/testids, or a visual change when the PR changes CSS values — even if a specific described variant is not visible here.\n`
    + `- FLAG: the change did not apply — the PR alters the DOM (markup/class/attribute/testid) but the structural diff shows NO change, or the PR intends a substantial feature but the render is essentially unchanged — OR the change clearly contradicts the intent (wrong result, opposite effect, or an unrelated element broke).\n`
    + `- NO_CHANGE: the PR did not intend any visible change (pure refactor, comment/log/formatting tweak) and the page correctly shows no change.`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(PROXY, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: MODEL, max_tokens: 600, stream: true, messages: [{ role: 'user', content: prompt }] }) });
      const raw = await res.text(); let text = '';
      for (const line of raw.split('\n')) { const t = line.trim(); if (!t.startsWith('data:')) continue; const d = t.slice(5).trim(); if (!d || d === '[DONE]') continue; let e; try { e = JSON.parse(d); } catch { continue; } if (e.type === 'content_block_delta' && e.delta?.type === 'text_delta') text += e.delta.text || ''; }
      const start = text.indexOf('{'); const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error('empty/non-JSON');
      const j = JSON.parse(text.slice(start, end + 1));
      if (!j.verdict) throw new Error('no verdict');
      return { verdict: j.verdict, reason: j.reason };
    } catch (error) { if (attempt === 3) return { error: error.message }; await new Promise((r) => setTimeout(r, 4000 * (attempt + 1))); }
  }
}

// ---- test PRs: cover all 3 verdicts ----
// applyNew: does the NEW build actually render the feature (false = broken PR that fails to apply)
// applyOld: OLD (pre-PR) baseline — feature did not exist yet, so false (control)
const PRS = [
  { name: 'add editorial-card style', feature: 'card-style:editorial-card', applyNew: true, applyOld: false,
    intent: { title: 'Add editorial-card card style', body: 'Introduces a new editorial-card style, adding the editorial-card class + CardFooter to rendered cards.', diff: '+ CARD_STYLES.editorial-card ... className="consonant-Card editorial-card"' }, expect: 'WORKS' },
  { name: 'add video button', feature: 'feature:video-button', applyNew: true, applyOld: false,
    intent: { title: 'Render play/video button overlay', body: 'When a card has overlays.videoButton.url, render a play button (data-testid consonant-Card-videoIco).', diff: '+ <button data-testid="consonant-Card-videoIco">' }, expect: 'WORKS' },
  { name: 'add badge overlay', feature: 'overlay:badge', applyNew: true, applyOld: false,
    intent: { title: 'Show card badge label', body: 'Adds a badge label overlay to cards when showCardBadges is enabled.', diff: '+ consonant-Card-label badge markup' }, expect: 'WORKS' },
  { name: 'add editorial-card [BROKEN, code never applies class]', feature: 'card-style:editorial-card', applyNew: false, applyOld: false,
    intent: { title: 'Add editorial-card card style', body: 'Introduces a new editorial-card style, adding the editorial-card class to rendered cards.', diff: '+ CARD_STYLES.editorial-card ... className="consonant-Card editorial-card"' }, expect: 'FLAG' },
  { name: 'remove a stale console.log (no-op control)', feature: 'card-style:editorial-card', applyNew: false, applyOld: false,
    intent: { title: 'Remove stale console.log in Card.jsx', body: 'Pure cleanup: deletes a leftover console.log. No visible change.', diff: '- console.log("card rendered");' }, expect: 'NO_CHANGE' },
];

console.log('creds present:', ['PROXY_URL', 'MODEL', 'IMS_ACCESS_TOKEN'].every((k) => process.env[k]) ? 'yes' : 'NO');
console.log('PR'.padEnd(52), 'diff'.padEnd(6), 'AI'.padEnd(10), 'expect'.padEnd(10), 'result');
let pass = 0;
for (const pr of PRS) {
  const e = byId[pr.feature];
  if (!e) { console.log(`${pr.name.padEnd(52)} MISSING catalog id ${pr.feature}`); continue; }
  const newSig = await renderSig(e, pr.applyNew);
  const oldSig = await renderSig(e, pr.applyOld);
  const d = diffSignatures(oldSig, newSig);
  const domDiff = { changed: d.changed, summary: summarizeDiff(d) };
  const j = await judgeExpected(pr.intent, domDiff, { changed: false });
  const verdict = j.verdict || `ERR:${j.error}`;
  const ok = verdict === pr.expect; if (ok) pass += 1;
  console.log(`${pr.name.slice(0, 51).padEnd(52)} ${(d.changed ? 'Y' : 'n').padEnd(6)} ${verdict.padEnd(10)} ${pr.expect.padEnd(10)} ${ok ? 'PASS' : 'FAIL'}`);
  if (j.reason) console.log(`   judge: ${j.reason}`);
}
console.log(`\n=== ${pass}/${PRS.length} AI-judge verdicts correct ===`);
await b.close();
