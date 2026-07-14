import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyJsonFailure, parseJsonObject, requestBoundedJson } from './llm-json.mjs';
import { applyScenarioRepair } from './renderability.mjs';

const frozenRepairPlan = {
  sourceTest: 'Container.spec.js > exact target',
  expected: 'sentinel card renders',
  observe: 'initial DOM',
  mappingEvidence: [{ file: 'Container.jsx', line: 1, fact: 'fixture reaches Container' }],
  probes: [{ selector: '#sentinel', attributes: [], why: 'exact target' }],
  renderability: { requiredInitial: [{ selector: '#sentinel', minMatches: 1, why: 'exact target' }] },
  config: { collection: { cardStyle: 'old' } },
  cards: [],
  filters: [],
  isHashed: false,
};

const validRepair = {
  config: { collection: { cardStyle: 'new' } },
  cards: [{ id: 'sentinel' }],
  filters: [],
  isHashed: true,
};

test('parses a fenced JSON object', () => {
  assert.deepEqual(parseJsonObject('```json\n{"ok":true}\n```'), { ok: true, value: { ok: true } });
});

test('classifies an incomplete max-token response as truncated', () => {
  const parse = parseJsonObject('{"sourceTest":');
  assert.equal(parse.kind, 'unclosed_json');
  assert.equal(classifyJsonFailure({ parse, stopReason: 'max_tokens' }), 'truncated');
});

test('retries an incomplete response with a compact request', async () => {
  const calls = [];
  const result = await requestBoundedJson({
    ask: async (prompt, maxTokens) => {
      calls.push({ prompt, maxTokens });
      return calls.length === 1
        ? { text: '{"sourceTest":', stopReason: 'max_tokens' }
        : { text: '{"sourceTest":"fixture"}', stopReason: 'end_turn' };
    },
    prompt: 'plan',
    label: 'plan',
    maxTokens: 16000,
    retryMaxTokens: 8000,
    maxChars: 24000,
    retrySuffix: 'compact',
  });
  assert.deepEqual(result.value, { sourceTest: 'fixture' });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].maxTokens, 8000);
  assert.match(calls[1].prompt, /compact/);
  assert.equal(result.attempts[0].kind, 'truncated');
});

test('retries malformed, oversized, and schema-invalid responses', async () => {
  const cases = [
    { first: { text: '{bad}', stopReason: 'end_turn' }, expected: 'malformed_json' },
    { first: { text: `{"value":"${'x'.repeat(30)}"}`, stopReason: 'end_turn' }, expected: 'oversized_response', maxChars: 20 },
    { first: { text: '{"value":false}', stopReason: 'end_turn' }, expected: 'schema_invalid' },
  ];
  for (const { first, expected, maxChars = 24000 } of cases) {
    let calls = 0;
    const result = await requestBoundedJson({
      ask: async () => {
        calls += 1;
        return calls === 1 ? first : { text: '{"value":true}', stopReason: 'end_turn' };
      },
      prompt: 'plan',
      label: 'plan',
      maxTokens: 10,
      maxChars,
      retrySuffix: 'compact',
      parseAndValidate: (value) => {
        if (!value.value) throw new Error('invalid');
        return value;
      },
    });
    assert.equal(result.attempts[0].kind, expected);
    assert.equal(result.value.value, true);
  }
});

test('terminal JSON error includes metadata but never raw model text', async () => {
  await assert.rejects(
    requestBoundedJson({
      ask: async () => ({ text: 'SECRET-RAW-MODEL-OUTPUT {"partial":', stopReason: 'max_tokens' }),
      prompt: 'plan',
      label: 'plan',
      maxTokens: 10,
      maxChars: 24000,
      retrySuffix: 'compact',
    }),
    (error) => /kind=truncated/.test(error.message) && /chars=/.test(error.message) && !error.message.includes('SECRET-RAW-MODEL-OUTPUT'),
  );
});

test('retries malformed renderability repair JSON without retaining raw text', async () => {
  const calls = [];
  const result = await requestBoundedJson({
    ask: async (prompt, maxTokens) => {
      calls.push({ prompt, maxTokens });
      return calls.length === 1
        ? { text: '{SECRET-RAW-REPAIR}', stopReason: 'end_turn' }
        : { text: JSON.stringify(validRepair), stopReason: 'end_turn' };
    },
    prompt: 'repair',
    label: 'renderability repair',
    maxTokens: 12000,
    retryMaxTokens: 8000,
    maxChars: 24000,
    retrySuffix: 'complete repair only',
    parseAndValidate: (rawRepair) => applyScenarioRepair(frozenRepairPlan, rawRepair),
  });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].maxTokens, 8000);
  assert.match(calls[1].prompt, /complete repair only/);
  assert.equal(result.attempts[0].kind, 'malformed_json');
  assert.equal(JSON.stringify(result.attempts).includes('SECRET-RAW-REPAIR'), false);
  assert.equal(result.value.sourceTest, frozenRepairPlan.sourceTest);
  assert.deepEqual(result.value.cards, validRepair.cards);
});

test('retries an unsafe but valid renderability repair without changing the frozen contract', async () => {
  let calls = 0;
  const result = await requestBoundedJson({
    ask: async () => {
      calls += 1;
      return {
        text: JSON.stringify(calls === 1 ? { ...validRepair, sourceTest: 'tampered' } : validRepair),
        stopReason: 'end_turn',
      };
    },
    prompt: 'repair',
    label: 'renderability repair',
    maxTokens: 12000,
    retryMaxTokens: 8000,
    maxChars: 24000,
    retrySuffix: 'complete repair only',
    parseAndValidate: (rawRepair) => applyScenarioRepair(frozenRepairPlan, rawRepair),
  });
  assert.equal(result.attempts[0].kind, 'schema_invalid');
  assert.equal(result.value.sourceTest, frozenRepairPlan.sourceTest);
  assert.deepEqual(result.value.probes, frozenRepairPlan.probes);
  assert.deepEqual(result.value.renderability, frozenRepairPlan.renderability);
});

test('terminal renderability-repair JSON failure exposes metadata but not raw text', async () => {
  await assert.rejects(
    requestBoundedJson({
      ask: async () => ({ text: '{SECRET-RAW-REPAIR}', stopReason: 'end_turn' }),
      prompt: 'repair',
      label: 'renderability repair',
      maxTokens: 12000,
      retryMaxTokens: 8000,
      maxChars: 24000,
      retrySuffix: 'complete repair only',
      parseAndValidate: (rawRepair) => applyScenarioRepair(frozenRepairPlan, rawRepair),
    }),
    (error) => /renderability repair JSON invalid after 2 attempts/.test(error.message)
      && !error.message.includes('SECRET-RAW-REPAIR'),
  );
});
