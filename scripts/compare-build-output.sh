#!/usr/bin/env2bash
#
# compare-build-output.sh
#
# Deterministic "did the shipped bundle actually change?" check.
# Compares two build-output directories and reports NO_CHANGE or CHANGED.
# This is the non-AI Layer 1: it only decides whether anything changed and,
# if so, produces a readable diff. Judgment (screenshots, is-this-important)
# is left to Layer 2 (the QA agent) which consumes the artifacts written here.
#
# Advisory / non-blocking: ALWAYS exits 0 so it can never block a merge.
#
# Usage:
#   compare-build-output.sh <base_dist_dir> <head_dist_dir> <out_dir>
#
# Writes into <out_dir>:
#   result.txt      -> NO_CHANGE | CHANGED
#   summary.md      -> human/agent readable summary (with a diff preview)
#   <file>.diff     -> full unified diff, one per changed file
#
set -euo pipefail

BASE_DIR="${1:?base dist dir required}"
HEAD_DIR="${2:?head dist dir required}"
OUT_DIR="${3:?out dir required}"
mkdir -p "$OUT_DIR"

# The files that represent what actually ships.
#   main.js  -> the UNMINIFIED bundle. We diff this because it is readable;
#               main.min.js is derived from it, so if main.js is unchanged the
#               minified output is too (modulo the banner we strip below).
#   app.css  -> the compiled styles.
FILES=("main.js" "app.css")

# Strip build-time noise before comparing. webpack's BannerPlugin injects a line
# containing a fresh timestamp (and the git version) on EVERY build, so without
# this the diff would report a change every single time. Add more patterns here
# if other non-deterministic lines ever show up.
normalize() {
  # $1 = input path, $2 = output path
  if [[ -f "$1" ]]; then
    sed '/Chimera UI Libraries - Build/d' "$1" > "$2"
  else
    : > "$2"   # missing file -> treat as empty so comparison still works
  fi
}

changed=0
{
  echo "## Build output diff"
  echo
  echo "Compares the built bundle on the PR against the base branch, after"
  echo "normalizing away the build-timestamp banner."
  echo
} > "$OUT_DIR/summary.md"

for f in "${FILES[@]}"; do
  base_norm="$OUT_DIR/.base.$f"
  head_norm="$OUT_DIR/.head.$f"
  normalize "$BASE_DIR/$f" "$base_norm"
  normalize "$HEAD_DIR/$f" "$head_norm"

  base_hash=$(sha256sum "$base_norm" | awk '{print $1}')
  head_hash=$(sha256sum "$head_norm" | awk '{print $1}')

  if [[ "$base_hash" == "$head_hash" ]]; then
    echo "- \`$f\`: unchanged" >> "$OUT_DIR/summary.md"
  else
    changed=1
    diff -u "$base_norm" "$head_norm" > "$OUT_DIR/$f.diff" || true
    # +/- counts exclude the ---/+++ file headers
    added=$(grep -cE '^\+[^+]' "$OUT_DIR/$f.diff" || true)
    removed=$(grep -cE '^-[^-]' "$OUT_DIR/$f.diff" || true)
    echo "- \`$f\`: **CHANGED** (+${added} / -${removed} lines) -> see \`$f.diff\`" >> "$OUT_DIR/summary.md"
    {
      echo
      echo "<details><summary>Preview: $f (first 60 diff lines)</summary>"
      echo
      echo '```diff'
      head -n 60 "$OUT_DIR/$f.diff"
      echo '```'
      echo
      echo "</details>"
    } >> "$OUT_DIR/summary.md"
  fi
  rm -f "$base_norm" "$head_norm"
done

echo >> "$OUT_DIR/summary.md"
if [[ "$changed" -eq 0 ]]; then
  echo "NO_CHANGE" > "$OUT_DIR/result.txt"
  echo "**Result: NO_CHANGE** — the shipped bundle is identical after normalization. Nothing users receive changes; safe to fast-track." >> "$OUT_DIR/summary.md"
else
  echo "CHANGED" > "$OUT_DIR/result.txt"
  echo "**Result: CHANGED** — the shipped bundle differs. Review the diff(s) above (and screenshots, once Layer 2 is wired) before approving." >> "$OUT_DIR/summary.md"
fi

echo "RESULT=$(cat "$OUT_DIR/result.txt")"
