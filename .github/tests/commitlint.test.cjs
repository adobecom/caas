const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');
const load = require('@commitlint/load').default;
const lint = require('@commitlint/lint').default;

// Resolve the inherited rules and parser, just as the PR title linter does.
const config = load({}, { cwd: path.resolve(__dirname, '../..') });

async function lintTitle(title) {
    const resolved = await config;
    return lint(title, resolved.rules, {
        plugins: resolved.plugins,
        parserOpts: resolved.parserPreset.parserOpts,
        defaultIgnores: resolved.defaultIgnores,
    });
}

for (const scope of ['mwpw-123', 'MWPW-123', 'Mwpw-123', 'mWpW-123']) {
    test(`accepts Jira scope ${scope}`, async () => {
        const result = await lintTitle(`fix(${scope}): accept jira key`);
        assert.equal(result.valid, true, JSON.stringify(result.errors));
    });
}

for (const scope of ['OTHER-123', 'MWPW-', 'MWPW-abc', 'MWPW-123abc', 'MWPW-123/other', ' MWPW-123']) {
    test(`rejects invalid Jira scope ${JSON.stringify(scope)}`, async () => {
        const result = await lintTitle(`fix(${scope}): accept jira key`);
        assert.equal(result.valid, false);
        assert.ok(result.errors.some(error => error.name === 'jira-ticket-in-scope'));
    });
}

for (const title of ['fix: missing scope', 'fix(MWPW-123)', 'unknown(MWPW-123): invalid type', 'fix(MWPW-123):']) {
    test(`rejects malformed title ${JSON.stringify(title)}`, async () => {
        assert.equal((await lintTitle(title)).valid, false);
    });
}
