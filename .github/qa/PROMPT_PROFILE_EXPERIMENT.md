# Historical prompt-profile experiment

`baseline-v1` preserves the historical feature-backtest prompting strategy.
Its frozen pre-experiment reference is commit `4b086747`; do not delete or
silently rewrite that path while evaluating a lean profile.

`lean-contracts-v1` is deliberately limited to historical back-tests. It uses
the PR's changed diff plus bounded local source blocks to expose reviewed
fixture contracts, then asks the model only to choose one contract and cite the
source evidence. The compiler owns fixture JSON/config/probes and the
deterministic assertion owns the verdict. It does not fall back to an
exploratory fixture.

Run the same PR list once per profile. Do not reuse a saved plan between
profiles. Compare the post/base outcome, selected contract, target proof, and
the recorded model-call/prompt-character metrics. The first control corpus is
`453,465,423,444`; each must remain a managed `DISCRIMINATING_PASS`.

Promotion rule: only consider the lean path for future PRs after it matches the
control corpus without a weaker target/contract proof and demonstrates lower
model context/authority. Noncatalog historical PRs form a contract-backlog
inventory, not a lean failure: a safe `NEEDS_CONTRACT` result is preferable to
inventing a fixture.
