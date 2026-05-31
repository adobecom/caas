#!/bin/bash
# Runs every audit-*.txt scenario in the chosen suite, in parallel where
# possible. Designed to be invoked from a GitHub Actions workflow on a
# self-hosted runner.
#
# Required env vars:
#   IMS_ACCESS_TOKEN  - bearer token for LLM proxy
#   PROXY_URL         - LLM proxy endpoint URL
#   MODEL             - model name
#   CAASVER           - CaaS version tag to test against (e.g. "0.51.5")
#
# Optional env vars:
#   SUITE             - which suite to run: a11y | smoke | functional | regression | all (default: a11y)
#   WORKERS           - parallelism level (default: 4)
#   BASE_URL          - page to load (default: business.adobe.com/resources/main.html)
#   MAX_TURNS         - max agent turns per scenario (default: 10)
#   RECORD_VIDEO      - 1 to record per-scenario webm video (default: 0)

set -u

SUITE="${SUITE:-a11y}"
WORKERS="${WORKERS:-4}"
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
echo "workers: $WORKERS" >> "$SUMMARY"
echo "scenario_count: $SCENARIO_COUNT" >> "$SUMMARY"
echo "started: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$SUMMARY"
echo "" >> "$SUMMARY"

URL="$BASE_URL?caasver=$CAASVER"

export IMS_ACCESS_TOKEN PROXY_URL MODEL MAX_TURNS
export RECORD_VIDEO="${RECORD_VIDEO:-0}"
export URL RUNNER RESULTS_DIR SUMMARY

OVERALL_START=$(date +%s)

# Worker function. Each parallel invocation gets its own Chrome user-data-dir
# based on the subshell PID so concurrent runs do not collide.
run_one() {
  local scenario_file="$1"
  local scenario
  scenario=$(basename "$scenario_file" .txt)
  local log="$RESULTS_DIR/${scenario}.log"
  local user_data_dir="/tmp/chrome-qa-w$$"
  mkdir -p "$user_data_dir"
  local start
  start=$(date +%s)
  echo "[$(date -u +%H:%M:%S)] [worker:$$] $scenario starting..."
  local prompt
  prompt=$(cat "$scenario_file")
  local instruction
  instruction="Target URL: $URL"$'\n\n'"$prompt"
  # Override USER_DATA_DIR per worker; child node process spawns its own Chrome
  # in that profile so 4 workers don't collide on the same Playwright lock.
  USER_DATA_DIR="$user_data_dir" node "$RUNNER" "$instruction" > "$log" 2>&1 || true
  local elapsed=$(( $(date +%s) - start ))
  local verdict
  verdict=$(grep -oE '\[PASS\]|\[FAIL\]|FAIL_INCOMPLETE' "$log" | head -1)
  [ -z "$verdict" ] && verdict="[NO_VERDICT]"
  local turns
  turns=$(grep -cE '^Turn ' "$log" || echo 0)
  printf "%-32s %4ss %3s turns %s\n" "$scenario" "$elapsed" "$turns" "$verdict" >> "$SUMMARY"
  echo "[$(date -u +%H:%M:%S)] [worker:$$] $scenario done in ${elapsed}s ${verdict}"
}
export -f run_one

# Hand the scenario list to xargs with -P parallelism. Each invocation runs
# in its own subshell so $$ (PID) is unique per worker.
echo "$SCENARIOS" | xargs -n 1 -P "$WORKERS" -I {} bash -c 'run_one "$@"' _ {}

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
