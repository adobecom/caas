# .pinata/ — the CaaS tenant contract for the ACOM AI Harness

This directory is how the harness (Fiesta) learns to work on CaaS without the
platform holding any CaaS-specific knowledge. The harness reads it at a pinned
commit per run; changing a file here changes how runs against this repo plan,
verify, and open PRs — nothing else in the repo is affected.

## Files

| File | Role |
|---|---|
| `manifest.yaml` | Identity (org/product/repo) + which shared mental models the planner consults |
| `gates.yaml` | The verification gates every candidate change must pass, with real repo commands |
| `floor/gates.yaml` | Vendored snapshot of the acom org floor — the minimum no tenant may weaken |
| `pr.yaml` | PR body template + branch naming for harness-authored changes |
| `scripts/check-render.py` | Renderability gate: the built bundle must mount a card collection in headless chromium |
| `scripts/check-contract.py` | CI linter: this contract stays well-formed and at least as strict as the floor |
| `.config.json` | pinata-code app config (services, test URL registry, verify command) |

## The gates, and where each came from

Every gate mirrors something this repo already enforces or ships:

- **lockfiles** — `package-lock.json` is protected; dependency bumps are their own ticket.
- **lint** — diff-scoped check-only ESLint. `npm run lint` bakes in `--fix`, and the
  base tree carries pre-existing violations, so repo-wide check-only fails on main.
- **unit-tests** — `npx jest`; `jest.config.js` enforces global coverage thresholds,
  so this is simultaneously the test gate and the coverage gate.
- **build** — the production webpack build, with `NODE_OPTIONS=--openssl-legacy-provider`
  exactly as the repo's own QA workflows run it on modern node.
- **renderability** — deterministic port of `.github/qa/caas-render.mjs`: serve
  `index.html` + built bundle + `mock-json/`, require the Consonant grid, ≥1 card,
  and no uncaught page errors.
- **adversary** — org-floor-mandated independent model review; the harness-side
  counterpart of `.github/workflows/ai-code-review.yml`.

Every command above was executed against a clean checkout before being declared.

## Not here yet (deliberate)

- **Visual gate** — needs either in-pod serving for judged screenshots or a branch
  preview host; the renderability gate covers "it actually mounts" deterministically.
- **PR title shaping** — caas CI lints titles (`type(mwpw-NNNNNN): message`); the
  harness cannot yet emit that shape (see `pr.yaml` header).
- **a11y audit scenarios** — `.github/qa/qa-prompts/` knowledge is captured in the
  `caas-quality` mental model; automated axe checks are a candidate follow-up gate.

Questions: `#javelin-friends` (CaaS) / the ACOM AI Harness team (contract).
