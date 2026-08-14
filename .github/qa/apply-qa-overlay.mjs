#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const QA_HOOK = `const QA_CONFIGS_PROPERTY = '__caasQaConfigs';
const QA_REPLACE_PROPERTY = '_caasQaReplace';

export const applyQaConfigOverride = (config) => {
    try {
        if (typeof window === 'undefined' || !window.location || !window.localStorage) return config;
        const params = new URLSearchParams(window.location.search || '');
        if (!params.has('caasqa')) return config;
        try {
            window[QA_CONFIGS_PROPERTY] = window[QA_CONFIGS_PROPERTY] || [];
            window[QA_CONFIGS_PROPERTY].push(JSON.parse(JSON.stringify(config)));
        } catch (e) { /* capture is best-effort */ }
        const raw = window.localStorage.getItem('caasQaConfig');
        if (!raw) return config;
        const override = JSON.parse(raw);
        if (!isObject(override)) return config;
        if (override[QA_REPLACE_PROPERTY] === true) {
            const replacement = { ...override };
            delete replacement[QA_REPLACE_PROPERTY];
            return replacement;
        }
        return mergeDeep(config, override);
    } catch (e) {
        return config;
    }
};`;

export function applyQaOverlay(repoRoot) {
  const root = path.resolve(repoRoot);
  const appPath = path.join(root, 'react/src/js/app.jsx');
  const generalPath = path.join(root, 'react/src/js/components/Consonant/Helpers/general.js');
  let app = readFileSync(appPath, 'utf8');
  let general = readFileSync(generalPath, 'utf8');

  if (!/import\s*\{[^}]*\bapplyQaConfigOverride\b[^}]*\}\s*from\s*['"]\.\/components\/Consonant\/Helpers\/general['"]/.test(app)) {
    const importPattern = /(import\s*\{)([^}]*\bparseToPrimitive\b[^}]*)(\}\s*from\s*['"]\.\/components\/Consonant\/Helpers\/general['"];?)/;
    if (!importPattern.test(app)) throw new Error('could not locate parseToPrimitive import in historical app.jsx');
    app = app.replace(importPattern, (match, start, imports, end) =>
      `${start}${imports.trimEnd()}, applyQaConfigOverride ${end}`);
  }

  if (!/config=\{applyQaConfigOverride\(parseToPrimitive\(config\)\)\}/.test(app)) {
    const configPattern = /config=\{parseToPrimitive\(config\)\}/;
    if (!configPattern.test(app)) throw new Error('could not locate Container config in historical app.jsx');
    app = app.replace(configPattern, 'config={applyQaConfigOverride(parseToPrimitive(config))}');
  }

  if (!general.includes('__caasQaConfigs') || !general.includes('_caasQaReplace')) {
    const existingHook = /(?:const QA_CONFIGS_PROPERTY[\s\S]*?\n\n)?export const applyQaConfigOverride = \(config\) => \{[\s\S]*?\n\};\n\n(?=const isCaasGroup)/;
    if (existingHook.test(general)) general = general.replace(existingHook, `${QA_HOOK}\n\n`);
    else {
      const insertionPoint = /\nconst isCaasGroup\s*=/;
      if (!insertionPoint.test(general)) throw new Error('could not locate QA hook insertion point in historical general.js');
      general = general.replace(insertionPoint, `\n${QA_HOOK}\n\nconst isCaasGroup =`);
    }
  }

  writeFileSync(appPath, app);
  writeFileSync(generalPath, general);
  return { appPath, generalPath };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const repoRoot = process.argv[2];
  if (!repoRoot) throw new Error('usage: apply-qa-overlay.mjs <repo-root>');
  const changed = applyQaOverlay(repoRoot);
  console.log(`[overlay] applied to ${changed.appPath} and ${changed.generalPath}`);
}
