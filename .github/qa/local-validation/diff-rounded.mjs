#!/usr/bin/env node
/**
 * Local visual-diff validation harness.
 *
 * Loads two URLs in headless Chromium, takes pinned-viewport screenshots,
 * runs ImageMagick AE compare at multiple fuzz levels, and prints a sensitivity
 * table. Use to verify the visual-diff prompt correctly classifies a
 * known-regression A/B pair as FAIL and a noise-floor A/B pair as PASS.
 *
 * Usage: node diff-rounded.mjs <urlA> <urlB> [outDir]
 *
 * Prerequisites:
 *   - playwright installed (npm i playwright; npx playwright install chromium)
 *   - ImageMagick `magick` binary on PATH (brew install imagemagick)
 *   - A local http server serving the repo root, e.g.:
 *       cd <repo root> && python3 -m http.server 8765
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

const [,, urlA, urlB, outDirArg] = process.argv;
if (!urlA || !urlB) {
  console.error('Usage: node diff-rounded.mjs <urlA> <urlB> [outDir]');
  process.exit(2);
}
const OUT = outDirArg || '/tmp/visual-diff-validation';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

async function shoot(url, name) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('.consonant-Card', { timeout: 10000 });
  await page.waitForTimeout(800);
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  return path;
}

const a = await shoot(urlA, 'a');
const b = await shoot(urlB, 'b');
await browser.close();

function compareAt(fuzz) {
  try {
    execSync(`magick compare -metric AE -fuzz ${fuzz}% "${a}" "${b}" "${OUT}/diff-fuzz${fuzz}.png" 2>&1`, { stdio: 'pipe' });
    return { pixels: 0, fraction: 0 };
  } catch (e) {
    const stderr = (e.stderr || e.stdout || '').toString().trim();
    const m = stderr.match(/^(\d+)(?:\s*\(([\d.eE-]+)\))?/);
    if (!m) return { pixels: -1, fraction: -1, raw: stderr };
    return { pixels: parseInt(m[1], 10), fraction: m[2] ? parseFloat(m[2]) : 0 };
  }
}

const totalPixels = 1440 * 900;
const PASS_THRESHOLD = 0.05; // % of frame; matches qa-prompts/visual-diff/version-diff.txt

console.log('Visual-diff sensitivity scan');
console.log('  URL A:', urlA);
console.log('  URL B:', urlB);
console.log('  PASS threshold (per prompt):', PASS_THRESHOLD + '% of frame\n');
console.log('  fuzz |   pixels |       frac | % of frame | verdict');
console.log('  -----+----------+------------+------------+--------');
for (const fuzz of [0, 1, 2, 5]) {
  const { pixels, fraction } = compareAt(fuzz);
  const pct = (pixels / totalPixels * 100);
  const verdict = pct < PASS_THRESHOLD ? 'PASS' : 'FAIL';
  console.log(`   ${String(fuzz).padStart(2)}% | ${String(pixels).padStart(8)} | ${fraction.toExponential(3).padStart(10)} | ${pct.toFixed(4).padStart(8)}% | ${verdict}`);
}
console.log('\nDiff overlays written to', OUT);
