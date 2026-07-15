import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { applyQaOverlay } from './apply-qa-overlay.mjs';

const appSource = `import { parseToPrimitive } from './components/Consonant/Helpers/general';
const view = <Container config={parseToPrimitive(config)} />;
`;
const generalSource = `export const mergeDeep = (target, ...sources) => target;

const isCaasGroup = group => group.indexOf('ch_') === 0;
`;

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), 'caas-overlay-'));
  const helperDir = path.join(root, 'react/src/js/components/Consonant/Helpers');
  mkdirSync(helperDir, { recursive: true });
  writeFileSync(path.join(root, 'react/src/js/app.jsx'), appSource);
  writeFileSync(path.join(helperDir, 'general.js'), generalSource);
  return root;
}

test('adds the gated capture/replace hook to a historical checkout', () => {
  const root = fixture();
  try {
    applyQaOverlay(root);
    const app = readFileSync(path.join(root, 'react/src/js/app.jsx'), 'utf8');
    const general = readFileSync(path.join(root, 'react/src/js/components/Consonant/Helpers/general.js'), 'utf8');
    assert.match(app, /parseToPrimitive, applyQaConfigOverride/);
    assert.match(app, /applyQaConfigOverride\(parseToPrimitive\(config\), element\)/);
    assert.match(general, /__caasQaConfigs/);
    assert.match(general, /_caasQaReplace/);
    assert.match(general, /_caasQaTargetIndex/);
    assert.match(general, /const QA_TARGET_FINGERPRINT_PROPERTY = '_caasQaTargetFingerprint';/);
    assert.match(general, /\/\* eslint-disable max-len \*\//);
    assert.match(general, /\/\* eslint-enable max-len \*\//);
    assert.doesNotMatch(general, /\/\* eslint-disable \*\//, 'must not suppress all lint rules');
    assert.doesNotMatch(general, /\?\./, 'must remain parseable by historical Babel 6 builds');
    assert.match(general, /Object\.assign\(\{\}, override\)/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('is idempotent', () => {
  const root = fixture();
  try {
    applyQaOverlay(root);
    applyQaOverlay(root);
    const general = readFileSync(path.join(root, 'react/src/js/components/Consonant/Helpers/general.js'), 'utf8');
    assert.equal((general.match(/export const applyQaConfigOverride/g) || []).length, 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('replaces a fenced stale hook without duplicating it', () => {
  const root = fixture();
  try {
    applyQaOverlay(root);
    const generalPath = path.join(root, 'react/src/js/components/Consonant/Helpers/general.js');
    const stale = readFileSync(generalPath, 'utf8')
      .replace("const QA_TARGET_FINGERPRINT_PROPERTY = '_caasQaTargetFingerprint';\n", '');
    writeFileSync(generalPath, stale);

    applyQaOverlay(root);
    const general = readFileSync(generalPath, 'utf8');
    assert.equal((general.match(/export const applyQaConfigOverride/g) || []).length, 1);
    assert.equal((general.match(/const QA_CONFIGS_PROPERTY/g) || []).length, 1);
    assert.equal((general.match(/\/\* eslint-disable max-len \*\//g) || []).length, 1);
    assert.equal((general.match(/\/\* eslint-enable max-len \*\//g) || []).length, 1);
    assert.match(general, /const QA_TARGET_FINGERPRINT_PROPERTY = '_caasQaTargetFingerprint';/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
