# Dependabot safe autonomy

The controller in this directory separates update creation from merge policy:

1. Dependabot checks npm each weekday morning and may keep up to ten PRs open.
2. New PRs wait with `dependencies-queued`. The oldest safe-to-consider PR owns
   the one queue slot as `dependencies-preparing`, then `dependencies-active`.
3. Only the active Dependabot PR runs the expensive self-hosted review jobs.
   Normal pull requests still run them as before.
4. The controller evaluates, updates, and may arm only that one PR. After it
   merges or moves to `dependencies-review`, the next waiting PR gets the slot.
5. The automatic path does not guess safety from dependency type or version size.
   It requires changes only to `package.json` and `package-lock.json`.
6. The shipped bundle must be byte-identical (`build-output-diff: NO_CHANGE`) and
   GitHub must report a clean result with no failed checks.
7. Old or conflicted pure-Dependabot branches go through bounded recovery. Every
   other case receives `dependencies-review` for a person or Codex to handle.

## Rollout

The repository variable `DEPENDABOT_AUTOMERGE_MODE` controls rollout. Any value
other than `merge` records decisions without merging; `merge` enables the live
queue. Before enabling merge mode:

- enable **Allow auto-merge** in repository settings;
- update the default-branch `review-gate` ruleset so required status checks are
  strict (the PR branch must be current with `main`);
- review several observation-mode decisions and confirm the byte-diff and Agent
  QA signals match human judgment.

The controller refuses merge mode if either repository safety setting is absent.
It uses `BOT_TOKEN`, then `WORKFLOW_TOKEN`, falling back to `GITHUB_TOKEN`.

## Conflict recovery

Dependabot's automatic rebasing is disabled so ten waiting PRs do not all
rebuild after every merge. When the selected pure-Dependabot PR is behind or
conflicted, the scheduled controller:

1. requests `@dependabot rebase`;
2. after two hours, requests `@dependabot recreate` once;
3. after another two hours, labels the PR `dependencies-review` and moves on.

GitHub notes that PRs created before automatic rebasing is disabled can continue
to be rebased automatically for up to 30 days. The active-label gate still keeps
those waiting PRs from using the self-hosted review runner.

Branches containing human commits are never recreated automatically. Every new
head SHA must pass the complete policy again before auto-merge is armed. If an
armed PR becomes conflicted, unsafe, or starts waiting on a new head, the
controller disables its stale auto-merge request immediately.

Decision comments record PR creation time, decision time, elapsed time, head SHA,
and reason. GitHub's `mergedAt` timestamp completes raised-to-merge metrics.
