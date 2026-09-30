# Global references: 70 targeted Sonar findings

Ticket: [MWPW-208479](https://jira.corp.adobe.com/browse/MWPW-208479).
Baseline: `fb6b1338` (`main`, version 0.68.35).
Source: supplied `caas-sonar.json`, SHA-256
`0700b7d5790b528d1fa372373fd38ecfc6b9b480d9bb904816fe1ec0318060db`.
Exact issue keys are in `globalthis-findings.csv`.

## Change

Replace the 70 remaining production S7764 occurrences in 12 files: 68 `window`
references become `globalThis`, one `typeof window` browser guard becomes
`typeof globalThis.window`, and one `global.CQ` reference becomes `globalThis.CQ`.
The 7 test-helper occurrences in PR 637 are outside this batch.

Browser properties and service contracts stay the same. Consumers can still
provide `window.lana`, `window.dexter`, `window.branch`, Adobe privacy and
analytics objects. No API signatures, tracking attributes, or control flow
are refactored.

The configured Browserslist still includes older engines without native
`globalThis` and Babel has `useBuiltIns: false`. A small, non-enumerable alias
is installed only when needed in the existing first-loaded polyfills module.
It does not replace native `globalThis` or add dependencies. Direct consumers
of individual source modules must provide the same standard global themselves;
the shipped application entry includes the fallback.

## Validation before PR creation

- Clean `npm ci`, builds with Node 16.13.1 on baseline and changed code.
- Baseline: 73 suites, 921 tests pass. Changed: 77 suites, 932 tests pass.
- All coverage thresholds pass. Changed statement/branch/function/line
  coverage: 97.62% / 82.97% / 96.29% / 97.75%.
- Lint: zero errors, three existing `react/no-danger` warnings in CardContent.
- Added checks cover non-window QA overrides, CQ author mode, privacy consent,
  analytics payloads, consumer-owned modal focus-trap reuse, and the fallback.
- Production bundle boots in a DOM test environment with both native
  `globalThis` and an emulated missing `globalThis`.

## Production output comparison

After removing only the existing build-timestamp banner:

| File | Result | Baseline bytes | Changed bytes |
| --- | --- | ---: | ---: |
| main.js | CHANGED | 920208 | 920885 |
| main.min.js | CHANGED | 377572 | 378021 |
| app.css | NO_CHANGE | 241405 | 241405 |

Normalized SHA-256 hashes are in `globalthis-build.json`. The JavaScript diff
contains the global-reference substitutions, associated webpack wrapper
change for `watch.js`, and the compatibility fallback. Diagnostic source maps
are not part of the zero-diff criterion. This PR is **not** a zero-output-diff PR.

The advisory workflow now triggers on source and build configuration changes,
matching the trigger expansion in PR 637. Its verdict remains advisory;
`CHANGED` is expected and does not imply a failed build.

## Still required

Review the actual final-commit GitHub checks and perform manual review before
merge. A fresh Sonar scan must confirm closure of the 70 recorded findings;
local edits and unit tests cannot establish server-side closure. The repository
scan is controlled by `SONAR_ENABLED`, and the Sonar server was unreachable
while preparing this change. The existing browser E2E and AI checks have
coverage limits and are not a guarantee of unchanged behavior in every host.
