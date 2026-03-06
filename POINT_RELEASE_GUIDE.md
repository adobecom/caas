# Point Release Guide

How to create a point release (e.g., 0.42.6.1) off an existing release (e.g., 0.42.6).

## Quick Start - Automated Workflow (Recommended)

The easiest way to create a point release is using the automated workflow:

1. **Prepare your branch:**
   - Create a branch from the base release: `git checkout -b 0.42.6.1 0.42.6`
   - Cherry-pick your fixes or make changes
   - Update `package.json` version to `0.42.6.1`
   - Push the branch: `git push origin 0.42.6.1`

2. **Trigger the workflow:**
   - Go to [Actions → Create Point Release](https://github.com/adobecom/caas/actions/workflows/point-release.yml)
   - Click **"Run workflow"**
   - Fill in:
     - **Branch:** `0.42.6.1` (your branch name)
     - **Version:** `0.42.6.1` (the release version)
     - **Force:** Leave unchecked (unless updating existing release)
   - Click **"Run workflow"**

The workflow will automatically:
- Build the project from your branch
- Create the git tag
- Create/update the GitHub release
- Attach the `dist.tar.gz` asset

### Updating an Existing Release

If you need to add more changes to an existing point release:

1. Push your new commits to the branch
2. Re-run the workflow with **Force** checked
3. This will rebuild and update the existing release

---

## Manual Process (Alternative)

If you prefer to do it manually or the workflow is unavailable:

### Creating a Point Release

```bash
# 1. Create branch from base release tag
git checkout -b 0.42.6.1 0.42.6

# 2. Cherry-pick your commits
git cherry-pick <commit-hash1> <commit-hash2>

# 3. Update version in package.json to "0.42.6.1"
git add package.json
git commit -m "chore(mwpw-12345): bump version to 0.42.6.1"

# 4. Push branch and tag
git push origin 0.42.6.1
git tag -a 0.42.6.1 -m "Release 0.42.6.1"
git push origin refs/tags/0.42.6.1
```

### Trigger the Build

1. Go to [Actions → Manual Build Release](https://github.com/adobecom/caas/actions/workflows/manual-build-release.yml)
2. Click **"Run workflow"**
3. Enter tag: `0.42.6.1`
4. Click **"Run workflow"**

The workflow will build and create/update the release with `dist.tar.gz` attached.

### Adding More Changes to Existing Point Release

```bash
# 1. Add your commits
git checkout 0.42.6.1
# Make changes...
git commit -m "fix(mwpw-12345): additional fix"
git push origin 0.42.6.1

# 2. Move the tag
git tag -d 0.42.6.1
git push origin --delete refs/tags/0.42.6.1
git tag -a 0.42.6.1 -m "Release 0.42.6.1"
git push origin refs/tags/0.42.6.1

# 3. Re-trigger the manual build workflow (same as above)
```

## Notes

- Tags use format `0.42.6.1` (no `v` prefix)
- The tag must exist before triggering the workflow
- The workflow will create the release if it doesn't exist
- Commit messages must include JIRA ticket: `fix(mwpw-12345): message`
