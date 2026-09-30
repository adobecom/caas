# Sonar cleanup: first zero-output batch

This change addresses 23 findings from the supplied `caas-sonar.json` snapshot.
A fresh Sonar scan is still needed to confirm closure on the server.

## Scope

- Four independent `if` statements are moved to their own lines. Their execution
  order and independence are preserved.
- Nineteen findings in test helpers are addressed by naming default exports,
  using the Jest jsdom global consistently, renaming a state setter, simplifying
  numeric range calculation, and simplifying mock/empty-component definitions.
- Empty fixture components remain truthy React elements that render no DOM, so
  conditional test paths stay the same.
- The existing build-output comparison workflow also triggers for source and
  build-configuration changes. Its normalization and advisory semantics remain
  unchanged.

## Validation before opening the PR

Compared to `d6193235` with the same dependency installation:

- `scripts/compare-build-output.sh`: **NO_CHANGE** for `main.js` and `app.css`.
- Additional `main.min.js` comparison: identical after banner normalization.
- Baseline and changed code: 73 suites and 921 tests passed, no snapshot updates.
- Coverage unchanged: statements 97.62%, branches 82.92%, functions 96.29%,
  lines 97.75%; all configured thresholds passed.
- Full Consonant ESLint: zero errors, three pre-existing `react/no-danger`
  warnings in untouched CardContent code.
- Workflow YAML parsed and `git diff --check` passed.

Builds used Node 16.13.1; tests used Node 18.20.4. The subsequent main update to
`073192e6` only bumps the release version and changelog. The PR's GitHub
`build-output-diff` status is the authoritative comparison against its actual base.
The zero-diff claim covers production bundles after the existing build-banner
normalization, not diagnostic source maps.

## Findings in this batch

Original export line numbers are retained below; they may move after editing.

| Rule | Source file under `react/src/js/components/Consonant/` | Export line | Issue key |
| --- | --- | ---: | --- |
| javascript:S3972 | `Helpers/eventSort.js` | 263 | `8725c48f-a8b8-44d4-88c2-2c48828f140c` |
| javascript:S3972 | `Helpers/eventSort.js` | 265 | `672d18f9-2542-4ec8-b72e-b2debf0a707a` |
| javascript:S3972 | `Helpers/eventSort.js` | 267 | `28748ab0-bfa4-4d1d-9261-983523450e32` |
| javascript:S3972 | `Helpers/eventSort.js` | 269 | `bc342450-c363-47b2-8ecf-8b5a6c45874a` |
| javascript:S6749 | `Testing/Constants/FilterPanelLeft.js` | 26 | `a425a26f-e472-429d-baa6-26973402c432` |
| javascript:S6749 | `Testing/Constants/FilterPanelLeft.js` | 27 | `aa62a5dc-a39e-4f91-964b-88a4f2aa1127` |
| javascript:S6749 | `Testing/Constants/FilterPanelTop.js` | 32 | `ef3dbf57-17e9-4069-8e9f-309bf571b4d1` |
| javascript:S6749 | `Testing/Constants/FilterPanelTop.js` | 33 | `2adf8166-7464-4679-9529-d1114a6714a8` |
| javascript:S2094 | `Testing/Mocks/intersectionObserver.jsx` | 10 | `3a4b2837-9108-4c6d-82cb-907167dcfbc2` |
| javascript:S7764 | `Testing/Mocks/intersectionObserver.jsx` | 22 | `bfb148ed-3f83-4e9c-800f-365c396402fb` |
| javascript:S7764 | `Testing/Mocks/intersectionObserver.jsx` | 28 | `bd653074-eacc-46cd-b0b5-5319a25cdd9c` |
| javascript:S6754 | `Testing/Utils/ContextProvider.js` | 18 | `7f4b9f8a-ae5a-409d-bfa1-315506bcdf92` |
| javascript:S7726 | `Testing/Utils/JestMocks/mockImage.js` | 1 | `f3525b0e-d83f-45f6-9eec-ec66830562d9` |
| javascript:S7726 | `Testing/Utils/JestMocks/mockIntersectionObserver.js` | 5 | `12a1c3df-73f5-40f2-b7bd-9094a91afb98` |
| javascript:S7764 | `Testing/Utils/JestMocks/mockIntersectionObserver.js` | 22 | `dac1e05f-99f1-4b35-bcca-c056a49789ff` |
| javascript:S7764 | `Testing/Utils/JestMocks/mockIntersectionObserver.js` | 23 | `08e15f6c-1968-4620-844c-cd81d083bc1e` |
| javascript:S7726 | `Testing/Utils/JestMocks/mockLana.js` | 1 | `c28a6789-22ce-4144-8b6f-1b58c6de9ab3` |
| javascript:S7764 | `Testing/Utils/JestMocks/mockLana.js` | 12 | `dd25fd93-ba36-4027-b81b-987711e477cb` |
| javascript:S7726 | `Testing/Utils/JestMocks/mockLocalStorage.js` | 1 | `861da7b5-f2f9-4be2-bd8a-343f2482fa2e` |
| javascript:S7764 | `Testing/Utils/JestMocks/mockLocalStorage.js` | 23 | `97bc36a2-1002-41b8-9b34-47aa02780bf0` |
| javascript:S7764 | `Testing/Utils/JestMocks/mockLocalStorage.js` | 24 | `7ee6742a-412b-407b-b64f-cf5f4eb19f19` |
| javascript:S7766 | `Testing/Utils/Pagination.js` | 8 | `293ce834-29f7-41f3-9bee-7c42aaa1e0fb` |
| javascript:S7726 | `Testing/Utils/Settings.jsx` | 15 | `ca653db0-92d8-4986-81ad-b517bc1b5cda` |
