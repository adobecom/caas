import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_SEARCH_PATH = 'react/src/js';
const DEFAULT_MAX_MATCHES = 6;
const DEFAULT_CONTEXT_LINES = 6;
const MAX_QUERY_LENGTH = 160;
const MAX_TRANSCRIPT_CHARS = 24000;
const EXCLUDED_PATHS = [
  '.git/',
  'node_modules/',
  'dist/',
  'coverage/',
  'package-lock.json',
  'dependencies/',
];

function extractJson(text) {
  const cleaned = String(text).replace(/```(?:json)?/gi, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('no JSON object in research response');
  return JSON.parse(cleaned.slice(start, end + 1));
}

function safeRelativePath(value = DEFAULT_SEARCH_PATH) {
  const normalized = path.posix.normalize(String(value).replaceAll('\\', '/'));
  if (!normalized || normalized === '..' || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
    throw new Error(`unsafe search path: ${value}`);
  }
  return normalized;
}

function isExcluded(filePath) {
  return EXCLUDED_PATHS.some((excluded) => filePath === excluded.replace(/\/$/, '') || filePath.startsWith(excluded));
}

/**
 * Search tracked files in the current PR checkout and return small source blocks
 * around exact matches. The model never receives shell access; it can only choose
 * a fixed-string query and a repository-relative path.
 */
export function searchCode({
  repoRoot,
  query,
  searchPath = DEFAULT_SEARCH_PATH,
  maxMatches = DEFAULT_MAX_MATCHES,
  contextLines = DEFAULT_CONTEXT_LINES,
  gitBin = process.env.GIT_BIN || 'git',
}) {
  if (!repoRoot) throw new Error('repoRoot is required');
  const needle = String(query || '').trim();
  if (needle.length < 2 || needle.length > MAX_QUERY_LENGTH || /[\r\n\0]/.test(needle)) {
    throw new Error('query must be 2-160 characters on one line');
  }
  const relativePath = safeRelativePath(searchPath);
  const limit = Math.max(1, Math.min(Number(maxMatches) || DEFAULT_MAX_MATCHES, 10));
  const context = Math.max(1, Math.min(Number(contextLines) || DEFAULT_CONTEXT_LINES, 12));
  const result = spawnSync(gitBin, [
    'grep', '-n', '-I', '-F', '--full-name', '-e', needle, '--', relativePath,
  ], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
  });

  if (result.error) throw result.error;
  if (result.status !== 0 && result.status !== 1) {
    throw new Error(`git grep failed: ${(result.stderr || '').trim() || `exit ${result.status}`}`);
  }

  const matches = [];
  const seen = new Set();
  for (const line of String(result.stdout || '').split('\n')) {
    const match = line.match(/^(.+?):(\d+):(.*)$/);
    if (!match) continue;
    const [, filePath, lineNumberText] = match;
    if (isExcluded(filePath)) continue;
    const key = `${filePath}:${lineNumberText}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const absolutePath = path.resolve(repoRoot, filePath);
    if (!absolutePath.startsWith(`${path.resolve(repoRoot)}${path.sep}`)) continue;
    let lines;
    try { lines = readFileSync(absolutePath, 'utf8').split('\n'); } catch { continue; }
    const lineNumber = Number(lineNumberText);
    const startLine = Math.max(1, lineNumber - context);
    const endLine = Math.min(lines.length, lineNumber + context);
    const snippet = lines.slice(startLine - 1, endLine)
      .map((sourceLine, index) => `${startLine + index}: ${sourceLine}`)
      .join('\n');
    matches.push({ file: filePath, line: lineNumber, startLine, endLine, snippet });
    if (matches.length >= limit) break;
  }

  return { query: needle, searchPath: relativePath, matches };
}

function formatTranscript(entries) {
  const text = entries.map((entry, index) => {
    const matches = entry.result.matches.length
      ? entry.result.matches.map((match) => `FILE ${match.file}:${match.line}\n${match.snippet}`).join('\n\n')
      : '(no matches)';
    return `SEARCH ${index + 1}: ${entry.query} in ${entry.searchPath}\nWHY: ${entry.why || '(not provided)'}\n${matches}`;
  }).join('\n\n');
  return text.slice(-MAX_TRANSCRIPT_CHARS);
}

/**
 * Give a text-only LLM endpoint an agentic, bounded search loop. `ask` is the
 * existing proxy call. Each response is either another safe search request or a
 * final evidence-backed summary; raw search blocks are returned for the planner.
 */
export async function researchCode({ ask, repoRoot, taskContext, maxSearches = 6 }) {
  if (typeof ask !== 'function') throw new Error('ask is required');
  const transcript = [];
  let summary = '';
  const searchLimit = Math.max(1, Math.min(Number(maxSearches) || 6, 8));

  for (let turn = 0; turn <= searchLimit; turn += 1) {
    const priorResearch = formatTranscript(transcript);
    const raw = await ask(
`You are researching the CURRENT checked-out Adobe CaaS PR source before planning a browser feature test.

Goal: trace the selected/changed unit-test inputs from the tested function or component BACKWARD through its production callers until you reach fields the harness can inject: collection config and/or the chimera-api card JSON. Also identify card styles and config/state conditions that can prevent the target component from rendering.

PR context, changed test/source, and diff:
${String(taskContext || '').slice(0, 22000)}

Research already performed:
${priorResearch || '(none yet)'}

You have one tool: SEARCH_CODE. It performs exact fixed-string search in the current PR checkout and returns source blocks around matches. Search exact component names, JSX tags, prop names, config keys, and callers. Follow the data path; do not guess from naming alone. You must perform at least one search before finishing.

Reply with ONLY one JSON object in one of these forms:
{"action":"search","query":"exact text","path":"react/src/js","why":"what this will establish"}
{"action":"done","summary":"concise traced input path and hidden render conditions","evidence":[{"file":"path","line":123,"fact":"what this line establishes"}]}

Use path "." only when the relevant code may be outside react/src/js. Do not use regex.`, 3000);

    let action;
    try { action = extractJson(raw); } catch (error) {
      summary = `Research response could not be parsed: ${error.message}. Raw: ${String(raw).slice(0, 500)}`;
      break;
    }

    if (action.action === 'done') {
      if (transcript.length === 0) {
        summary = 'Model attempted to finish without searching the current checkout.';
        continue;
      }
      summary = String(action.summary || '').slice(0, 4000);
      if (Array.isArray(action.evidence) && action.evidence.length) {
        summary += `\nEvidence claimed by researcher: ${JSON.stringify(action.evidence).slice(0, 4000)}`;
      }
      break;
    }

    if (action.action !== 'search') {
      summary = `Unsupported research action: ${String(action.action)}`;
      break;
    }
    if (transcript.length >= searchLimit) {
      summary = `Search limit (${searchLimit}) reached; planner must use the raw research below.`;
      break;
    }

    const requestedPath = String(action.path || DEFAULT_SEARCH_PATH);
    let searchPath = requestedPath;
    let result;
    try {
      searchPath = safeRelativePath(requestedPath);
      result = searchCode({ repoRoot, query: action.query, searchPath });
    } catch (error) {
      result = { query: String(action.query || ''), searchPath, matches: [], error: error.message };
    }
    transcript.push({
      query: String(action.query || ''),
      searchPath,
      why: String(action.why || ''),
      result,
    });
  }

  return {
    summary: summary || 'Research ended without a final summary; planner must use the raw searches.',
    searches: transcript,
    report: `RESEARCH SUMMARY\n${summary || '(none)'}\n\nRAW CURRENT-CODE SEARCHES\n${formatTranscript(transcript)}`,
  };
}
