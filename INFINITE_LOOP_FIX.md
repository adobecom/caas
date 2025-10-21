# Infinite Loop Fix - Why [skip ci] Didn't Work

## The Problem

When we added `BOT_TOKEN` to trigger workflows, we got an infinite loop:
1. Merge PR → merge.yaml runs → creates release v0.40.1
2. Release commit pushed to main → **triggers merge.yaml again** → creates v0.40.2
3. Loop continues...

## First Attempt: [skip ci] ❌

**What we tried:**
```json
"commitMessage": "chore: release v${version} [skip ci]"
```

**Why it failed:**
- `[skip ci]` tells GitHub to skip workflows for that commit
- BUT: release-it does a **single push** containing both:
  - The release commit (with [skip ci])
  - The release tag
- GitHub applies `[skip ci]` to **everything in that push**, including the tag
- Result: release-assets.yml never triggers (no dist.tar.gz attached)

**Evidence:**
- Release 0.40.4: Created but no workflow run for that tag
- GitHub events show ReleaseEvent but no PushEvent for tag
- release-assets.yml workflow count stayed at 4 (didn't run for 0.40.4)

## Correct Solution: Workflow Conditional ✅

**What we're doing now:**
```yaml
jobs:
  run-release:
    runs-on: ubuntu-latest
    if: "!startsWith(github.event.head_commit.message, 'chore: release')"
```

**Why this works:**
- The merge.yaml workflow **starts** for every push to main
- But the `if` condition **skips the job** if commit message starts with "chore: release"
- This only affects the **commit push**, not the **tag push**
- Tag push is a separate event that still triggers release-assets.yml

## Flow Comparison

### With [skip ci] (BROKEN):
```
1. Merge PR → merge.yaml runs
2. release-it pushes commit + tag together with [skip ci]
3. GitHub sees [skip ci] → skips ALL workflows for that push
4. ❌ merge.yaml doesn't run (good - no loop)
5. ❌ release-assets.yml doesn't run (bad - no dist.tar.gz)
```

### With workflow conditional (CORRECT):
```
1. Merge PR → merge.yaml runs
2. release-it pushes commit (message: "chore: release v0.40.5")
3. Commit push triggers merge.yaml
4. ✅ merge.yaml starts, sees "chore: release", skips job (no loop)
5. release-it pushes tag (separate event)
6. ✅ Tag push triggers release-assets.yml
7. ✅ dist.tar.gz attached to release
```

## Expected Behavior (Next PR Merge)

When you merge test-deployment-6 and then merge another PR:

1. **PR merged** → merge.yaml runs
2. **release-it creates v0.40.5:**
   - Commits to main with message "chore: release v0.40.5"
   - Pushes commit to main
   - Pushes tag 0.40.5
3. **Commit push to main:**
   - merge.yaml triggered
   - Checks `if: !startsWith(github.event.head_commit.message, 'chore: release')`
   - Condition is false (message DOES start with 'chore: release')
   - **Job skipped** - no infinite loop
4. **Tag push:**
   - release-assets.yml triggered
   - Builds dist/
   - Attaches dist.tar.gz to release
5. **Result:** One release with dist.tar.gz attached ✅

## Technical Details

**Why are they separate events?**

Even though `git push` sends commit + tag together, GitHub Actions treats them as separate trigger events:
- Push to `refs/heads/main` → triggers workflows with `on: push: branches: [main]`
- Push to `refs/tags/*` → triggers workflows with `on: push: tags: ['*']`

The `if` conditional runs at the **job level** within a workflow, so:
- merge.yaml (triggered by commit push) can skip its job
- release-assets.yml (triggered by tag push) runs normally

## References

- GitHub Actions: [Using conditions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idif)
- GitHub Actions: [Skip workflows with commit messages](https://github.blog/changelog/2021-02-08-github-actions-skip-pull-request-and-push-workflows-with-skip-ci/)
