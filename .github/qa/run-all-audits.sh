#!/bin/bash
# Runs every audit-*.txt scenario sequentially against the given caasver page.
# Designed to be invoked from a GitHub Actions workflow on a self-hosted runner.
#
# Required env vars:
#   IMS_ACCESS_TOKEN  - Adobe IMS token (from repo secret)
#   CAASVER           - CaaS version tag to test against (e.g. "0.51.5")
#   BASE_URL          - page to load (default: business.adobe.com/resources/main.html)
#   USER_DATA_DIR     - persistent Chrome profile dir (default: /tmp/chrome-qa-profile)
#   MAX_TURNS         - max agent turns per scenario (default: 10)

set -u

CAASVER="${CAASVER:-0.51.5}"
BASE_URL="${BASE_URL:-https://business.adobe.com/resources/main.html}"
USER_DATA_DIR="${USER_DATA_DIR:-/tmp/chrome-qa-profile}"
MAX_TURNS="${MAX_TURNS:-10}"

if [ -z "${IMS_ACCESS_TOKEN:-}" ]; then
  echo "ERROR: IMS_ACCESS_TOKEN env var is required" >&2
  exit 2
fi

QA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPTS_DIR="$QA_DIR/qa-prompts"
RUNNER="$QA_DIR/qa-runner-v2.mjs"

RESULTS_DIR="${RESULTS_DIR:-$QA_DIR/results-$(date +%Y%m%d-%H%M%S)-${CAASVER}}"
mkdir -p "$RESULTS_DIR"
SUMMARY="$RESULTS_DIR/SUMMARY.txt"
echo "# QA Audit Run" > "$SUMMARY"
echo "caasver: $CAASVER" >> "$SUMMARY"
echo "base_url: $BASE_URL" >> "$SUMMARY"
echo "started: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$SUMMARY"
echo "" >> "$SUMMARY"

URL="$BASE_URL?caasver=$CAASVER"

export IMS_ACCESS_TOKEN USER_DATA_DIR MAX_TURNS PROXY_URL MODEL
export RECORD_VIDEO="${RECORD_VIDEO:-0}"

OVERALL_START=$(date +%s)

for SCENARIO_FILE in "$PROMPTS_DIR"/audit-*.txt; do
  SCENARIO=$(basename "$SCENARIO_FILE" .txt)
  pkill -f "$USER_DATA_DIR" 2>/dev/null || true
  sleep 2
  LOG="$RESULTS_DIR/${SCENARIO}.log"
  PROMPT=$(cat "$SCENARIO_FILE")
  INSTRUCTION="Target URL: $URL"$'\n\n'"$PROMPT"
  START=$(date +%s)
  echo "[$SCENARIO] starting at $(date -u +%H:%M:%S)..."
  node "$RUNNER" "$INSTRUCTION" > "$LOG" 2>&1 || true
  ELAPSED=$(( $(date +%s) - START ))
  VERDICT=$(grep -oE '\[PASS\]|\[FAIL\]|FAIL_INCOMPLETE' "$LOG" | head -1)
  [ -z "$VERDICT" ] && VERDICT="[NO_VERDICT]"
  TURNS=$(grep -cE '^Turn ' "$LOG" || echo 0)
  printf "%-32s %4ss %3s turns %s\n" "$SCENARIO" "$ELAPSED" "$TURNS" "$VERDICT" | tee -a "$SUMMARY"
done

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
