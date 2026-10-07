# CaaS sampled release telemetry

Normal visits with OneTrust analytics group C0002 active are sampled at 1%.
The bundle makes one random decision per page load, shared by all collections.
No cookie or persistent visitor identifier is created. Consent is checked for
 every event; events before consent are not replayed. Reload after consenting.

For a controlled test, use `?caas_log_poc=smoke-<label>` with 1–40 letters,
digits, underscores or hyphens after `smoke-`. This enables all test attempts,
still requiring consent. Test records have `mode=test`; exclude them from
production comparisons with `mode=sample`. Never put personal data in labels.

## What is reported

All records use marker `caas_telemetry_v1`, client `chimera`, and include release,
build commit, mode, sampleRate, event and (for collection events) a page-local
collection number. The release is baked into the bundle, not fetched from the
current stable alias: a cached old bundle identifies its actual build.
Release artifact workflows explicitly supply RELEASE_TAG. Untagged development
builds use the existing webpack version fallback plus the exact build commit.

- collection_started: first card fetch begins.
- collection_fallback: primary loading/processing failed; fallback is attempted.
- collection_ready: card data processed, with cardCount (including zero).
- collection_rendered: React committed loaded card state, with cardCount.
  This is not a guarantee that images loaded or every card is visible.
- collection_failed: loading/processing failed after any fallback.
- runtime_error / unhandled_rejection: an uncaught error explicitly identifies
  the loaded CaaS bundle URL. Errors caught elsewhere and errors before telemetry
  starts are not captured. These events have no collection attribution.

Duration is milliseconds since first fetch, including fallback. We do not send
raw error text, stacks, console arguments, page URLs, card content or identifiers.
We do not intercept console.log/error or collect other scripts' failures.

Events are deduplicated per collection; runtime categories once per bundle.
There is a hard cap of 12 attempts per bundle/page load, no retries, and logging
failure cannot fail card loading. This is not a global ingestion quota. Pages
with many collections may exhaust the cap and omit later outcomes; counts are
sampled diagnostics, not an exact site-wide failure rate. Browser blocking,
consent timing, navigation and network loss can also omit outcomes.

The client already chooses the 1% sample. LANA's `s=1` describes that sample;
test records use `s=100`. Requests go to production LANA, including from local
controlled tests. An opaque fetch response alone is not delivery proof.

## Volume planning

A successful one-collection sampled visit normally sends three events:
started, ready, rendered. For 100,000 consented visits/hour, 1% sampling means
roughly 3,000 events/hour. Multiply by collections and allow for fallback/error
events, subject to the page cap. This is an estimate, not measured traffic or a
confirmed ingestion allowance. Record actual event counts and indexed bytes;
do not extrapolate total traffic from older logs with unknown sampling.

## Pre-merge verification

Run Jest with coverage, the production build and the telemetry browser suite:
`npx wdio run wdio.conf.js --spec e2e-tests/specs/lana-telemetry.e2e.js`.
The browser suite serves the actual local bundle and fixture card data, blocks
only LANA transport, and checks success, fallback failure and absent consent.
CI builds the bundle before running the suite. Tests do not submit logs to LANA.

For live ingestion, use a controlled page with this build and a fresh test label.
Check working cards, then fail both card endpoints in that browser and check
failure. Find the exact labels in Splunk via the existing read-only Rundeck job:

```spl
index=lana_prod "caas_telemetry_v1" "smoke-your-label"
| table _time l_client l_message
```

The JSON inside l_message may contain escaped quotes. Inspect a returned record
before choosing extraction syntax. Do not assume automatic JSON extraction.
Record bundle hash/build, label, browser outcome and matching Splunk records.
Then test recovery and confirm no logs without consent. Never enable test mode
in shared production links or use test events to calculate production health.

During the agreed release window, verify the real site's consent/CSP permits
requests, compare sample-mode outcomes by release/build and comparable windows,
and verify restored assets after rollback. Version 0.68.42 lacks this telemetry;
its absence of new-format logs is not evidence that it is healthier. A measured
old-versus-new comparison needs the same instrumentation in both builds.
