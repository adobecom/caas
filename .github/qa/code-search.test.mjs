import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { researchCode, searchCode } from './code-search.mjs';

const qaDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(qaDir, '../..');

test('finds exact code and returns a bounded source block', () => {
  const result = searchCode({
    repoRoot,
    query: '<Group',
    searchPath: 'react/src/js/components/Consonant',
    gitBin: process.env.GIT_BIN || 'git',
  });
  assert.ok(result.matches.length > 0);
  assert.ok(result.matches.some(({ file }) => file.endsWith('Cards/CardFooter/CardFooter.jsx')));
  assert.ok(result.matches.every(({ snippet }) => snippet.includes('<Group')));
});

test('returns an empty result for an unknown exact identifier', () => {
  const result = searchCode({
    repoRoot,
    query: 'identifier-that-does-not-exist-in-caas-qa',
    searchPath: 'react/src/js',
    gitBin: process.env.GIT_BIN || 'git',
  });
  assert.deepEqual(result.matches, []);
});

test('opens a tracked source file when the model searches by filename', () => {
  const result = searchCode({
    repoRoot,
    query: 'CardFooter.jsx',
    searchPath: 'react/src/js/components/Consonant/Cards/CardFooter',
    gitBin: process.env.GIT_BIN || 'git',
  });
  assert.equal(result.matches[0].matchType, 'path');
  assert.ok(result.matches[0].file.endsWith('CardFooter.jsx'));
  assert.match(result.matches[0].snippet, /const CardFooter/);
});

test('broad symbol searches prioritize different files and include definitions', () => {
  const result = searchCode({
    repoRoot,
    query: 'extendFooterData',
    searchPath: 'react/src/js/components/Consonant/Cards',
    gitBin: process.env.GIT_BIN || 'git',
  });
  assert.equal(new Set(result.matches.map(({ file }) => file)).size, result.matches.length);
  assert.ok(result.matches.some(({ file, snippet }) => file.endsWith('/Card.jsx') && /function extendFooterData/.test(snippet)));
});

test('rejects paths outside the checkout', () => {
  assert.throws(() => searchCode({
    repoRoot,
    query: 'Group',
    searchPath: '../../',
    gitBin: process.env.GIT_BIN || 'git',
  }), /unsafe search path/);
});

test('runs a bounded model-directed search and returns raw source evidence', async () => {
  const replies = [
    JSON.stringify({
      action: 'search',
      query: '<Group',
      path: 'react/src/js/components/Consonant/Cards/CardFooter',
      why: 'trace the card footer caller',
    }),
    JSON.stringify({
      action: 'done',
      summary: 'CardFooter passes the right footer list to Group.',
      evidence: [],
    }),
  ];
  const prompts = [];
  const result = await researchCode({
    repoRoot,
    taskContext: 'A Group prop must be mapped into injectable card JSON.',
    ask: async (prompt) => {
      prompts.push(prompt);
      return replies.shift();
    },
  });

  assert.equal(result.searches.length, 1);
  assert.match(result.summary, /CardFooter passes/);
  assert.match(result.report, /CardFooter\.jsx/);
  assert.match(prompts[1], /RAW|SEARCH 1/);
});

test('records a rejected model path instead of escaping the checkout', async () => {
  const replies = [
    JSON.stringify({ action: 'search', query: 'secret', path: '../../', why: 'invalid request' }),
    JSON.stringify({ action: 'done', summary: 'The request was rejected.', evidence: [] }),
  ];
  const result = await researchCode({
    repoRoot,
    taskContext: 'Safety check.',
    ask: async () => replies.shift(),
  });

  assert.equal(result.searches.length, 1);
  assert.match(result.searches[0].result.error, /unsafe search path/);
  assert.equal(result.searches[0].result.matches.length, 0);
});
