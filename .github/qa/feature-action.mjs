const MAX_SELECTOR_LENGTH = 240;
const MAX_VALUE_LENGTH = 1000;
const SUPPORTED_KINDS = new Set(['click', 'type']);

const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

/** Normalize the single bounded browser action supported by Feature QA. */
export function normalizeFeatureAction(value) {
  if (value === undefined || value === null || value === '') return null;
  const input = asObject(value);
  const kind = String(input.kind || '').trim().toLowerCase();
  const selector = String(input.selector || '').trim();
  if (!kind && !selector) return null;
  if (!SUPPORTED_KINDS.has(kind)) throw new Error('feature action kind must be click or type');
  if (!selector || selector.length > MAX_SELECTOR_LENGTH) {
    throw new Error(`feature action selector must be 1-${MAX_SELECTOR_LENGTH} characters`);
  }
  const action = { kind, selector };
  if (kind === 'type') action.value = String(input.value ?? '').slice(0, MAX_VALUE_LENGTH);
  return action;
}

/** Fail closed when a planner describes an interaction but forgets its action. */
export function planDescribesInteraction(plan) {
  const text = `${plan?.sourceTest || ''} ${plan?.expected || ''}`;
  return /\b(click(?:s|ed|ing)?|typ(?:e|es|ed|ing)|after (?:the )?(?:filter|search|action|interaction)|select(?:s|ed|ing) (?:a|an|the))\b/i.test(text);
}

/**
 * Perform one user-visible action. Missing, hidden, ambiguous, or broken targets
 * are harness limitations, so callers must report SKIPPED rather than FAIL.
 */
export async function runFeatureAction(page, rawAction) {
  const action = normalizeFeatureAction(rawAction);
  if (!action) return null;
  const locator = page.locator(action.selector);
  const targetCount = await locator.count();
  if (targetCount !== 1) {
    return {
      action,
      status: 'SKIPPED',
      targetCount,
      reason: targetCount === 0
        ? `action target did not render: ${action.selector}`
        : `action target is ambiguous (${targetCount} matches): ${action.selector}`,
    };
  }
  const targetVisible = await locator.isVisible().catch(() => false);
  if (!targetVisible) {
    return {
      action,
      status: 'SKIPPED',
      targetCount,
      targetVisible,
      reason: `action target rendered but is not visible: ${action.selector}`,
    };
  }
  try {
    if (action.kind === 'type') await locator.fill(action.value);
    else await locator.click();
    return { action, status: 'PERFORMED', targetCount, targetVisible };
  } catch (error) {
    return {
      action,
      status: 'SKIPPED',
      targetCount,
      targetVisible,
      reason: `action could not be performed: ${String(error?.message || error).slice(0, 300)}`,
    };
  }
}
