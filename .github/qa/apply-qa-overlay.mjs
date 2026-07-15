#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const QA_HOOK = `const QA_CONFIGS_PROPERTY = '__caasQaConfigs';
const QA_REPLACE_PROPERTY = '_caasQaReplace';
const QA_TARGET_INDEX_PROPERTY = '_caasQaTargetIndex';
const QA_TARGET_TOKEN_PROPERTY = '_caasQaTargetToken';
const QA_TARGET_FINGERPRINT_PROPERTY = '_caasQaTargetFingerprint';
const QA_TARGET_OCCURRENCE_PROPERTY = '_caasQaTargetOccurrence';
const QA_TARGET_ATTRIBUTE = 'data-caas-qa-target';
const QA_TARGET_FINGERPRINTS_PROPERTY = '__caasQaTargetFingerprints';
const QA_TARGET_STATUS_PROPERTY = '__caasQaTargetStatus';

const canonicalQaEndpoint = (value) => {
    try {
        const url = new URL(String(value || '').trim());
        if (!/^https?:$/.test(url.protocol)) return '';
        url.hash = '';
        const params = [...url.searchParams.entries()]
            .sort(([leftKey, leftValue], [rightKey, rightValue]) => leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue));
        url.search = '';
        params.forEach(([key, entryValue]) => url.searchParams.append(key, entryValue));
        return url.toString();
    } catch (e) { return ''; }
};

const qaConfigFingerprint = config => canonicalQaEndpoint(config?.collection?.endpoint);

const nextQaFingerprintOccurrence = (fingerprint) => {
    if (!fingerprint) return -1;
    try {
        const counts = window[QA_TARGET_FINGERPRINTS_PROPERTY] || {};
        const occurrence = Number(counts[fingerprint]) || 0;
        counts[fingerprint] = occurrence + 1;
        window[QA_TARGET_FINGERPRINTS_PROPERTY] = counts;
        return occurrence;
    } catch (e) { return -1; }
};

export const applyQaConfigOverride = (config, element) => {
    try {
        if (typeof window === 'undefined' || !window.location || !window.localStorage) return config;
        const params = new URLSearchParams(window.location.search || '');
        if (!params.has('caasqa')) return config;
        let configIndex = -1;
        try {
            window[QA_CONFIGS_PROPERTY] = Array.isArray(window[QA_CONFIGS_PROPERTY])
                ? window[QA_CONFIGS_PROPERTY] : [];
            configIndex = window[QA_CONFIGS_PROPERTY].length;
            window[QA_CONFIGS_PROPERTY].push(JSON.parse(JSON.stringify(config)));
        } catch (e) { /* capture is best-effort */ }
        const raw = window.localStorage.getItem('caasQaConfig');
        if (!raw) return config;
        const override = JSON.parse(raw);
        if (!isObject(override)) return config;
        const targetIndex = override[QA_TARGET_INDEX_PROPERTY];
        const targetToken = override[QA_TARGET_TOKEN_PROPERTY];
        const targetFingerprint = override[QA_TARGET_FINGERPRINT_PROPERTY];
        const targetOccurrence = override[QA_TARGET_OCCURRENCE_PROPERTY];
        const isTargeted = targetIndex !== undefined || targetFingerprint !== undefined || targetOccurrence !== undefined;
        if (isTargeted && (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex > 99)) return config;
        if (isTargeted && (typeof targetToken !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(targetToken))) return config;
        let actualFingerprint = '';
        let actualOccurrence = -1;
        if (targetFingerprint !== undefined) {
            const expectedFingerprint = canonicalQaEndpoint(targetFingerprint);
            actualFingerprint = qaConfigFingerprint(config);
            actualOccurrence = nextQaFingerprintOccurrence(actualFingerprint);
            if (!expectedFingerprint || !Number.isInteger(targetOccurrence) || targetOccurrence < 0 || targetOccurrence > 99
                || actualFingerprint !== expectedFingerprint || actualOccurrence !== targetOccurrence) {
                try {
                    if (!window[QA_TARGET_STATUS_PROPERTY]?.matched
                        && (configIndex === targetIndex || actualFingerprint === expectedFingerprint)) {
                        window[QA_TARGET_STATUS_PROPERTY] = {
                            matched: false, index: configIndex, occurrence: actualOccurrence,
                        };
                    }
                } catch (e) { /* target diagnostics are best-effort */ }
                return config;
            }
        } else if (isTargeted && configIndex !== targetIndex) return config;
        let marked = false;
        if (isTargeted) {
            try { element?.setAttribute?.(QA_TARGET_ATTRIBUTE, targetToken); marked = true; } catch (e) { /* marker is best-effort */ }
            try {
                window[QA_TARGET_STATUS_PROPERTY] = {
                    matched: marked, index: configIndex, occurrence: actualOccurrence,
                };
            } catch (e) { /* target diagnostics are best-effort */ }
        }
        const qaOverride = { ...override };
        delete qaOverride[QA_REPLACE_PROPERTY];
        delete qaOverride[QA_TARGET_INDEX_PROPERTY];
        delete qaOverride[QA_TARGET_TOKEN_PROPERTY];
        delete qaOverride[QA_TARGET_FINGERPRINT_PROPERTY];
        delete qaOverride[QA_TARGET_OCCURRENCE_PROPERTY];
        if (override[QA_REPLACE_PROPERTY] === true) {
            return qaOverride;
        }
        return mergeDeep(config, qaOverride);
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

  if (!/config=\{applyQaConfigOverride\(parseToPrimitive\(config\),\s*element\)\}/.test(app)) {
    const configPattern = /config=\{(?:applyQaConfigOverride\(parseToPrimitive\(config\)\)|parseToPrimitive\(config\))\}/;
    if (!configPattern.test(app)) throw new Error('could not locate Container config in historical app.jsx');
    app = app.replace(configPattern, 'config={applyQaConfigOverride(parseToPrimitive(config), element)}');
  }

  if (!general.includes('__caasQaConfigs') || !general.includes('_caasQaReplace') || !general.includes('_caasQaTargetFingerprint')) {
    const existingHook = /(?:const QA_CONFIGS_PROPERTY[\s\S]*?\n\n)?export const applyQaConfigOverride = \(config(?:, element)?\) => \{[\s\S]*?\n\};\n\n(?=const isCaasGroup)/;
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
