import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyJsonFailure, parseJsonObject, requestBoundedJson } from './llm-json.mjs';

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
