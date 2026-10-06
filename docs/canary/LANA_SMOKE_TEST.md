# CaaS logging smoke test

This POC answers one question: can we find a real CaaS browser event in Splunk?
It is a separate test from moving release tags and rolling back. It does not
split visitor traffic, automatically roll back, or measure production error rates.

## What this change does

On a visit with `?caas_log_poc=smoke-<run-label>`, and only while OneTrust analytics
group `C0002` is active, each collection attempts these messages:

- `collection_started`: the collection is starting its card request.
- `collection_ready`: card processing finished, including a card count. An empty
  response reports zero. This does **not** prove that cards painted correctly.
- `collection_failed`: loading/processing failed after any configured fallback.
  A primary request that fails but succeeds on fallback reports ready, not failed.

Use a label such as `smoke-20261008-a1`. After `smoke-`, use 1–40 letters,
digits, underscores, or hyphens. Do not use names, emails, or other private data.
Messages include the fixed marker `caas_lana_poc_v1`, the label, a page-local
collection number, event name, and optional card count. No page URL, card contents,
or error text is added. Fetch omits cookies and referrer; the receiving service
still sees ordinary connection metadata. No new identifiers are stored.

Each event is attempted once per collection; the whole bundle has a limit of 12
attempts per page load. Logging errors are ignored and never retried. Consent is
checked for every event. Events missed before consent are not replayed: accept
analytics in the normal consent UI, then reload. There is no consent bypass.

This uses the same GET query protocol as
[Milo's LANA client](https://github.com/adobecom/milo/blob/main/libs/utils/lana.js),
with client `chimera`, explicit type `e`, and 100% sampling for these opt-in
attempts. It sends to the production LANA endpoint even on a test page. Existing
CaaS logging is unchanged. An opaque fetch response does not confirm delivery.

## Run it on the second test day

1. Load a controlled collection page using the build from this PR. Record its
   bundle URL and commit/release, plus the previous bundle to restore. The marker
   identifies this POC, not a release version; verify the actual bundle in Network.
2. Open browser developer tools, enable Network logging, and disable browser
   cache for the test. First visit without the query parameter: no request with
   `caas_lana_poc_v1` should appear (existing LANA logs may still appear).
3. Accept analytics through the page's normal consent UI. Add
   `caas_log_poc=smoke-20261008-a1` to the URL and reload. Use `&` if the URL
   already has a query. Scroll to the collection if it lazy loads.
4. Filter Network for `/lana/ll`. Inspect `m` in the query. Expect started then
   ready, with the same run and collection number. Check the cards visually too.
5. In Splunk, select the LANA app, set a recent time range, and search:

   ```spl
   index=lana_prod "caas_lana_poc_v1" "smoke-20261008-a1"
   | table _time _raw
   ```

   Inspect the raw message for the matching event/run. Do not assume JSON fields
   are automatically extracted. If nothing appears, expand the time range and
   verify the index, permissions, client allowlist, and ingestion delay. Browser
   attempts alone do not pass this test. Missing logs are inconclusive, not success.
6. On this browser only, block the collection's primary **and fallback** card
   request URLs with developer tools. Do not block LANA. Use a fresh run label
   and reload. Expect started then failed in both Network and Splunk. Unblock
   the card URLs and confirm that another fresh run reports ready.
7. Restore the previous build through the normal release/test-page process and
   reload. Verify that Network serves the old artifact and the cards still work.
   If that build lacks the POC, new POC messages should stop. Old Splunk records
   remain; use timestamps and labels to distinguish them. Record how long it
   takes before a fresh browser receives the restored artifact.

Use the separately agreed release window/change process if changing production
release tags. This PR does not deploy anything or extend an existing window.

## Evidence to keep

Record the build/commit, test page, run label, start/end times, Network screenshot,
matching Splunk records, visible card outcome, and rollback artifact verification.
Pass only after both successful loading and the controlled failure are visible in
Splunk. Local automated tests mock the network; they cannot prove LANA ingestion,
Splunk permissions, CDN propagation, or live rollback.
