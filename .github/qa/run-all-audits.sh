#!/bin/bash
# Runs every audit-*.txt scenario in the chosen suite, sequentially.
# Designed to be invoked from a GitHub Actions workflow on a self-hosted runner.
#
# Required env vars:
#   IMS_ACCESS_TOKEN  - bearer token for LLM proxy
#   PROXY_URL         - LLM proxy endpoint URL
#   MODEL             - model name
#   CAASVER           - CaaS version tag to test against (e.g. "0.51.5")
#
# Optional env vars:
#   SUITE             - which suite to run: a11y | smoke | functional | regression | all (default: a11y)
#   BASE_URL          - page to load (default: business.adobe.com/resources/main.html)
#   MAX_TURNS         - max agent turns per scenario (default: 10)
#   RECORD_VIDEO      - 1 to record per-scenario webm video (default: 0)
set -u

SUITE="${SUITE:-a11y}"
CAASVER="${CAASVER:-0.51.5}"
BASE_URL="${BASE_URL:-https://business.adobe.com/resources/main.html}"
MAX_TURNS="${MAX_TURNS:-10}"

for v in IMS_ACCESS_TOKEN PROXY_URL MODEL; do
  if [ -z "${!v:-}" ]; then
    echo "ERROR: $v env var is required" >&2
    exit 2
  fi
done

QA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNNER="$QA_DIR/qa-runner-v2.mjs"

# Suite dispatch: "all" means concatenate every audit-*.txt across subdirs.
if [ "$SUITE" = "all" ]; then
  SCENARIOS=$(find "$QA_DIR/qa-prompts" -mindepth 2 -name 'audit-*.txt' | sort)
else
  SUITE_DIR="$QA_DIR/qa-prompts/$SUITE"
  if [ ! -d "$SUITE_DIR" ]; then
    echo "ERROR: suite '$SUITE' does not exist at $SUITE_DIR" >&2
    exit 2
  fi
  SCENARIOS=$(find "$SUITE_DIR" -maxdepth 1 -name 'audit-*.txt' | sort)
fi

if [ -z "$SCENARIOS" ]; then
  echo "ERROR: no scenarios found for suite '$SUITE'" >&2
  exit 2
fi

SCENARIO_COUNT=$(echo "$SCENARIOS" | wc -l | tr -d ' ')
RESULTS_DIR="${RESULTS_DIR:-$QA_DIR/results-$(date +%Y%m%d-%H%M%S)-${SUITE}-${CAASVER}}"
mkdir -p "$RESULTS_DIR"

SUMMARY="$RESULTS_DIR/SUMMARY.txt"
echo "# QA Audit Run" > "$SUMMARY"
echo "suite: $SUITE" >> "$SUMMARY"
echo "caasver: $CAASVER" >> "$SUMMARY"
echo "base_url: $BASE_URL" >> "$SUMMARY"
echo "scenario_count: $SCENARIO_COUNT" >> "$SUMMARY"
echo "started: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$SUMMARY"
echo "" >> "$SUMMARY"

URL="$BASE_URL?caasver=$CAASVER"
export IMS_ACCESS_TOKEN PROXY_URL MODEL MAX_TURNS
export RECORD_VIDEO="${RECORD_VIDEO:-0}"

OVERALL_START=$(date +%s)

while IFS= read -r scenario_file; do
  [ -z "$scenario_file" ] && continue
  scenario=$(basename "$scenario_file" .txt)
  log="$RESULTS_DIR/${scenario}.log"
  start=$(date +%s)
  echo "[$(date -u +%H:%M:%S)] $scenario starting..."

  prompt=$(cat "$scenario_file")
  instruction="Target URL: $URL"$'\n\n'"$prompt"
  node "$RUNNER" "$instruction" > "$log" 2>&1 || true

  elapsed=$(( $(date +%s) - start ))
  verdict=$(grep -oE '\[PASS\]|\[FAIL\]|FAIL_INCOMPLETE' "$log" | head -1)
  [ -z "$verdict" ] && verdict="[NO_VERDICT]"
  turns=$(grep -cE '^Turn ' "$log" || echo 0)
  printf "%-32s %4ss %3s turns %s\n" "$scenario" "$elapsed" "$turns" "$verdict" >> "$SUMMARY"
  echo "[$(date -u +%H:%M:%S)] $scenario done in ${elapsed}s ${verdict}"
done <<< "$SCENARIOS"

OVERALL=$(( $(date +%s) - OVERALL_START ))
echo "" >> "$SUMMARY"
echo "total: ${OVERALL}s" >> "$SUMMARY"

echo ""
echo "Full per-scenario logs in $RESULTS_DIR"
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "results_dir=$RESULTS_DIR" >> "$GITHUB_OUTPUT"
fi
echo "RESULTS_DIR=$RESULTS_DIR"
exit 0
