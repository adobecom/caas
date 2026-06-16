#!/usr/bin/env node
/**
 * Walks a qa-audit results directory and builds a developer-friendly
 * markdown issue body.
 *
 * Two-stage pipeline:
 *   1. Parse per-scenario logs into a structured findings JSON.
 *   2. Send findings to an LLM proxy for narrative rewrite
 *      so the issue reads like a senior QA wrote it, not like a robot
 *      dumped its tool-call trace.
 *
 * If the LLM call fails (proxy unavailable, token expired, etc) the script
 * falls back to a structured-but-not-prettified format. The issue still
 * posts; it just looks more raw.
 *
 * Usage:  node aggregate-report.mjs <results-dir> > report.md
 *
 * Env (all required for narrative rewrite; absence triggers fallback):
 *   IMS_ACCESS_TOKEN  - bearer token for the LLM proxy
 *   PROXY_URL         - LLM proxy endpoint URL (no default; never hardcoded)
 *   MODEL             - model name to request from the proxy
 *   VERDICT_SIDECAR   - optional; default /tmp/qa-audit-verdict.txt
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import { spawnSync } from 'child_process';

const PROXY_URL = process.env.PROXY_URL || '';
const MODEL = process.env.MODEL || '';
const TOKEN = process.env.IMS_ACCESS_TOKEN || '';
const VERDICT_SIDECAR = process.env.VERDICT_SIDECAR || '/tmp/qa-audit-verdict.txt';

const resultsDir = process.argv[2];
if (!resultsDir || !existsSync(resultsDir)) {
    console.error('usage: aggregate-report.mjs <results-dir>');
    process.exit(1);
}

// ---------------------------------------------------------------------------
// Stage 1: parse per-scenario logs into structured findings
// ---------------------------------------------------------------------------

const summaryPath = join(resultsDir, 'SUMMARY.txt');
const summary = existsSync(summaryPath) ? readFileSync(summaryPath, 'utf8') : '';

function summaryField(name) {
    const m = summary.match(new RegExp('^' + name + ':\\s*(.+)$', 'm'));
    return m ? m[1].trim() : '';
}

const caasver = summaryField('caasver');
const baseUrl = summaryField('base_url');
const startedAt = summaryField('started');
const totalTime = summaryField('total');

const logs = readdirSync(resultsDir).filter((f) => f.endsWith('.log')).sort();
const SEP = '='.repeat(60);

const scenarios = logs.map((filename) => {
    const path = join(resultsDir, filename);
    const text = readFileSync(path, 'utf8');
    const name = basename(filename, '.log');

    const verdictMatch = text.match(/\[(PASS|FAIL|FAIL_INCOMPLETE)\]/);
    const verdict = verdictMatch ? verdictMatch[1] : 'NO_VERDICT';

    const turnsCount = (text.match(/^Turn \d+/gm) || []).length;

    // The agent's final report sits between SEP lines. Pick the longest chunk.
    const parts = text.split(SEP);
    let report = '(no report produced)';
    let longest = '';
    for (const p of parts) {
        if (p.length > longest.length) longest = p;
    }
    if (longest.length > 50) report = longest.trim();

    return { name, verdict, turnsCount, report };
});

const passCount = scenarios.filter((s) => s.verdict === 'PASS').length;
const failCount = scenarios.filter((s) => s.verdict === 'FAIL').length;
const incompleteCount = scenarios.filter(
    (s) => s.verdict === 'FAIL_INCOMPLETE' || s.verdict === 'NO_VERDICT',
).length;
const overall = failCount > 0 || incompleteCount > 0 ? 'FAIL' : 'PASS';

// Write verdict sidecar IMMEDIATELY (before the LLM call) so the workflow
// always has a verdict, even if narrative rewrite fails or times out.
try {
    writeFileSync(VERDICT_SIDECAR, overall);
} catch (e) {
    process.stderr.write(`[aggregate] failed to write verdict sidecar at ${VERDICT_SIDECAR}: ${e.message}\n`);
}

// ---------------------------------------------------------------------------
// Stage 2: LLM narrative rewrite (with fallback)
// ---------------------------------------------------------------------------

function rewriteWithLLM() {
    if (!TOKEN || !PROXY_URL || !MODEL) {
        const missing = [
            !TOKEN && 'IMS_ACCESS_TOKEN',
            !PROXY_URL && 'PROXY_URL',
            !MODEL && 'MODEL',
        ].filter(Boolean).join(', ');
        process.stderr.write(`[aggregate] env vars not set (${missing}); using fallback format\n`);
        return null;
    }

    const findingsPayload = scenarios.map((s) => ({
        scenario: s.name,
        verdict: s.verdict,
        // Trim the report so we stay well under context limits even with many scenarios.
        report: s.report.slice(0, 6000),
    }));

    const prompt = [
        'You are summarizing automated QA audit findings for a software developer who needs to triage and fix bugs. The QA agent ran a battery of accessibility + visual scenarios against a Customer-as-a-Service (CaaS) page and produced these per-scenario reports.',
        '',
        '**Your task:** rewrite the findings as a clean, developer-friendly GitHub Issue body in markdown. The reader is an engineer on the CaaS team who needs to know WHAT is broken, WHO is affected, and ideally how to fix it. They do not care about implementation details of the QA tool.',
        '',
        '**Structure:**',
        '',
        '1. **One-line headline** in bold at the top stating the result count, e.g. `**3 issues found in caasver=0.45.0**` or `**All checks passed for caasver=0.51.5**`.',
        '',
        '2. **Summary table** (markdown table) showing: scenario, verdict, one-line description of the finding (or "no issues" for PASS rows).',
        '',
        '3. **For each FAILED scenario**, a dedicated `### ` section with:',
        '   - **Issue title** (descriptive, e.g. `### Pagination buttons missing aria-current attribute`)',
        '   - **Impact:** who is affected (sighted users / screen reader users / keyboard-only users / all) and what they experience',
        '   - **What was tested:** 1-2 sentences in plain English',
        '   - **What was found:** concrete evidence from the agent\'s observations, with specific values (selectors, attribute values, counts) where relevant',
        '   - **Suggested fix:** if it\'s obvious from the finding, propose it concretely',
        '',
        '4. **Passing scenarios** at the bottom, a brief bulleted list ("These checks passed: ..."). No detail needed.',
        '',
        '**Tone:** factual, terse, developer-friendly. Like a senior QA engineer writing a bug report, NOT like a robot describing its actions. Active voice.',
        '',
        '**Do NOT include:**',
        '- Turn-by-turn agent traces',
        '- Tool call JSON like `evaluate({code: ...})`',
        '- Internal tool names like `qaMap`, `find_and_show`, `get_interactives`',
        '- Phrases like "The agent observed..." — just state the finding directly',
        '- Speculation; only report what the data shows',
        '',
        'The agent reports may contain raw data (selectors, computed CSS values, JSON snippets). Use these as evidence but RESTATE them in human language. For example, raw input `outlineStyle: "none", boxShadow: "none"` becomes "no native focus indicator is rendered."',
        '',
        '---',
        '',
        '**Per-scenario raw reports (JSON):**',
        '',
        '```json',
        JSON.stringify(findingsPayload, null, 2),
        '```',
        '',
        'Now write the rewritten issue body in markdown. Start directly with the headline, no preamble.',
    ].join('\n');

    const payload = JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
    });

    process.stderr.write(`[aggregate] sending ${payload.length} bytes to LLM proxy for narrative rewrite...\n`);

    const result = spawnSync(
        'curl',
        [
            '-s', '-X', 'POST', PROXY_URL,
            '-H', `Authorization: Bearer ${TOKEN}`,
            '-H', 'Content-Type: application/json',
            '-H', 'anthropic-version: 2023-06-01',
            '--max-time', '90',
            '--data-binary', '@-',
        ],
        { input: payload, encoding: 'utf8', timeout: 95_000 },
    );

    if (result.error || !result.stdout) {
        process.stderr.write(`[aggregate] LLM call failed: ${result.error?.message || 'empty body'}; using fallback\n`);
        return null;
    }

    let parsed;
    try {
        parsed = JSON.parse(result.stdout);
    } catch (e) {
        process.stderr.write(`[aggregate] LLM response parse error: ${e.message}; using fallback\n`);
        return null;
    }

    if (parsed.error) {
        process.stderr.write(`[aggregate] LLM API error: ${JSON.stringify(parsed.error).slice(0, 200)}; using fallback\n`);
        return null;
    }

    const text = (parsed.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
    if (!text) {
        process.stderr.write('[aggregate] LLM returned no text; using fallback\n');
        return null;
    }

    process.stderr.write(`[aggregate] narrative rewrite ok (${text.length} chars)\n`);
    return text;
}

// ---------------------------------------------------------------------------
// Output assembly
// ---------------------------------------------------------------------------

const verdictTag = (v) =>
    v === 'PASS' ? 'PASS' :
    v === 'FAIL' ? 'FAIL' :
    v === 'FAIL_INCOMPLETE' ? 'INCOMPLETE' :
    'NO_VERDICT';

const narrative = rewriteWithLLM();

const lines = [];

if (narrative) {
    lines.push(narrative.trim());
} else {
    // Fallback: structured-but-not-prettified format.
    lines.push(`# QA Audit Report — caasver=\`${caasver}\` — ${overall}`);
    lines.push('');
    lines.push(`**${overall === 'PASS' ? 'All scenarios passed.' : `${failCount + incompleteCount} of ${scenarios.length} scenarios reported issues.`}**`);
    lines.push('');
    lines.push('## Summary');
    lines.push('');
    lines.push('| Scenario | Verdict | Turns |');
    lines.push('|---|---|---|');
    for (const s of scenarios) {
        lines.push(`| ${s.name} | ${verdictTag(s.verdict)} | ${s.turnsCount} |`);
    }
    lines.push('');
    lines.push('## Per-scenario findings');
    lines.push('');
    for (const s of scenarios) {
        lines.push(`### ${s.name} — ${verdictTag(s.verdict)}`);
        lines.push('');
        lines.push(s.report.slice(0, 4000));
        lines.push('');
    }
}

// Always append run metadata + collapsed raw transcript for power users.
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Run metadata');
lines.push('');
lines.push(`- **Page tested:** \`${baseUrl}?caasver=${caasver}\``);
lines.push(`- **Started:** ${startedAt}`);
lines.push(`- **Total runtime:** ${totalTime}`);
lines.push(`- **Scenarios:** ${passCount} pass · ${failCount} fail · ${incompleteCount} incomplete`);
lines.push(`- **Overall:** ${overall}`);
lines.push('');
lines.push('<details><summary><strong>Raw per-scenario agent transcripts</strong> (for QA-tool debugging — most readers can ignore)</summary>');
lines.push('');
for (const s of scenarios) {
    lines.push(`#### ${s.name} (${verdictTag(s.verdict)}, ${s.turnsCount} turns)`);
    lines.push('');
    lines.push('```');
    lines.push(s.report.slice(0, 6000));
    lines.push('```');
    lines.push('');
}
lines.push('</details>');
lines.push('');
lines.push('<sub>Generated by `.github/workflows/qa-audit.yml`. Full logs + screenshots are attached to the triggering workflow run as artifacts.</sub>');

console.log(lines.join('\n'));
