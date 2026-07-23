# CaaS Mount Catalog (WIP)

Local, deterministic "how to mount each CaaS feature" catalog for the feature-QA back-test (Phase 1: prove the scenario mounted before diffing old-vs-new).

- `mount-catalog.json` — 45 verified entries. Each: `config` (toggle), optional `cardPatch` (card-data JSON to force a feature), `expect.selector` (marker that proves it mounted).
- `verify-catalog.mjs` — self-test: reads the catalog, renders each entry on the local `index.html` harness (served from a built CaaS clone), confirms the marker appears. Run in chunks: `node verify-catalog.mjs <start> <count>` with a threaded http server on :8899. NOTE: paths are hardcoded to the mini (WIP).

Verified 45/45. Not yet covered: logo, badge (backend/card-data driven), custom-card (skipped). Injection today = edit mock JSON + repoint endpoint; next step is a `window._qa = {config, cardPatch}` hook read before load.
