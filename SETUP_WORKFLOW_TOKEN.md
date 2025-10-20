# Setup WORKFLOW_TOKEN for Automated Releases

## Problem
When GitHub Actions uses `GITHUB_TOKEN` to push tags, it doesn't trigger other workflows (by design, to prevent infinite loops). This means our `release-assets.yml` workflow never runs automatically.

## Solution
Use a Personal Access Token (PAT) that CAN trigger workflows. The workflow will try to use tokens in this order:
1. `BOT_TOKEN` (if it exists and has the right permissions)
2. `WORKFLOW_TOKEN` (if configured)
3. `GITHUB_TOKEN` (fallback, but won't trigger workflows)

---

## Steps to Create WORKFLOW_TOKEN

### 1. Create Personal Access Token (Classic)

**Option A: Organization Admin Creates It (Recommended)**
1. Go to GitHub Settings (organization or personal)
2. Navigate to: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Click **Generate new token** → **Generate new token (classic)**
4. Set token name: `CaaS Workflow Token`
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
6. Set expiration: **No expiration** (or suitable duration)
7. Click **Generate token**
8. **IMPORTANT:** Copy the token immediately (you won't see it again!)

### 2. Add Token to Repository Secrets

1. Go to repository: https://github.com/adobecom/caas
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `BOT_TOKEN` or `WORKFLOW_TOKEN`
5. Value: Paste the token you copied
6. Click **Add secret**

**Note:** If you already have a `BOT_TOKEN` secret, you can update it with the new token that has `repo` + `workflow` scopes, or create a separate `WORKFLOW_TOKEN`.

---

## How It Works

### Before (Doesn't Work):
```yaml
# merge.yaml
- run: npm run release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # ❌ Doesn't trigger workflows
```

**Flow:**
```
Merge PR → npm run release → Pushes tag with GITHUB_TOKEN
                           → GitHub blocks workflow triggers ❌
                           → release-assets.yml never runs
```

### After (Works):
```yaml
# merge.yaml
- uses: actions/checkout@v2
  with:
    token: ${{ secrets.WORKFLOW_TOKEN }}  # ✅ Uses PAT for checkout

- run: npm run release
  env:
    GITHUB_TOKEN: ${{ secrets.WORKFLOW_TOKEN }}  # ✅ Uses PAT for release
```

**Flow:**
```
Merge PR → npm run release → Pushes tag with WORKFLOW_TOKEN (PAT)
                           → GitHub allows workflow triggers ✅
                           → release-assets.yml runs automatically ✅
                           → Builds and attaches dist.tar.gz ✅
```

---

## Fallback Behavior

The code uses: `${{ secrets.BOT_TOKEN || secrets.WORKFLOW_TOKEN || secrets.GITHUB_TOKEN }}`

**If neither BOT_TOKEN nor WORKFLOW_TOKEN exists (or they lack proper permissions):**
- ✅ Release process still works
- ✅ Creates release and pushes tag
- ❌ But won't trigger release-assets workflow (same as before)
- ✅ Can use manual workflow as backup

**Once BOT_TOKEN or WORKFLOW_TOKEN is added with proper permissions:**
- ✅ Everything works automatically!

---

## Testing

After adding the token, test by merging a PR:

```bash
# 1. Merge PR to main
# 2. Wait for "Merge" workflow to complete
# 3. Check that "Attach Build Artifacts to Release" runs automatically
# 4. Verify dist.tar.gz is attached to the release

# Check via API:
curl -s "https://api.github.com/repos/adobecom/caas/releases/latest" | jq -r '.assets[].name'
# Expected: dist.tar.gz
```

---

## Security Note

**Why is this safe?**
- Token is stored as encrypted secret in GitHub
- Only accessible by GitHub Actions runners
- Scoped to only repo and workflow permissions
- Can be revoked/rotated anytime

**Best Practice:**
- Use an organization/bot account's PAT (not personal)
- Set reasonable expiration (e.g., 1 year)
- Rotate token before expiration
- Monitor token usage in audit logs
