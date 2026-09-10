# Dependabot safe autonomy

The controller in this directory separates update creation from merge policy:

1. Dependabot checks npm each weekday morning and may keep up to five PRs open.
2. The controller evaluates every open Dependabot PR, but can arm only one merge
   at a time.
3. The first rollout permits only direct development dependency patch/minor
   updates that touch `package.json` and `package-lock.json`.
4. The shipped bundle must be byte-identical (`build-output-diff: NO_CHANGE`),
   Agent QA must report `PASS` for the current head SHA, and the deterministic
   PR build, lint, unit, coverage, E2E, accessibility, and performance suite
   must pass.
5. Anything else receives `dependencies-needs-human` and remains open without
   blocking other safe updates.

## Rollout

The workflow defaults to observation mode. It labels and records PR decisions,
but does not merge. Before changing the repository variable
`DEPENDABOT_AUTOMERGE_MODE` to `merge`:

- enable **Allow auto-merge** in repository settings;
- update the default-branch `review-gate` ruleset so required status checks are
  strict (the PR branch must be current with `main`);
- review several observation-mode decisions and confirm the byte-diff and Agent
  QA signals match human judgment.

The controller refuses merge mode if either repository safety setting is absent.
It uses `BOT_TOKEN`, then `WORKFLOW_TOKEN`, falling back to `GITHUB_TOKEN`.

## Conflict recovery

Dependabot's automatic rebasing remains enabled explicitly. When a pure
Dependabot branch stays behind or conflicted, the scheduled controller:

1. waits 30 minutes for the normal automatic rebase;
2. requests `@dependabot rebase`;
3. after two more hours, requests `@dependabot recreate` once;
4. after another two hours, labels the PR `dependencies-needs-human`.

Branches containing human commits are never recreated automatically. Every new
head SHA must pass the complete policy again before auto-merge is armed. If an
armed PR becomes conflicted, unsafe, or starts waiting on a new head, the
controller disables its stale auto-merge request immediately.

Decision comments record PR creation time, decision time, elapsed time, head SHA,
and reason. GitHub's `mergedAt` timestamp completes raised-to-merge metrics.
