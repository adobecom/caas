import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_DIR = path.join(HERE, 'manifests');
const ID_PATTERN = /^[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)*\.v[1-9][0-9]*$/;
const PARAM_TYPES = new Set(['string', 'identifier', 'url', 'tag']);
export const EXPLORATORY_CONTRACT_ID = 'exploratory.collection.v1';
export const SUPPORTED_CONTRACT_KINDS = new Set([
  'card-metadata-attributes',
  'collection-empty-events-removal',
  'filter-nested-prune',
  'card-button-cta',
]);

const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const text = (value) => (value === undefined || value === null ? '' : String(value));

function cleanParameter(name, value) {
  const definition = asObject(value);
  const type = text(definition.type).trim();
  if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) throw new Error(`invalid contract parameter name: ${name}`);
  if (!PARAM_TYPES.has(type)) throw new Error(`unsupported parameter type for ${name}: ${type}`);
  if (!Object.hasOwn(definition, 'default')) throw new Error(`contract parameter ${name} needs a default`);
  return { type, default: text(definition.default), description: text(definition.description).slice(0, 500) };
}

/** Validate an inert JSON manifest. It deliberately cannot contain executable code. */
export function validateContractManifest(value) {
  const manifest = asObject(value);
  const id = text(manifest.id).trim();
  const version = Number(manifest.version);
  const kind = text(manifest.kind).trim();
  if (!ID_PATTERN.test(id)) throw new Error(`invalid contract id: ${id || '(missing)'}`);
  if (!Number.isInteger(version) || version < 1) throw new Error(`invalid contract version for ${id}`);
  if (Number(id.match(/\.v([1-9][0-9]*)$/)?.[1]) !== version) {
    throw new Error(`contract id/version mismatch for ${id}`);
  }
  if (!SUPPORTED_CONTRACT_KINDS.has(kind)) throw new Error(`unsupported contract kind for ${id}: ${kind || '(missing)'}`);
  const title = text(manifest.title).trim();
  const summary = text(manifest.summary).trim();
  if (!title || !summary) throw new Error(`contract ${id} needs title and summary`);
  const useWhen = (Array.isArray(manifest.useWhen) ? manifest.useWhen : [])
    .map((item) => text(item).trim()).filter(Boolean).slice(0, 8);
  if (!useWhen.length) throw new Error(`contract ${id} needs at least one useWhen hint`);
  const params = Object.fromEntries(Object.entries(asObject(manifest.params))
    .map(([name, definition]) => [name, cleanParameter(name, definition)]));
  const sourceHints = (Array.isArray(manifest.sourceHints) ? manifest.sourceHints : []).map((hint) => {
    const input = asObject(hint);
    const file = text(input.file).trim();
    if (!file || path.isAbsolute(file) || file.includes('..')) throw new Error(`unsafe source hint in ${id}`);
    const symbol = text(input.symbol).trim().slice(0, 200);
    const needles = (Array.isArray(input.needles) ? input.needles : [])
      .map((needle) => text(needle).trim()).filter(Boolean).slice(0, 4);
    if (!symbol || !needles.length) throw new Error(`source hint needs symbol and needles in ${id}`);
    if (needles.some((needle) => needle.length > 120 || /[\r\n\0]/.test(needle))) {
      throw new Error(`unsafe source hint needle in ${id}`);
    }
    return { file, symbol, needles };
  }).slice(0, 12);
  if (!sourceHints.length) throw new Error(`contract ${id} needs at least one source hint`);
  return { id, version, kind, title, summary, useWhen, params, sourceHints };
}

function readManifest(file) {
  const source = readFileSync(file, 'utf8');
  let parsed;
  try { parsed = JSON.parse(source); } catch (error) {
    throw new Error(`invalid contract JSON ${path.basename(file)}: ${error.message}`);
  }
  return { ...validateContractManifest(parsed), manifestHash: createHash('sha256').update(source).digest('hex') };
}

let cache;

/** Load the QA-owned, versioned catalog. It is small and intentionally immutable at runtime. */
export function listScenarioContracts() {
  if (!cache) {
    const files = readdirSync(MANIFEST_DIR).filter((file) => file.endsWith('.json')).sort();
    const contracts = files.map((file) => readManifest(path.join(MANIFEST_DIR, file)));
    const ids = new Set();
    for (const contract of contracts) {
      if (ids.has(contract.id)) throw new Error(`duplicate scenario contract id: ${contract.id}`);
      ids.add(contract.id);
    }
    cache = contracts;
  }
  return cache.map((contract) => ({ ...contract, params: { ...contract.params },
    sourceHints: contract.sourceHints.map((hint) => ({ ...hint, needles: [...hint.needles] })) }));
}

export function getScenarioContract(id) {
  return listScenarioContracts().find((contract) => contract.id === id) || null;
}

/** Compact, prompt-safe catalog view. The model chooses; it never supplies executable contract logic. */
export function contractCatalogGuidance(maxChars = 7000) {
  const contracts = listScenarioContracts().map((contract) => ({
    id: contract.id,
    title: contract.title,
    summary: contract.summary,
    useWhen: contract.useWhen,
    params: Object.fromEntries(Object.entries(contract.params).map(([name, definition]) => [name, {
      type: definition.type,
      default: definition.default,
    }])),
    sourceHints: contract.sourceHints.map(({ file, symbol }) => ({ file, symbol })),
  }));
  const guide = {
    managedContracts: contracts,
    exploratory: {
      id: EXPLORATORY_CONTRACT_ID,
      summary: 'Use only when no managed contract matches. It is an exploratory result, not a certified contract result; provide the complete config/cards/filters/probes/renderability scenario.',
    },
  };
  return JSON.stringify(guide).slice(0, Math.max(500, Number(maxChars) || 7000));
}

/** Test helper for callers that need to re-read manifests after creating a temporary catalog. */
export function clearContractCatalogCache() {
  cache = undefined;
}
