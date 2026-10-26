# Telemetry trial plan

Updated October 26, 2026. This records implementation and the remaining verification plan
for [PR #654](https://github.com/adobecom/caas/pull/654), not a record of completed
new tests or authorization for another production rollout.

## Next milestone: test one browser before changing normal traffic

Publish a new immutable trial version at its own asset path. Open a controlled
page with `caasver` selecting that version and force diagnostic logging for that
visit. Test successful loading and browser-only failures, then find their records
in Splunk. Keep `stable`, `0`, and `beta` unchanged.

Example URL shape, not an existing deployed version:

```text
https://<test-page>?caasver=<trial-version>&caas_log_poc=smoke-<unique-run>
```

`caasver` selects library files; it does not publish those files or enable logging.
`caas_log_poc` forces logging in the loaded diagnostic build with `mode=test` and
`sampleRate=100`. It does not change sampling for other visits. Keep these test
records separate from sampled traffic.

First verify that the version-only publishing route does not update any release
alias and cannot be picked up unintentionally by the automatic beta job. Do not
use the ordinary pin/deploy job as an assumed upload-only operation. A GitHub tag
or release asset alone does not mean the Adobe.com version path exists.

Verify JS, CSS and required React assets, full hashes, the actual browser network
URLs, embedded build/version and emitted test mode. A query parameter alone is
not proof the correct build loaded; hosts can also rewrite/remove parameters.

## What exists and what still needs implementation

| Area | Current PR | Next change or proof |
| --- | --- | --- |
| Sampling | Validated build setting, default 0%; forced test visits use 100% | Publish and verify a separate version |
| Correlation | Page, collection, config and request IDs | Verify all test results reconstruct the right page/collection |
| Outcomes | Started, ready, React-rendered, DOM card counts, empty, fallback and failed | Prove these records in live Splunk |
| Errors | HTTP, network, parse, processing and scoped runtime errors | Improve safe request detail and prove each supported path |
| Config | Bounded sanitized snapshots, reused within a page | Reduce repeated volume while retaining reproducible context |
| Browser tests | Built-bundle success, HTTP/fallback failure, multiple collections and consent cases; LANA stubbed | Expand controlled failures, then separately prove real ingestion |
| Live evidence | October 14 sampled records reached Splunk and rollback completed | Exact new-build query-param proof before another broad rollout |
| Trial automation | Existing release build workflows | Proposed label/manual triggers; no new trigger or merge gate installed |

## Build control

Implemented one validated diagnostic sample-rate input:
`CAAS_DIAGNOSTIC_SAMPLE_RATE`, from 0 to 100. Default to 0 for the new detailed
diagnostics in normal builds. Preserve existing ordinary LANA logging separately.
Both pulse selection and detailed records must use the same configured rate.
Forced test mode should work even when the organic diagnostic rate is 0.

Build selected source into a new immutable trial tag/package. Record the source
SHA, sample rate and hashes. Never move an old tag or replace a previously tested
release asset. An older source tag must contain the telemetry/build support before
it can simply be rebuilt with the setting.

Possible controls for the same build workflow:

- PR: a `telemetry-trial` label requests a trial package. A required check can
  block merging while the label is present, if that policy is installed.
- Existing version: a manual workflow accepts a source tag and sample rate; a
  link in release notes makes it discoverable. GitHub releases have no PR-style
  custom labels.
- Normal main build: diagnostics default to 0. A PR label does not automatically
  carry a build setting into main.

These controls create packages, not production deployments. Removing a label or
rolling back does not alter already-loaded code in open tabs. A hard logging
deadline would need a separately implemented expiry.

## Check cards on the page

After a collection starts and receives usable data, check its own card elements:
they exist, have nonzero dimensions and are not hidden by relevant styles or
ancestors. Record expected/observed card counts and the collection ID. Avoid
treating unrelated cards elsewhere on the page as success.

Keep the existing React lifecycle signal distinct from the new DOM check. DOM
checks are stronger evidence, but do not prove every image painted, that a card
was unobscured, or that a person saw it.

Do not require viewport entry for the first version. A person may not scroll and
a lazy collection may never initialize. A collection that never started is not
automatically a failure. A started collection with no final record is unknown.
An empty API result is a separate outcome, not automatically an error.

## Prove errors are detected

Use a test browser's request interception or local fixtures. Never inject errors
for a percentage of real visitors or add a public failure switch to the bundle.
Keep failure controls in the test harness.

| Controlled case | What to verify |
| --- | --- |
| Normal cards | API data, DOM cards, linked success records |
| Empty result | Explicit empty outcome, no fabricated rendering failure |
| HTTP 503 | HTTP status/category; primary/fallback behavior |
| Network rejection | Network category; no invented HTTP status |
| HTTP 200 with invalid JSON | Parse category, safe request details |
| One of two collections fails | Correct collection/request IDs; other collection still works |
| Cards hidden in test DOM | DOM check does not report displayed cards |
| Controlled rendering error | Appropriate error signal; no success inferred from ready alone |
| Missing/broken consent API | Accurate diagnostic state, no invented enabled value |
| LANA transport blocked | Cards still function; missing delivery is unknown |

CI tests stub LANA and assert the emitted records without sending to production.
A separate authorized ingestion check uses the real transport with a unique smoke
label. Search for the exact build/run, capture the pageVisitId, and verify linked
context/outcomes and request details. Wait for ingestion; a sent request or an
opaque response alone is not proof Splunk stored it.

Keep page URL, collection/config reference, request ID, status, timing and error
class. Add allowlisted request parameters where needed to reproduce the failure;
do not log credentials, arbitrary query values, raw bodies or user-entered text.

## Queries and the release report

Continue using the existing Rundeck Splunk query job. Direct API/MCP integration
is optional follow-up, not a dependency for proving this PR:

https://rundeck.wcmsops.adobe.com/project/global/job/show/f8370b68-5325-42e5-9813-3cb0ffd2eecb

Save bounded queries for build/run, outcomes and failure context. The AI-assisted
review can investigate unusual results and compare previous evidence; consistent
queries/checks keep the review repeatable. Do not invent a baseline from a version
without equivalent instrumentation.

Report:

- Exact build, sample rate, test/exposure window and query cutoff.
- Sampled page starts, distinct started collections and their matched outcomes:
  cards displayed, empty, failed or unknown. Separate attempts/retries.
- Failed API calls by HTTP/network/parse/processing category, with page,
  collection, safe request detail and browser; distinguish recovered fallbacks.
- Browser and site-market breakdown. A URL locale is not physical visitor country.
- Request/render timings, log volume and missing/capped data; exclude forced tests
  and identify automation where possible.
- Evidence-based assessment and next action, plus restoration proof after any
  later broad trial. Zero captured errors is not proof every page worked.

## Acceptance before another broad trial

- [x] Implement and test the shared build rate/default-off behavior.
- [x] Implement DOM/empty outcomes and safe failed-request details.
- [ ] Reduce config volume without losing failure context.
- [ ] Pass unit, coverage, build, lint and controlled browser tests for the exact SHA.
- [ ] Publish version-only assets with alias/beta isolation verified.
- [ ] Load that version through `caasver`; prove success and expected failures in Splunk.
- [ ] Save test IDs, queries, output, hashes and a short assessment.
- [ ] Only then plan a separately authorized broad trial, CMR and rollback window.

October 14 historical evidence: [trial query](https://rundeck.wcmsops.adobe.com/execution/show/2776655#output),
[stable restoration](https://rundeck.wcmsops.adobe.com/execution/show/2776660#output),
[beta restoration](https://rundeck.wcmsops.adobe.com/execution/show/2776664#output).
The new checks above are not yet proved by those older executions.

## October 26 implementation evidence

`CAAS_DIAGNOSTIC_SAMPLE_RATE=10 npm run build` embeds 10%; omission embeds 0%.
The point-release workflow exposes this input. Use a NEW version, never replace
a previously tested asset. The existing manual asset rebuild is not a safe
separate-version mechanism. Label automation is still a follow-up.

The DOM probe runs once per collection after loaded cards commit (100ms delay).
It counts card nodes scoped to that collection, nonzero dimensions, and hidden
styles on cards/ancestors. It reports `present`, `hidden`, `missing` or `unknown`;
this is a snapshot, not proof of viewport exposure, image loading or no overlay.
An empty API payload reports `collection_empty`. Request failures now carry their
own sanitized endpoint and primary/fallback source, plus existing category/status.

Local verification: 999 unit tests with coverage; 11 real Chrome browser cases
using the built minified bundle. Cases include default-off, forced test logging,
visible/hidden cards, empty data, HTTP 503, invalid JSON, network rejection,
two collections, consent unavailable/disabled and blocked logging transport.
Failure controls exist only in fixtures. LANA is intercepted in these tests;
these results do not claim real Splunk delivery. Controlled rendering exceptions
and live query-param ingestion still need separate verification.
