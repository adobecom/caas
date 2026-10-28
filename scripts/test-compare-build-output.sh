#!/usr/bin/env bash
# Regression checks for metadata normalization versus meaningful output changes.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEST_DIR=$(mktemp -d)
trap 'rm -rf "$TEST_DIR"' EXIT
mkdir -p "$TEST_DIR/base" "$TEST_DIR/head"
cat > "$TEST_DIR/base/main.js" <<'JS'
/*! Chimera UI Libraries - Build 0.69.0 (yesterday) */
const telemetry = {
  marker: 'caas_telemetry_v2',
  release: "0.69.0",
  build: "aeae243b388a" || 'unknown',
  mode: run ? 'test' : 'sample',
  sampleRate: 10
};
const pulse = {
  marker: 'caas_pulse_v1',
  build: "aeae243b388a" || 'unknown',
  mode: 'sample'
};
const other = {
  build: "aeae243b388a" || 'unknown',
};
JS
printf '.card { display: grid; }\n' > "$TEST_DIR/base/app.css"
reset_head() { cp "$TEST_DIR/base/"* "$TEST_DIR/head/"; }
expect() {
  bash "$SCRIPT_DIR/compare-build-output.sh" "$TEST_DIR/base" "$TEST_DIR/head" "$TEST_DIR/$1" >/dev/null
  test "$(cat "$TEST_DIR/$1/result.txt")" = "$2"
  echo "PASS: $1 ($2)"
}
reset_head
expect identical NO_CHANGE
sed -E "/Chimera UI Libraries/s/yesterday/today/; /marker: 'caas_(telemetry_v2|pulse_v1)'/,/mode:/s/aeae243b388a/0a0313ea2c9e/" "$TEST_DIR/base/main.js" > "$TEST_DIR/head/main.js"
expect metadata-only NO_CHANGE
sed 's/sampleRate: 10/sampleRate: 50/' "$TEST_DIR/base/main.js" > "$TEST_DIR/head/main.js"
expect sampling-change CHANGED
sed "s/|| 'unknown'/|| 'different'/" "$TEST_DIR/base/main.js" > "$TEST_DIR/head/main.js"
expect fallback-change CHANGED
sed '/const other/,$s/aeae243b388a/0a0313ea2c9e/' "$TEST_DIR/base/main.js" > "$TEST_DIR/head/main.js"
expect unrelated-build-field CHANGED
reset_head
printf '.card { display: none; }\n' > "$TEST_DIR/head/app.css"
expect style-change CHANGED
reset_head
printf '\nrenderCards();\n' >> "$TEST_DIR/head/main.js"
expect code-change CHANGED
