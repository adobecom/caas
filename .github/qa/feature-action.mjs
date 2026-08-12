const MAX_SELECTOR_LENGTH = 240;
const MAX_VALUE_LENGTH = 1000;
const SUPPORTED_KINDS = new Set(['click', 'type']);

const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const cssAttributeValue = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

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

/** Positional selectors are brittle across component wrappers and repeated collections. */
export function validateFeatureAction(action) {
  if (!action) return null;
  if (/:(?:nth|first|last|eq)(?:-|\(|:)/i.test(action.selector)) {
    throw new Error('feature action selector must use a stable attribute, not a positional pseudo-class');
  }
  return action;
}

/** Fail closed when a planner describes an interaction but forgets its action. */
export function planDescribesInteraction(plan) {
  const text = `${plan?.sourceTest || ''} ${plan?.expected || ''}`;
  return /\b(click(?:s|ed|ing)?|typ(?:e|es|ed|ing)|after (?:the )?(?:filter|search|action|interaction)|select(?:s|ed|ing) (?:a|an|the))\b/i.test(text);
}

/** An interaction verdict is invalid when its supplied baseline fixture never rendered. */
export function interactionPrerequisiteFailure(plan, observed) {
  if (!plan?.action || !Array.isArray(plan.cards) || plan.cards.length === 0) return '';
  if (Number(observed?.collectionRoots?.targetCards) > 0) return '';
  return 'the target collection contained zero fixture cards before the planned action';
}

const actionAttributeValue = (selector) => {
  const match = String(selector || '').match(/\[(?:for|id|value)\s*=\s*(["'])(.*?)\1\]/i);
  return match?.[2] || '';
};

const containsFilterItem = (items, targetId) => Array.isArray(items) && items.some((item) =>
  String(item?.id || '') === targetId || containsFilterItem(item?.items, targetId));

/** Open the injected filter group containing an exact action target. */
export function prepareConfigForAction(config, action) {
  if (!config || typeof config !== 'object' || !action) return config;
  const targetId = actionAttributeValue(action.selector);
  const filters = config.filterPanel?.filters;
  if (!targetId || !Array.isArray(filters)) return config;
  return {
    ...config,
    filterPanel: {
      ...config.filterPanel,
      filters: filters.map((group) => containsFilterItem(group?.items, targetId)
        ? { ...group, openedOnLoad: true } : group),
    },
  };
}

/**
 * Perform one user-visible action. Missing, hidden, ambiguous, or broken targets
 * are harness limitations, so callers must report SKIPPED rather than FAIL.
 */
export async function runFeatureAction(page, rawAction, { scopeSelector = '' } = {}) {
  const action = normalizeFeatureAction(rawAction);
  if (!action) return null;
  let locator = page.locator(action.selector);
  let scope;
  let scopeCount;
  if (scopeSelector) {
    const scopes = page.locator(scopeSelector);
    scopeCount = await scopes.count();
    if (scopeCount === 0) {
      return { action, status: 'SKIPPED', scopeCount, reason: `action scope did not render: ${scopeSelector}` };
    }
    scope = scopes.first();
    locator = scope.locator(action.selector);
  }
  const targetCount = await locator.count();
  if (targetCount !== 1) {
    return {
      action,
      status: 'SKIPPED',
      scopeCount,
      targetCount,
      reason: targetCount === 0
        ? `action target did not render: ${action.selector}`
        : `action target is ambiguous (${targetCount} matches): ${action.selector}`,
    };
  }
  let targetVisible = await locator.isVisible().catch(() => false);
  let resolvedSelector = action.selector;
  // CaaS visually hides native checkbox/radio inputs and exposes a styled label.
  // Resolve that label deterministically; this is the same single user action.
  if (!targetVisible && action.kind === 'click') {
    const type = String(await locator.getAttribute('type').catch(() => '') || '').toLowerCase();
    const id = await locator.getAttribute('id').catch(() => '');
    if ((type === 'checkbox' || type === 'radio') && id) {
      const labelSelector = `label[for="${cssAttributeValue(id)}"]`;
      const labelLocator = scope ? scope.locator(labelSelector) : page.locator(labelSelector);
      const labelCount = await labelLocator.count();
      const labelVisible = labelCount === 1 && await labelLocator.isVisible().catch(() => false);
      if (labelVisible) {
        locator = labelLocator;
        targetVisible = true;
        resolvedSelector = labelSelector;
      }
    }
  }
  if (!targetVisible) {
    return {
      action,
      status: 'SKIPPED',
      scopeCount,
      targetCount,
      targetVisible,
      reason: `action target rendered but is not visible: ${action.selector}`,
    };
  }
  try {
    if (action.kind === 'type') await locator.fill(action.value);
    else await locator.click();
    return { action, resolvedSelector, status: 'PERFORMED', scopeCount, targetCount, targetVisible };
  } catch (error) {
    return {
      action,
      status: 'SKIPPED',
      scopeCount,
      targetCount,
      targetVisible,
      reason: `action could not be performed: ${String(error?.message || error).slice(0, 300)}`,
    };
  }
}
