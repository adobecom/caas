function cleanJsonText(source) {
  return String(source).replace(/```(?:json)?/gi, '').trim();
}

/**
 * Parse the single JSON object required by the QA-agent contracts without
 * retaining a model response when it is invalid. Callers can safely record the
 * returned failure kind and character count in public job artifacts.
 */
export function parseJsonObject(source) {
  const text = cleanJsonText(source);
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1) return { ok: false, kind: 'no_json_object' };
  if (end <= start) return { ok: false, kind: 'unclosed_json' };
  try {
    return { ok: true, value: JSON.parse(text.slice(start, end + 1)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      kind: /unexpected end of json input/i.test(message) ? 'unclosed_json' : 'malformed_json',
    };
  }
}

export function classifyJsonFailure({ parse, stopReason }) {
  if (stopReason === 'max_tokens') return 'truncated';
  if (stopReason && stopReason !== 'end_turn') return 'non_terminal_response';
  return parse?.kind || 'malformed_json';
}

function summary(attempts) {
  return attempts.map(({ attempt, kind, stopReason, chars }) =>
    `attempt=${attempt} kind=${kind} stop=${stopReason || 'unknown'} chars=${chars}`).join('; ');
}

/**
 * Ask for one bounded JSON object, then make one compact retry if the provider
 * ended early, the response is malformed/oversized, or the caller's schema
 * check rejects it. Raw model text is intentionally neither returned on error
 * nor placed in the diagnostic.
 */
export async function requestBoundedJson({
  ask,
  prompt,
  label = 'response',
  maxTokens,
  retryMaxTokens = maxTokens,
  maxChars,
  retrySuffix,
  parseAndValidate = (value) => value,
}) {
  if (typeof ask !== 'function') throw new Error('ask is required');
  const attempts = [];
  for (let index = 0; index < 2; index += 1) {
    const response = await ask(index === 0 ? prompt : `${prompt}\n\n${retrySuffix}`, index === 0 ? maxTokens : retryMaxTokens);
    const text = String(response?.text || '');
    const stopReason = String(response?.stopReason || 'unknown');
    let kind = '';
    let parsed;
    if (text.length > maxChars) {
      kind = 'oversized_response';
    } else {
      parsed = parseJsonObject(text);
      if (!parsed.ok) kind = classifyJsonFailure({ parse: parsed, stopReason });
      else if (stopReason !== 'end_turn') kind = classifyJsonFailure({ parse: parsed, stopReason });
    }

    if (!kind) {
      try {
        const value = await parseAndValidate(parsed.value);
        attempts.push({ attempt: index + 1, kind: 'ok', stopReason, chars: text.length });
        return { value, attempts };
      } catch {
        kind = 'schema_invalid';
      }
    }
    attempts.push({ attempt: index + 1, kind, stopReason, chars: text.length });
  }
  throw new Error(`${label} JSON invalid after ${attempts.length} attempts (${summary(attempts)})`);
}
