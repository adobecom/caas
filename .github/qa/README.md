# AI-driven QA Audit Suite

Manual-trigger workflow that runs a battery of accessibility + visual audits against a chosen CaaS version on a self-hosted runner, then posts a structured report as a GitHub Issue.

## How to trigger

1. Go to **Actions** -> **QA Audit** -> **Run workflow**.
2. Enter the `caasver` tag you want to test (e.g. `0.51.5`).
3. (Optional) Override `base_url` if you want to point at a page other than `business.adobe.com/resources/main.html`.
4. Click **Run workflow**.

The job runs on a self-hosted macOS runner (Chrome + Node + Playwright preinstalled). When it finishes (~7-10 minutes), a new Issue is created with the report.

## What gets tested

Each scenario in `qa-prompts/` exercises a specific bug class with a hybrid pattern (visual judgment + DOM/ARIA inspection):

| Scenario | Bug class |
|---|---|
| `audit-pagination` | aria-current on pagination after click (mwpw-177209) |
| `audit-filter-announce` | screen-reader announcement of filter result (mwpw-189715 / 177233) |
| `audit-focus-visibility` | focus indicator on light-background interactives (mwpw-177138) |
| `audit-focus-dark-bg` | focus contrast on dark/colored backgrounds (mwpw-190906 / 190007) |
| `audit-headings` | semantic heading levels in filter panel (mwpw-177245) |
| `audit-search-aria` | search input labeling (mwpw-189897) |
| `audit-contrast` | color-contrast violations via axe-core (mwpw-177208) |
| `audit-card-readability` | card-text line-clamp and overflow (mwpw-182553) |

Each scenario runs the agent loop in `qa-runner-v2.mjs`, which drives Chrome via Playwright CDP, takes screenshots, queries DOM state, and produces a PASS/FAIL verdict with a concrete report.

## Files

- `qa-runner-v2.mjs` - the agent loop. Spawns Playwright Chrome (via `USER_DATA_DIR` for persistent profile + bot-detection bypass), runs a tool-use loop with Claude via Adobe LLM proxy, supports retry + checkpoint + auto-done safety net.
- `run-all-audits.sh` - iterates every `qa-prompts/audit-*.txt`, runs the runner against each, writes per-scenario logs to `results-<timestamp>-<version>/`.
- `aggregate-report.mjs` - walks the results dir and produces the markdown report that ends up as the Issue body.
- `qa-prompts/` - the scenario prompts. To add a new scenario: drop a new `audit-<name>.txt` file in here following the existing format (visual + ARIA hybrid pattern, short turn budget, explicit PASS/FAIL criteria). It'll be picked up automatically on the next run.

## Adding a scenario

Each prompt follows this shape:

```
You are an a11y QA reviewer testing X. Budget: N turns.

STEP A: find_and_show the target region.
STEP B: visual baseline (look at screenshot).
STEP C: ARIA / DOM baseline (one evaluate).
STEP D: interact (click / type / keyboard_tab).
STEP E: re-capture after-state.
STEP F: done(report, verdict).

VERDICT
- PASS only if both visual AND ARIA dimensions pass.
- FAIL with explicit reason if either fails.

REPORT
- Two sections: Visual + ARIA. Quote what you actually observed.
```

Keep prompts tight - the agent has limited turn budget and rambles when given too much latitude. See existing scenarios for working examples.

## Required secrets

- `IMS_ACCESS_TOKEN` - already configured (used by `ai-code-review.yml`).

## Self-hosted runner requirements

- macOS or Linux with Chrome installed (real Chrome, not Chromium, for fingerprint reasons).
- Node 18+.
- Playwright installed globally OR via `npm install playwright` in the working tree.
- ImageMagick (`brew install imagemagick`) for `diff_screenshots`.

The existing self-hosted runner used by `ai-code-review.yml` satisfies these requirements.
