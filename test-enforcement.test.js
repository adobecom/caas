/*
 * Self-test for test-enforcement.js.
 *
 * Plain Node with zero dependencies and no test framework, so it runs on
 * the Node 16 runner used by the check-test-requirements job. Mocks the
 * github/context/core surface the real workflow provides and asserts the
 * verdict for every title/file combination the rules distinguish.
 */
const enforce = require('./test-enforcement.js');

const run = async (title, files) => {
    let failed = null;
    const core = { info: () => {}, setFailed: (message) => { failed = message; } };
    const github = { rest: { pulls: { listFiles: async () => ({ data: files }) } } };
    const context = {
        repo: { owner: 'x', repo: 'y' },
        issue: { number: 1 },
        payload: { pull_request: { title } },
    };
    await enforce({ github, context, core });
    return failed || 'PASS';
};

const added = (filename) => ({ filename, status: 'added' });
const modified = (filename) => ({ filename, status: 'modified' });

const COMPONENT = 'react/src/js/components/Consonant/Foo.jsx';
const SPEC = 'react/src/js/components/Consonant/__tests__/Foo.spec.js';
const E2E = 'e2e-tests/specs/foo.e2e.js';

const CASES = [
    ['feat(mwpw-1): x', [added(COMPONENT)], 'integration tests',
        'feat + new component + no tests -> needs integration tests'],
    ['feat(mwpw-1): x', [added(COMPONENT), added(E2E)], 'unit tests',
        'feat + new component + e2e only -> needs unit tests'],
    ['feat(mwpw-1): x', [added(COMPONENT), added(SPEC)], 'integration tests',
        'feat + new component + spec only -> needs integration tests'],
    ['feat(mwpw-1): x', [added(COMPONENT), added(E2E), added(SPEC)], 'PASS',
        'feat + new component + both tests -> pass'],
    ['feat: x', [added(COMPONENT), added(E2E), added(SPEC)], 'PASS',
        'bare feat title still parses and passes with both tests'],
    ['feat: x', [added(COMPONENT)], 'integration tests',
        'bare feat title still enforced without tests'],
    ['fix(mwpw-1): x', [added(COMPONENT)], 'PASS',
        'fix type is exempt (rule is feat-only)'],
    ['chore(mwpw-1): x', [added(COMPONENT)], 'PASS',
        'chore type is exempt'],
    ['feat(mwpw-1): x', [modified(COMPONENT)], 'PASS',
        'modified (not added) component is exempt'],
    ['feat(mwpw-1): x', [added('scripts/build.js')], 'PASS',
        'non-component file is exempt'],
    ['Feat(MWPW-1): x', [added(COMPONENT)], 'integration tests',
        'type comparison is case-insensitive'],
];

(async () => {
    let failures = 0;
    for (const [title, files, expected, label] of CASES) {
        const got = await run(title, files);
        const ok = expected === 'PASS' ? got === 'PASS' : got.includes(expected);
        console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `  (expected "${expected}", got "${got}")`}`);
        if (!ok) failures += 1;
    }
    if (failures) {
        console.error(`\n${failures} enforcement self-test(s) failed`);
        process.exit(1);
    }
    console.log(`\nAll ${CASES.length} enforcement self-tests passed`);
})();
