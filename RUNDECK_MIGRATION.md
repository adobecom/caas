# Rundeck Migration Guide

## Summary of Changes

We've moved from committing `dist/` files in every commit to attaching them as release assets. This eliminates merge conflicts and keeps the repository clean.

## What Changed

### Before:
```bash
# Rundeck curled the entire repository tarball
curl https://api.github.com/repos/adobecom/caas/tarball/{tag}
tar -xzf {tarball}
# dist/ files were in the tarball from git commits
```

### After:
```bash
# Rundeck curls the dist.tar.gz release asset
curl -L https://github.com/adobecom/caas/releases/download/{tag}/dist.tar.gz -o dist.tar.gz
tar -xzf dist.tar.gz
# dist/ folder extracted with all built files
```

---

## Required Rundeck Job Changes

### Option 1: Download dist.tar.gz Asset (Recommended)

Update your Rundeck job script:

```bash
#!/bin/bash
set -e

TAG="${RELEASE_TAG}"  # e.g., "0.39.7"
DOWNLOAD_URL="https://github.com/adobecom/caas/releases/download/${TAG}/dist.tar.gz"

# Download the dist.tar.gz asset
echo "Downloading dist.tar.gz for release ${TAG}..."
curl -L "${DOWNLOAD_URL}" -o dist.tar.gz

# Extract dist/ folder
echo "Extracting dist files..."
tar -xzf dist.tar.gz

# Upload dist/ to your webserver
echo "Uploading to production..."
rsync -avz dist/ user@production-server:/var/www/caas/dist/

echo "Deployment complete!"
```

### Option 2: Download with GitHub API Token

If you need authentication:

```bash
#!/bin/bash
set -e

TAG="${RELEASE_TAG}"
GITHUB_TOKEN="${GITHUB_TOKEN}"  # Set in Rundeck secrets
REPO="adobecom/caas"

# Get release ID
RELEASE_ID=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${REPO}/releases/tags/${TAG}" | \
  jq -r '.id')

# Get asset ID for dist.tar.gz
ASSET_ID=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${REPO}/releases/${RELEASE_ID}/assets" | \
  jq -r '.[] | select(.name=="dist.tar.gz") | .id')

# Download asset
curl -L -H "Authorization: token ${GITHUB_TOKEN}" \
  -H "Accept: application/octet-stream" \
  "https://api.github.com/repos/${REPO}/releases/assets/${ASSET_ID}" \
  -o dist.tar.gz

# Extract and deploy
tar -xzf dist.tar.gz
rsync -avz dist/ user@production-server:/var/www/caas/dist/
```

---

## Testing the New Flow

### 1. Verify Asset Exists After Release

After creating a release (e.g., `0.39.7`), check that the asset was created:

```bash
curl -s https://api.github.com/repos/adobecom/caas/releases/tags/0.39.7 | \
  jq -r '.assets[] | select(.name=="dist.tar.gz") | .browser_download_url'
```

Expected output:
```
https://github.com/adobecom/caas/releases/download/0.39.7/dist.tar.gz
```

### 2. Test Download and Extract

```bash
# Download
curl -L https://github.com/adobecom/caas/releases/download/0.39.7/dist.tar.gz -o test-dist.tar.gz

# Extract
tar -xzf test-dist.tar.gz

# Verify contents
ls -la dist/
```

Expected files:
```
dist/app.css
dist/main.js
dist/main.min.js
dist/main.source.js
dist/react.umd.js
dist/react.dom.umd.js
```

### 3. Test Production Deployment

Run your updated Rundeck job against a test environment first to verify the new download method works.

---

## Rollback Plan

If the new system has issues, you can temporarily:

1. **Use an older release** that still has dist/ in the tarball (any release before this change)
2. **Manually build and upload** dist/ files:
   ```bash
   git clone https://github.com/adobecom/caas.git
   cd caas
   git checkout {tag}
   npm ci
   npm run build
   # Upload dist/ to production
   ```

---

## Benefits of This Approach

✅ **No merge conflicts** - dist/ files never in commits
✅ **Cleaner git history** - only source code tracked
✅ **Faster PR reviews** - no generated file diffs
✅ **Same deployment** - Rundeck still gets dist/ files
✅ **Reproducible builds** - dist/ built from tagged source

---

## Timeline

1. **Merge PR** with these changes
2. **Create test release** (e.g., 0.39.7)
3. **Verify dist.tar.gz** is attached to release
4. **Update Rundeck job** with new download script
5. **Test deployment** to staging environment
6. **Deploy to production** once verified

---

## Support

If you have questions or issues with the migration, contact the CaaS development team or check:
- Release assets: https://github.com/adobecom/caas/releases
- GitHub Actions logs: https://github.com/adobecom/caas/actions
