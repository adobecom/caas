# CaaS PR build hosting POC

In **Actions → Deploy static content to Pages → Run workflow**, enter a
`pr_number`. Leave it blank for the existing normal site deployment.
`node_version` defaults to 24; select an appropriate runtime for older PRs.
Before this enhancement is merged, run the existing workflow from the feature
branch with the CLI:

```sh
gh workflow run static.yml --repo adobecom/caas \
  --ref feat/caas-pr-build-hosting -f pr_number=662 -f node_version=24
```

The run summary links to these public files:

```text
https://adobecom.github.io/caas/pr-builds/pr-662/main.min.js
https://adobecom.github.io/caas/pr-builds/pr-662/app.css
https://adobecom.github.io/caas/pr-builds/pr-662/react.umd.js
https://adobecom.github.io/caas/pr-builds/pr-662/react.dom.umd.js
https://adobecom.github.io/caas/pr-builds/pr-662/manifest.json
```

## Behavior

- Open, merged, or closed PRs from this repository are supported. The job builds
  the PR's head SHA, not the current main branch or the synthetic merge commit.
  Fork PRs are rejected in this POC. Old dependency/runtime failures stop publication.
- One folder per PR. Rerunning replaces that PR's files; other PR folders remain.
- `qa-previews` is generated storage, not a source branch to merge into main.
  Previews remain after merge/close until explicitly removed from storage.
- The manifest records PR, SHA, build time, run, and SHA-256 hashes. A build is
  published only after all four required assets exist.
- Manual PR publication restores the last successful Pages deployment artifact,
  overlays retained previews, then deploys. It does not rebuild the root site.
  If that artifact has expired, it fails rather than guessing the site's contents;
  run the normal Pages deployment first to refresh the artifact.
- Both existing Pages deployment paths restore `qa-previews` before uploading.
  These retention changes must be merged into main and present in PR workflows
  before all future deployments preserve previews. Older workflow revisions can
  still remove the public folders, though saved builds remain recoverable.
- Publishing is serialized with the `pages` concurrency group. GitHub permits
  one running and one pending job per group; a newer pending job can replace an
  older pending job. Rerun any canceled publication; it will not corrupt storage.
- Public files can be cached. Compare the manifest SHA and use a build-specific
  query string while checking a newly published build. A future Milo integration
  should use this metadata for its indicator and cache-busting. This POC does not
  change Milo or guarantee an atomic multi-request JS/CSS load across updates.

## Permissions and verification

PR install/build runs in a separate job with read-only repository permission and
no persisted checkout credentials. Only the publisher can write storage/deploy;
it copies allowlisted static files and does not execute the PR output.
The workflow's final step downloads all four hosted assets and compares their
hashes with the build manifest.

Local checks:

```sh
python3 -m unittest discover -s scripts/pages -p 'test_*.py' -v
actionlint .github/workflows/pr-preview.yml
```

Cloud POC: publish 662, publish a second PR, rerun 662, and verify both folders
still load. Compare root-site checksums before/after. Normal-deploy retention
should also be exercised after merging the workflow changes.

## POC results and repository prerequisite

- PR 662 built and published successfully:
  https://github.com/adobecom/caas/actions/runs/38624922577
  All four public asset checksums matched its manifest. The pre-existing
  `index.html`, `dist/main.min.js`, and `dist/app.css` checksums were unchanged.
- PR 654 built, but saving its folder was rejected:
  https://github.com/adobecom/caas/actions/runs/38624969322
  `qa-previews` inherits the repository branch rule requiring 11 source-code CI
  checks. Initial branch creation succeeded; subsequent generated commits cannot
  pass those source-code checks on this storage-only branch.
- The repeat-662 run was canceled after identifying this blocker.
- With maintainer approval, an exact `qa-previews` protection rule now exempts
  generated storage from source-code CI checks. The existing source-branch rule
  is unchanged.

Preview builds set `RELEASE_TAG` to `pr-<number>-<12-character SHA>` and verify
that both JS and CSS banners contain it. The manifest exposes the same version.
An older PR whose build does not support this override fails before publication.
Each preview also has an `index.html` asset smoke-test page that loads its actual
CSS, React dependencies, and JS. This verifies loading, not collection behavior.
