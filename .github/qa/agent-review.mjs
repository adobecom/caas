#!/usr/bin/env node
/** Interactive agent QA review (advisory, non-blocking).
 *  Drives qa-runner-v2.mjs (the interactive tool-use agent) against the PR
 *  build injected on the live business.adobe.com page, then posts findings as
 *  a single PR comment. Never gates. */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';

const env = (k, d) => process.env[k] ?? d;
const PR = env('PR_NUMBER');
const REPO = env('GH_REPO', 'adobecom/caas');
const DIST = env('DIST_DIR');
const BASE = env('BASE_URL', 'https://business.adobe.com/resources/main.html');
const CAASVER = env('CAASVER', '0.53.0');
const RUN_URL = env('RUN_URL', '');
if (!/^\d+$/.test(PR || '')) { console.error('PR_NUMBER must be a positive integer'); process.exit(1); }

const gh = (args) => execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const redact = (s) => (s || '').replace(/\b(gh[pousr]_[A-Za-z0-9]{20,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|AKIA[0-9A-Z]{16})\b/g, '[REDACTED]');

const meta = JSON.parse(gh(['pr', 'view', PR, '-R', REPO, '--json', 'title,body,files']));
let diff = '';
try { diff = gh(['pr', 'diff', PR, '-R', REPO]); } catch {}

const instruction = [
  `Target URL: ${BASE}?caasver=${CAASVER}`,
  '',
  `You are QA-reviewing pull request #${PR}. The PR's CaaS build is already injected into this live page, so you are testing the PR's code on the real business.adobe.com collection.`,
  `PR title: ${meta.title}`,
  `PR description: ${redact(meta.body || '(none)').slice(0, 1500)}`,
  `Changed files: ${(meta.files || []).map((f) => f.path).join(', ').slice(0, 800)}`,
  `Code diff (truncated, secrets redacted): ${redact(diff).slice(0, 6000)}`,
  '',
  'Interact like a real user: load the collection, apply a filter, run a search, paginate, and open/inspect a few cards. Screenshot after each action and actually look. Run run_axe and get_console_errors at least once. Focus on what this PR could have affected. Report anything broken, truncated, misaligned, low-contrast, or behaving incorrectly; if nothing is wrong, say so. End with done(report, verdict).',
].join('\n');

const REPORT_OUT = '/tmp/pr-review-report.json';
try { unlinkSync(REPORT_OUT); } catch {}
spawnSync('node', ['qa-runner-v2.mjs', instruction], {
  stdio: 'inherit',
  env: { ...process.env, DIST_DIR: DIST || '', REPORT_OUT, MAX_TURNS: env('MAX_TURNS', '14') },
});

let verdict = 'UNKNOWN', report = '(agent produced no report)';
if (existsSync(REPORT_OUT)) {
  try { const j = JSON.parse(readFileSync(REPORT_OUT, 'utf8')); verdict = j.verdict || verdict; report = j.report || report; } catch {}
}

const MARKER = '<!-- agent-qa-review -->';
const comment = [
  MARKER,
  '## 🤖 Agent QA review — interactive (advisory, non-blocking)',
  '',
  `The agent drove the PR build on the live business.adobe.com collection page — filtering, searching, paginating, inspecting cards. Verdict: **${verdict}**.`,
  '',
  report,
  '',
  RUN_URL ? `_Screenshots / console / axe artifacts are in the [workflow run](${RUN_URL})._` : '',
].join('\n');

let id = '';
try {
  const list = JSON.parse(gh(['pr', 'view', PR, '-R', REPO, '--json', 'comments']));
  const mine = (list.comments || []).filter((c) => (c.body || '').includes(MARKER)).pop();
  if (mine && mine.url) id = mine.url.split('issuecomment-').pop();
} catch {}
if (id) {
  gh(['api', '-X', 'PATCH', `repos/${REPO}/issues/comments/${id}`, '-f', `body=${comment}`]);
} else {
  mkdirSync('agent-review-out', { recursive: true });
  writeFileSync('agent-review-out/comment.md', comment);
  gh(['pr', 'comment', PR, '-R', REPO, '--body-file', 'agent-review-out/comment.md']);
}
console.log(`agent-review: posted interactive review on PR #${PR} (verdict ${verdict})`);
process.exit(0);
