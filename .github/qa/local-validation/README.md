# Visual-diff local validation harness

Reproducible proof that `qa-prompts/visual-diff/version-diff.txt` flags real CaaS regressions while ignoring sub-pixel noise.

## Files

- `index-qa-control.html` — baseline card collection (CaaS default styling, 4px border-radius)
- `index-qa-rounded-major.html` — same collection with the exact CSS introduced by **mwpw-189783** (20px outer radius + inset header). Represents a visible regression.
- `index-qa-rounded-subtle.html` — same collection with border-radius bumped 4px → 5px only. Represents the noise floor the tool should ignore.
- `diff-rounded.mjs` — Playwright + ImageMagick sensitivity scan across fuzz levels 0/1/2/5%.

All three HTML pages load the same `dist/main.min.js` bundle and the same `mock-json/smoke.json` collection, so the only deltas are the inline `<style>` overrides.

## Run

```sh
# 1. From repo root, build the bundle if it isn't already
npm run build

# 2. Serve the repo so the relative dist/ + mock-json/ paths resolve
python3 -m http.server 8765 &

# 3. Sensitivity scan: major regression case (expect FAIL across all fuzz levels)
node .github/qa/local-validation/diff-rounded.mjs \
  http://localhost:8765/.github/qa/local-validation/index-qa-control.html \
  http://localhost:8765/.github/qa/local-validation/index-qa-rounded-major.html

# 4. Sensitivity scan: noise-floor case (expect PASS across all fuzz levels)
node .github/qa/local-validation/diff-rounded.mjs \
  http://localhost:8765/.github/qa/local-validation/index-qa-control.html \
  http://localhost:8765/.github/qa/local-validation/index-qa-rounded-subtle.html
```

## Expected output

Major regression A/B (20px + inset):

```
  fuzz |   pixels |       frac | % of frame | verdict
  -----+----------+------------+------------+--------
    0% |   ~93000 |   7.20e-02 |   ~7.2000% | FAIL
    5% |   ~93000 |   7.20e-02 |   ~7.2000% | FAIL
```

Noise-floor A/B (1px border-radius delta only):

```
  fuzz |   pixels |       frac | % of frame | verdict
  -----+----------+------------+------------+--------
    0% |      232 |   1.79e-04 |   0.0179% | PASS
    1% |      108 |   8.33e-05 |   0.0083% | PASS
    2% |        8 |   4.48e-05 |   0.0005% | PASS
    5% |        0 |   0.00e+00 |   0.0000% | PASS
```

Both outcomes are correct per the IGNORE rules in `qa-prompts/visual-diff/version-diff.txt` ("Sub-pixel rendering differences", "Layout shifts of 1-2 pixels that a designer would not notice at normal viewing distance"). The tool's knee sits at the 0.05% threshold.

## Why this matters

The visual-diff scenario runs against pinned `?caasver=X` URLs in production, where most CaaS changes are config-gated (e.g., mwpw-189783's `useRoundedCorners` defaults to false). This local harness isolates the *renderer*: same bundle, same collection, only the styling delta. It establishes that when a real layout change does ship, the tool catches it; when antialiasing flickers, the tool ignores it.
