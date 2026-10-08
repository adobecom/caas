# Correlated CaaS release telemetry

## One sampled visit, several related records

One decision selects 1% of analytics-consented page visits. Selection and IDs are
shared across CaaS bundles on the same window using a Symbol-keyed in-memory
state. No cookies, local storage or cross-page visitor IDs are created. A fresh
page gets a fresh random 128-bit pageVisitId. Embedded frames have separate IDs.
Consent (OneTrust C0002) is rechecked before each transmission. Events missed
before consent are not replayed.

Use `?caas_log_poc=smoke-<label>` for controlled tests (1–40 letters, digits,
underscores or hyphens after smoke-). This still requires consent. Test events
have mode=test and sampleRate=100. Normal selected visits have mode=sample and
sampleRate=1. Do not include test records in production comparisons.

All records contain marker=caas_telemetry_v2, pageVisitId, release, build,
mode, sampleRate and event. The release and commit are baked into the loaded
bundle. Release workflows supply RELEASE_TAG, so cached bundles identify their
actual version rather than the current stable alias. Untagged builds use the
existing webpack version fallback plus their exact commit.

## Records

- collection_context: collectionId, configId, page (origin/path), browser user
  agent. Two collections on the same visit have different collectionIds even
  when their settings are identical.
- config_snapshot: configId, snapshotKind=collection_input, status, character
  count and totalParts. Identical sanitized snapshots are sent once per page.
- config_part: configId, zero-based part, totalParts, data. Sort by part,
  concatenate data and JSON.parse to reconstruct the sanitized input config.
  Do not treat missing parts as a complete snapshot.
- collection_started / collection_ready / collection_rendered: collectionId,
  configId, elapsed milliseconds from first load, and cardCount on ready/rendered.
  Rendered means React committed loaded card state, not that all images painted.
  Empty results report ready with zero, without promising a render event.
- request_started: collectionId, configId, requestId, endpoint origin/path and
  source=primary/fallback. Request IDs are local to each collection.
- request_failed: the same IDs, request duration, error.kind and HTTP status
  where available. Kinds: http, network, parse, processing. A network rejection
  does not distinguish offline/CORS/blocking. Overlapping requests retain their
  own IDs and timings.
- collection_fallback / collection_failed: collection-level outcome. Failure
  occurs after fallback is exhausted. Elapsed time includes the fallback.
- runtime_error / unhandled_rejection: pageVisitId, collectionId=null,
  configId=null, allowlisted error kind and sanitized source; line/column when
  available. Only errors explicitly attributed to the loaded CaaS bundle count.
  They are not attributed to an arbitrary collection. No raw message or stack.

The snapshot is the input config used when the mounted collection first reports,
not a dump of live UI state. Defaults are determined by the recorded build;
user-entered searches and subsequent filter interactions are not captured.
Credentials/headers/visitor fields and email-like values are redacted. URLs lose
credentials/fragments. Page/request URLs lose queries. Config URLs retain only
allowlisted public query values (locale, tags, limits, sorting and similar);
other query values are replaced with [removed]. Redacted input is not an exact
replay of private/personalized state. No console interception or card contents.

## Size and traffic

GET to production https://www.adobe.com/lana/ll remains the transport. Each JSON
message is below 1,800 UTF-8 bytes. Snapshots are split into 400-character ASCII
pieces (Unicode is escaped without changing its decoded value).

Limits per page: eight collections, 64 config pieces, 96 other records. Each
collection has eight lifecycle/request events. Collection/event budget exhaustion
produces telemetry_limit; oversized snapshots (>12,000 escaped characters) or
exhausted config budget produce config_snapshot status=omitted, reason=size_budget.
Config traffic cannot consume the separate outcome budget. These are diagnostic
samples, not exact traffic or failure-rate accounting. Network loss can still
lose records; there are no retries, and logging failure never fails the cards.

A successful collection normally sends context + snapshot header + N config
pieces + started + request_started + ready + rendered: N+6 records. Identical
configs on a page reuse the snapshot. This is more traffic than the earlier
three-event POC. Measure real volume/bytes during the window before increasing
sampling. Absolute maximum is 160 attempts per page, not a global quota.

## Verify before merge and during the release window

Run Jest with coverage, build, lint and browser integration tests:
`npx wdio run wdio.conf.js --spec e2e-tests/specs/lana-telemetry.e2e.js`.
The suite serves the actual local bundle and fixture cards. LANA is stubbed so CI
sends no synthetic production records. It tests successful rendering despite
blocked logging, failed primary/fallback requests, absent consent, two collections
on one page and reconstructing their snapshots.

For a real ingestion check, open a controlled page with this build, consent and
a unique smoke label. Verify successful cards and a deliberately failing second
collection. Find the label in Splunk, then search the returned pageVisitId:

```spl
index=lana_prod "caas_telemetry_v2" "PASTE_PAGE_VISIT_ID"
| table _time l_message
```

One search retrieves all related events; no database join is needed. Narrow by
collectionId to inspect that collection's results, then configId to retrieve its
snapshot. Use the part numbers, not arrival order, when reconstructing config.
Network concurrency can deliver started after ready. Inspect escaped l_message
before choosing JSON extraction syntax; do not assume automatic field extraction.

Record build/hash, test page, visit ID, config completeness, browser outcomes,
matching Splunk results and observed event volume. An opaque fetch response alone
is not ingestion proof. Browser consent/CSP and delivery on real sites still need
verification in the agreed release window. Version 0.68.42 lacks these records;
its silence is not evidence of better health. Comparable measurements need the
same instrumentation in both versions. No automatic promotion or rollback.
