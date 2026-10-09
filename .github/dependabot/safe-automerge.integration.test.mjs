import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const controller = fileURLToPath(new URL('./safe-automerge.mjs', import.meta.url));
const repo = 'test/queue';
const pr = (number, label) => ({ number, baseRefName: 'main', headRefOid: `head${number}`,
  createdAt: `2026-10-${number === 653 ? '08' : '09'}T00:00:00Z`,
  mergeStateStatus: 'CLEAN', labels: [{ name: label }], autoMergeRequest: null });

// Execute the actual CLI with a stateful GitHub stand-in. No real gh binary or
// credentials are available to the child. Unexpected commands fail the test.
function simulate(prs, data, runs = 1) {
  const dir = mkdtempSync(join(tmpdir(), 'caas-queue-test-'));
  try {
    const statePath = join(dir, 'state.json');
    writeFileSync(statePath, JSON.stringify({ prs, data, calls: [] }));
    writeFileSync(join(dir, 'gh'), `#!${process.execPath}
import { readFileSync, writeFileSync } from 'node:fs';
const path = process.env.TEST_STATE;
const state = JSON.parse(readFileSync(path));
const a = process.argv.slice(2);
state.calls.push(a);
let result = '';
if (a[0] === 'label' && a[1] === 'create') {}
else if (a[0] === 'pr' && a[1] === 'list') result = state.prs;
else if (a[0] === 'pr' && a[1] === 'view') result = {
 files: [{path:'package.json'}, {path:'package-lock.json'}],
 commits: [{authors:[{login:'dependabot[bot]'}]}], comments: []
};
else if (a[0] === 'pr' && a[1] === 'edit') {
 const p = state.prs.find(p => p.number === Number(a[2]));
 const add = a.indexOf('--add-label'), remove = a.indexOf('--remove-label');
 if (remove >= 0) p.labels = p.labels.filter(l => l.name !== a[remove+1]);
 if (add >= 0) p.labels.push({name:a[add+1]});
} else if (a[0] === 'pr' && a[1] === 'merge') {
 const p = state.prs.find(p => p.number === Number(a[2]));
 if (a.includes('--disable-auto')) p.autoMergeRequest = null;
 else if (a.includes('--auto')) p.autoMergeRequest = {enabled:true};
 else throw Error('Unexpected merge command');
} else if (a[0] === 'api') {
 const endpoint = a[1];
 if (endpoint === 'repos/test/queue') result = {default_branch:'main',allow_auto_merge:true};
 else if (endpoint.includes('/rulesets?')) result = [{id:1,enforcement:'active'}];
 else if (endpoint.endsWith('/rulesets/1')) result = {
 conditions:{ref_name:{include:['~DEFAULT_BRANCH']}},
 rules:[{type:'required_status_checks',parameters:{strict_required_status_checks_policy:true}}]
 };
 else if (endpoint.includes('/git/ref/')) result = 'base';
 else if (endpoint.includes('/commits/')) {
 const head = endpoint.split('/commits/')[1].split('/')[0];
 const d = state.data[head];
 result = endpoint.includes('/check-runs') ? {check_runs:d.checkRuns} : {statuses:d.statuses};
 } else if (endpoint.includes('/compare/')) {
 result = {behind_by:state.data[endpoint.split('...')[1]].behindBy || 0};
 } else if (endpoint.includes('/issues/') && endpoint.includes('/comments')) result = [];
 else if (endpoint === '-X' && a[2] === 'POST' && a[3].includes('/comments')) result = {};
 else throw Error('Unexpected API call: '+JSON.stringify(a));
} else throw Error('Unexpected command: '+JSON.stringify(a));
writeFileSync(path,JSON.stringify(state));
process.stdout.write(typeof result === 'string' ? result : JSON.stringify(result));
`, { mode: 0o755 });
    // Treat the extensionless fake gh as ESM on supported Node versions.
    writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
    for (let i = 0; i < runs; i += 1) {
      const result = spawnSync(process.execPath, [controller], {
        encoding: 'utf8', timeout: 30000,
        env: { PATH: dir, TEST_STATE: statePath, GITHUB_REPOSITORY: repo, AUTOMERGE_MODE: 'merge' },
      });
      assert.equal(result.status, 0, result.stderr);
    }
    return JSON.parse(readFileSync(statePath));
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
const clean = {checkRuns:[{id:2,name:'check-build',status:'completed',conclusion:'success'}],
 statuses:[{context:'build-output-diff',state:'success',description:'NO_CHANGE'}]};
const failed = {checkRuns:[{id:1,name:'build-output-diff',status:'completed',conclusion:'failure'}], statuses:[]};

test('CLI releases failed owner, records reason, and arms only the next safe PR', () => {
 const state = simulate([pr(653,'dependencies-active'),pr(659,'dependencies-queued')],
  {head653:failed,head659:clean},3);
 assert.deepEqual(state.prs[0].labels.map(l=>l.name),['dependencies-review']);
 assert.ok(state.prs[1].autoMergeRequest);
 const merges = state.calls.filter(a=>a[0]==='pr' && a[1]==='merge');
 assert.equal(merges.length,1);
 assert.equal(merges[0][2],'659');
 assert.ok(merges[0].includes('--match-head-commit'));
 assert.ok(merges[0].includes('head659'));
 assert.ok(state.calls.some(a=>a.some(v=>v.includes('build-output-diff concluded failure'))));
});

test('CLI disables stale auto-merge before releasing a failed owner', () => {
 const owner = {...pr(653,'dependencies-active'),autoMergeRequest:{enabled:true}};
 const state = simulate([owner,pr(659,'dependencies-queued')],{head653:failed,head659:clean});
 assert.equal(state.prs[0].autoMergeRequest,null);
 assert.deepEqual(state.prs[1].labels.map(l=>l.name),['dependencies-preparing']);
 const disable = state.calls.findIndex(a=>a.includes('--disable-auto'));
 const release = state.calls.findIndex(a=>a.includes('--remove-label') && a.includes('dependencies-active'));
 assert.ok(disable >= 0 && disable < release);
 assert.equal(state.calls.some(a=>a.includes('--auto')),false);
});

test('CLI keeps a running comparison in place without merging or advancing', () => {
 const state = simulate([pr(653,'dependencies-active'),pr(659,'dependencies-queued')],
 {head653:{checkRuns:[{id:3,name:'build-output-diff',status:'in_progress'}],statuses:[]},head659:clean});
 assert.ok(state.prs[0].labels.some(l=>l.name==='dependencies-active'));
 assert.deepEqual(state.prs[1].labels.map(l=>l.name),['dependencies-queued']);
 assert.equal(state.calls.some(a=>a.includes('--auto')),false);
});
