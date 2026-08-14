# Onboarding Troubleshooting

Common failure modes when onboarding a new CaaS consumer, indexed by symptom. If a symptom is not listed here, append it once diagnosed — this file should accrete over time.

## Symptom: HTTP 400 — `origin: <name>, is not within the allowlist: [...]`

**Where seen:** Bulk Publisher response, direct curl POST to milocaasproxy or chimera-xdm-postservice.

**Cause:** the consumer name is not in `CHIMERA_ALLOW_LIST` on the post-service deploy. Either step 3 of [CONSUMER_ONBOARDING.md](CONSUMER_ONBOARDING.md) was skipped, or the helm-values PR has not yet rolled through Glider to the environment you are testing against.

**Resolution:** confirm the deploy repo PR has merged and Glider has propagated to the relevant environment (Dev → Stage → Production). For Stage validation, the merge alone is not sufficient — the Glider rollout must finish.

## Symptom: HTTP 201 returned, but the card never surfaces in chimera

**Cause A:** the `caas:source/<name>` Javelin tag has not propagated to the canonical taxonomy yet. The post-service writes the record to OpenSearch successfully, but the read service / Configurator filters it out because the source tag does not exist in the canonical list.

**Verify A:**

```bash
curl -s "https://www.adobe.com/chimera-api/tags?cb=$(date +%s)" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); \
    print('<name>' in d['namespaces']['caas']['tags']['source']['tags'])"
```

If `False`, wait for the next Javelin cycle.

**Cause B:** the card was written to Production OpenSearch but you are querying Stage (or vice versa). Confirm which environment your validation curl is hitting; the read endpoints differ.

**Cause C:** the `entity-id` in your validation query does not match the entity-id the post-service generated. Check the response body of the POST for the actual entity-id and re-query with that value.

## Symptom: new consumer does not appear in the Configurator source dropdown

**Cause:** the Milo PR adding `<consumer>: '<Display Name>'` to `defaultOptions.source` has not merged, has not been pulled into the user's Milo build, or the Configurator is being loaded from a stale Milo branch.

**Resolution:** confirm the Milo PR is merged to `stage` and the daily scheduled merge into `main` (~08:48 UTC) has run.

## Symptom: pages publish successfully but no cards land in chimera

**Cause:** the page lacks a `card-metadata` block in its source document. The Bulk Publisher / Sidekick "send to CaaS" flow reads the published HTML for a `card-metadata` block and short-circuits if absent. The publish step succeeds at the Helix layer (the page is live on aem.live) but the CaaS POST never fires.

**Resolution:** confirm the source document (SharePoint .docx or DA HTML, depending on the consumer's mount) contains a `card-metadata` block. The block is a single HTML table with the block name in the first row and key/value pairs in subsequent rows.

## Symptom: Bulk Publisher reaches `www.adobe.com` instead of the consumer's pre-launch aem.live host

**Cause:** the preset's `host` field points at the production domain, but the consumer site has not launched yet, so the host resolves to a 404 or unrelated content.

**Resolution:** override the `host` field at form-fill time to `main--<repo>--<org>.aem.live` for pre-launch validation. Update the preset's `host` field to the production domain only after the consumer launches.

## Symptom: a tag in the `card-metadata` block is silently dropped from published cards

**Cause:** the tag value is not in the canonical chimera-api/tags taxonomy. Custom tag strings (free-text rather than canonical `caas:*` tag IDs) are filtered out at write time. A common failure mode is using a typo'd tag ID, or an ID from a list that the consumer team has not yet had added to the canonical taxonomy.

**Resolution:** confirm each tag in the source document resolves against `https://www.adobe.com/chimera-api/tags`. New tag values require a Javelin request, same as the source tag.

## Symptom: DA editor crashes with `TypeError: Cannot read properties of undefined (reading 'some')` when opening a `/education/...` page

**Cause:** Document Authoring permission denied on `adobecom` org for the current user. The 403 from `admin.da.live` returns no `x-da-actions` header, so the editor's `initProse` call receives `permissions: undefined` and crashes.

**Resolution:** request DA write access for the relevant subtree via the consumer team's DA admin, or via `#document-authoring` Slack. For test pages that do not require the `/education/...` path, author in a SharePoint-mounted path like `/drafts/` instead, which uses standard SharePoint ACLs.
