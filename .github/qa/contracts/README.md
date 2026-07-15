# QA-owned fixture contracts

This catalog turns the fragile part of an AI browser test—guessing CaaS raw
config, card JSON, filter data, and probes—into reviewed runner code.

The planner selects a versioned contract and cites source evidence. For a
managed contract, the runner compiles the fixture, validates it before browser
injection, and evaluates its small deterministic DOM contract afterward. The
browser bridge only reports generic facts (override status, captured configs,
probes, and tracked node lifecycle); it never contains product rules.

On pages with multiple collections, the bridge marks one target using the
captured endpoint fingerprint plus its occurrence, rather than trusting mount
order alone. If that target cannot be resolved during a replay, the run skips
as infrastructure-unresolved instead of judging a sibling collection.

## Current contracts

- `card.metadata-attributes.v1`: top-level card country/reference → root data attributes.
- `collection.empty-events-removal.v1`: empty events response removes the same published host.
- `filter.nested-filter-prune.v1`: direct opened nested filter data removes an empty leaf.
- `card.button-card-cta.v1`: Button Card uses top-level `overlayLink` and center-footer CTA data.

`exploratory.collection.v1` remains available for a truly new feature, but its
result is deliberately labelled exploratory / needs-contract rather than
certified. It is the signal to add a new QA-owned contract, not a developer
requirement.

The same local compiler is the pre-injection validator used by both runners.
It can also be called directly when debugging a plan:

```sh
node .github/qa/contract-maker.mjs validate-plan --plan /path/to/agent-plan.json
```

For the empty-events contract, pass the captured live config as
`--live-config /path/to/live-config.json` so the validator can safely derive
the real endpoint.

## Maintenance loop

Run this weekly against the current main checkout:

```sh
node .github/qa/contract-maker.mjs health --repo-root .
```

It is read-only and flags source hints that disappeared or whose tracked source
tokens no longer match. When a feature run is
labelled `NEEDS_CONTRACT`, make a candidate outside `contracts/manifests`:

```sh
node .github/qa/contract-maker.mjs propose \
  --id card.example-behavior.v1 \
  --evidence /path/to/pr-evidence.txt \
  --out /tmp/card.example-behavior.v1.json \
  --repo-root .
node .github/qa/contract-maker.mjs validate /tmp/card.example-behavior.v1.json
```

The proposal is inert JSON and cannot add executable logic. A manifest's
`kind` selects a reviewed compiler adapter. If a new behavior does not fit an
existing adapter, the maker returns `NEEDS_ADAPTER` instead of pretending that
the closest contract applies. A QA owner then adds the adapter, its unit test,
and its manifest; proves it against a historical post/base pair; and lands it
in a separate QA-owned PR. A semantic change gets a new `v2` contract; the job
that is testing a product PR never silently changes the catalog.
