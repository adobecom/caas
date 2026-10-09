# Ordinary PR safe autonomy

This controller is independent of the Dependabot update queue. It neither owns
queue labels nor changes dependency branches, approvals, comments, or settings.
It evaluates only human-authored, same-repository, non-draft PRs targeting `main`
with the explicit `ordinary-automerge` label. Dependabot authors/branches and any
`dependencies-*` label are excluded. Existing native auto-merge requests are
left to their owner and excluded from this controller.

## Policy

Every evaluation reads the current head and base, all paginated check runs,
commit statuses, reviews, effective branch rules, and classic branch protection.
Unknown rules, API failures, missing evidence, conflicts, behind branches, or an
unknown GitHub merge state fail closed. Effective strict required checks must
exist. Required checks must succeed, including their required app identity when
specified; skipped/neutral required checks cannot pass. Other completed
skipped/neutral checks are allowed, but pending/failed checks and any non-success
commit status block merging. Reruns are collapsed by check name and app, and
statuses by context, choosing the newest ID.

The actual `review-score-gate` **commit status** must succeed even when GitHub
does not require it. A green Review Score Gate workflow is insufficient. At
least one allowlisted non-author human reviewer must approve the current head,
with no outstanding changes requested by any reviewer. The status must not
predate the latest submitted review. The allowlist matches `review-score.yml`;
update both together. There is no Dependabot byte-diff approval shortcut here.
GitHub must also report CLEAN, mergeable, and satisfaction of its applicable
approval/code-owner/last-push rules. GitHub enforces review-thread and other
supported rules again when processing the merge request.

In merge mode the controller loads the complete evidence again immediately,
requires the same head and base, then requests an immediate squash merge with
the exact head SHA. It never arms native auto-merge for a future head. GitHub's
merge endpoint remains the final enforcement point; refusal fails the run.
At most one PR merges per invocation. There is no rebase, approval, bypass,
admin merge, token fallback, persistent checkout credential, or execution of
PR code. The workflow executes only default-branch controller code on a hosted
runner using `GITHUB_TOKEN` with contents/pull-request write and checks/statuses
read permissions. No new credentials are needed.

The REST merge endpoint guards the head but does not atomically guard optional
statuses, review changes, or the base SHA. The immediate second read narrows
that window; strict GitHub rules enforce the required checks and up-to-date
branch at merge time. Live mode therefore additionally refuses to merge unless
GitHub requires `review-score-gate` and at least one approval with stale-review
dismissal on push. The current repository lacks both protections; observation
can report candidates, but merely enabling the variable will not merge them.
This PR does not change those settings. Optional checks still have a small
read-to-merge race; maintainers should make safety-critical checks required.

## Triggers and rollout

Completion of review/build/test workflows, pushes to main, an hourly backup,
and manual dispatch re-evaluate opted-in PRs. Label changes, outside status
providers, and review changes with no workflow completion are picked up by the
hourly backup. Runs serialize with each other, while the existing Dependabot
controller keeps its own concurrency group. Neither controller updates the
other's PRs; merges by either require the next candidate to validate the new base.

`ORDINARY_AUTOMERGE_MODE` must equal `merge` to write. Absent or any other value
is **read-only observation**: decisions appear only in Actions logs. Adding this
workflow does not activate live ordinary merging. Before rollout, maintainers
should review observation decisions, choose label ownership and initial scope,
authorize the required review protections described above, and explicitly enable
the variable. No labels or variables are created by this implementation.
GITHUB_TOKEN merge events may not start other Actions workflows; scheduled
controllers remain the backup. Confirm post-merge release requirements before
rollout rather than substituting a broader bot credential.

## Validation

Run `node --test .github/automerge/*.test.mjs` (Node 24). Tests exercise policy,
observation with no writes, a second complete evaluation, stale head/base and
opt-out rejection, exact-head single merge, API failures and server refusal.
The read-only PR workflow `Ordinary Automerge Tests` runs the suite. Existing
Dependabot tests can separately verify that its unchanged controller still works.
Live token permission, event delivery, and race windows need rollout observation;
tests do not authorize production merges.
