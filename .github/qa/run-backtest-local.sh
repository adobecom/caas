#!/usr/bin/env bash
# Run the historical feature back-test DIRECTLY on the Mini, skipping the GitHub
# Actions dispatch/queue/checkout/artifact round-trip (the dominant wall-clock cost).
#
# Requires a local creds file (default ~/.caas-qa.env) that YOU create once, e.g.:
#   IMS_ACCESS_TOKEN=...        # Adobe IMS token for the LLM proxy
#   PROXY_URL=https://...       # or LLM_PROXY_ENDPOINT
#   MODEL=claude-...            # or LLM_MODEL
# gh must already be authenticated (it is). This script never prints the token.
#
# Usage:  ./run-backtest-local.sh "304,532,451"
set -euo pipefail
export PATH=/opt/homebrew/bin:$PATH
HERE="$(cd "$(dirname "$0")" && pwd)"
CREDS="${CAAS_QA_ENV:-$HOME/.caas-qa.env}"
if [ ! -f "$CREDS" ]; then
  echo "ERROR: creds file not found: $CREDS" >&2
  echo "Create it once with IMS_ACCESS_TOKEN, PROXY_URL (or LLM_PROXY_ENDPOINT), MODEL (or LLM_MODEL)." >&2
  exit 1
fi
set -a; . "$CREDS"; set +a
export GH_REPO="${GH_REPO:-adobecom/caas}"
export CDP_URL="${CDP_URL:-http://127.0.0.1:9222}"
export PROXY_URL="${PROXY_URL:-${LLM_PROXY_ENDPOINT:-}}"
export MODEL="${MODEL:-${LLM_MODEL:-}}"
export BACKTEST_PRS="${1:?usage: run-backtest-local.sh \"pr1,pr2,...\"}"
# repo root = two levels up from .github/qa
export GITHUB_WORKSPACE="$(cd "$HERE/../.." && pwd)"
export BACKTEST_OUTPUT_DIR="${BACKTEST_OUTPUT_DIR:-$GITHUB_WORKSPACE/backtest-out}"
: "${IMS_ACCESS_TOKEN:?creds file must set IMS_ACCESS_TOKEN}"
: "${PROXY_URL:?creds file must set PROXY_URL or LLM_PROXY_ENDPOINT}"
: "${MODEL:?creds file must set MODEL or LLM_MODEL}"
echo "[local-run] PRs=$BACKTEST_PRS repo=$GH_REPO out=$BACKTEST_OUTPUT_DIR"
node "$HERE/feature-backtest-batch.mjs"
echo "[local-run] done -> $BACKTEST_OUTPUT_DIR/summary.md"
