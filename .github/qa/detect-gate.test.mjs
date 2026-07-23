import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isNonProductPath, classifyChangedPaths } from './detect-gate.mjs';

test('product source (jsx/js/css) is testable', () => {
  for (const p of [
    'react/src/js/components/Consonant/Card/Card.jsx',
    'react/src/css/card.css',
    'react/src/js/components/Consonant/Helpers/general.js',
    'react/src/js/utils/style.scss',
  ]) assert.equal(isNonProductPath(p), false, p);
});

test('docs and named metadata are non-product', () => {
  for (const p of [
    'README.md', 'docs/setup.md', 'documentation/guide.mdx',
    'LICENSE', 'CHANGELOG.md', 'CODEOWNERS', 'AUTHORS',
  ]) assert.equal(isNonProductPath(p), true, p);
});

test('CI / tooling files are non-product', () => {
  for (const p of [
    '.github/workflows/ci.yml', '.husky/pre-commit', '.vscode/settings.json',
    '.gitignore', '.eslintrc.js', '.prettierrc', '.stylelintrc.json',
    '.editorconfig', '.nvmrc', 'babel.config.js', 'jest.config.mjs',
    'renovate.json', 'package-lock.json', 'yarn.lock',
  ]) assert.equal(isNonProductPath(p), true, p);
});

test('package.json is treated as product (a dep change can alter the bundle)', () => {
  assert.equal(isNonProductPath('package.json'), false);
});

test('#469 line-clamp (visual/CSS-only product change) passes the gate', () => {
  const c = classifyChangedPaths(['react/src/css/card.css']);
  assert.equal(c.skip, false);
  assert.deepEqual(c.productPaths, ['react/src/css/card.css']);
});

test('#366 no-op console.log removal (product source) passes the gate', () => {
  const c = classifyChangedPaths(['react/src/js/components/Consonant/Card/Card.jsx']);
  assert.equal(c.skip, false);
});

test('docs-only PR is skipped', () => {
  const c = classifyChangedPaths(['README.md', 'docs/x.md', 'CHANGELOG.md']);
  assert.equal(c.skip, true);
  assert.equal(c.productPaths.length, 0);
  assert.equal(c.nonProductPaths.length, 3);
});

test('mixed docs + product renders (product wins)', () => {
  const c = classifyChangedPaths(['README.md', 'react/src/js/app.jsx']);
  assert.equal(c.skip, false);
  assert.deepEqual(c.productPaths, ['react/src/js/app.jsx']);
  assert.deepEqual(c.nonProductPaths, ['README.md']);
});

test('empty change set skips', () => {
  assert.equal(classifyChangedPaths([]).skip, true);
  assert.equal(classifyChangedPaths().skip, true);
});
