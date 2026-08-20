const RUNTIME_SOURCE = /^react\/src\/.+\.(?:[cm]?[jt]sx?)$/i;
const TEST_SOURCE = /(?:^|\/)(?:__tests__\/|.*\.(?:spec|test)\.(?:[cm]?[jt]sx?))$/i;
const RENDER_BRIDGE = /\b(?:DOMModel|DOMRegistry|createRDC|parseDataConfig|ReactDOM\.render)\b/i;
const CONFIG_TRANSPORT = /(?:data-config|dataConfig)/i;
const PROP_HANDOFF = /(?:props\.(?:dataConfig|config)|this\.props\.(?:dataConfig|config))/i;
const ATTRIBUTE_HANDOFF = /(?:data-config|dataConfig|getAttribute)/i;

/**
 * Detect the narrow class of apparent "internal" changes that can actually
 * prevent a custom element from passing its parsed config into a React root.
 * These deserve one adversarial re-plan before the historical runner accepts
 * a static skip; normal interaction, visual, and refactor skips do not.
 */
export function needsRootRenderSkipChallenge(evidence = {}) {
  const runtimeChanged = (Array.isArray(evidence.changedPaths) ? evidence.changedPaths : [])
    .some((filePath) => RUNTIME_SOURCE.test(String(filePath)) && !TEST_SOURCE.test(String(filePath)));
  const diff = String(evidence.diff || '');
  const specDiff = String(evidence.specDiff || '');
  return runtimeChanged
    && RENDER_BRIDGE.test(diff)
    && CONFIG_TRANSPORT.test(diff)
    && PROP_HANDOFF.test(specDiff)
    && ATTRIBUTE_HANDOFF.test(specDiff);
}

export function shouldChallengeSkip({ stage, evidence, challengeAttempted = false } = {}) {
  return !challengeAttempted
    && (stage === 'detect' || stage === 'plan')
    && needsRootRenderSkipChallenge(evidence);
}
