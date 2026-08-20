import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import _Ajv2020 from 'ajv/dist/2020.js';
const Ajv2020 = _Ajv2020.default || _Ajv2020;

const SCHEMA_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'caas-schema.json');
const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateFn = ajv.compile(schema);

/**
 * Validate the agent's emitted scenario (config patch + crafted cards) against the
 * deterministic CaaS payload schema. Structure/enum guardrail only: it forbids invented
 * config keys and invalid enum values (the dominant historical shape-mistakes). It does
 * NOT judge semantic placement — that is the runtime render-checkpoint's job.
 * @returns {{ valid: boolean, errors: string }}
 */
export function validateScenario({ configPatch, cards } = {}) {
  const payload = {};
  if (configPatch !== undefined) payload.configPatch = configPatch;
  if (Array.isArray(cards)) payload.cards = cards;
  const valid = validateFn(payload);
  return { valid, errors: valid ? '' : ajv.errorsText(validateFn.errors, { separator: '; ' }) };
}
