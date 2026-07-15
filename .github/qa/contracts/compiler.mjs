import { EXPLORATORY_CONTRACT_ID, getScenarioContract } from './catalog.mjs';

const text = (value) => (value === undefined || value === null ? '' : String(value));
const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const clone = (value) => JSON.parse(JSON.stringify(value));
const IDENTIFIER = /^[A-Za-z][A-Za-z0-9_-]{0,100}$/;
const TAG = /^[A-Za-z0-9:_/.-]{1,180}$/;
const REPO_RELATIVE_FILE = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9_@./-]{1,500}$/;

function cleanParam(type, raw, name) {
  const value = text(raw).trim();
  if (!value || value.length > 500 || /[\r\n\0]/.test(value)) throw new Error(`invalid contract parameter ${name}`);
  if (type === 'identifier' && !IDENTIFIER.test(value)) throw new Error(`contract parameter ${name} must be an identifier`);
  if (type === 'tag' && !TAG.test(value)) throw new Error(`contract parameter ${name} must be a tag value`);
  if (type === 'url') {
    let url;
    try { url = new URL(value); } catch { throw new Error(`contract parameter ${name} must be an absolute URL`); }
    if (!/^https?:$/.test(url.protocol)) throw new Error(`contract parameter ${name} must use http(s)`);
  }
  return value;
}

function resolveParams(manifest, rawParams) {
  const input = asObject(rawParams);
  const unknown = Object.keys(input).filter((name) => !Object.hasOwn(manifest.params, name));
  if (unknown.length) throw new Error(`unknown contract parameter(s): ${unknown.join(', ')}`);
  return Object.fromEntries(Object.entries(manifest.params).map(([name, definition]) => [
    name,
    cleanParam(definition.type, Object.hasOwn(input, name) ? input[name] : definition.default, name),
  ]));
}

function basicCard({ id, title, style, url = 'https://business.adobe.com/' }) {
  return {
    id,
    styles: {
      typeOverride: style,
      backgroundImage: 'https://business.adobe.com/content/dam/dx/us/en/images/cards/default/media_1.jpg',
      icon: '',
    },
    contentArea: { title, detailText: 'QA fixture', url },
    overlays: { banner: {}, logo: { src: '' }, label: {}, videoButton: { url: '' } },
    footer: [{ left: [], center: [], right: [] }],
    tags: [{ id: 'caas:country/us' }],
    cardDate: '2024-01-01T00:00:00.000Z',
    modifiedDate: '2024-01-01T00:00:00.000Z',
    createdDate: '2024-01-01T00:00:00.000Z',
    country: 'US',
    origin: 'hawks',
  };
}

function bridgeAssertions({ phase = 'final', requireTarget = true } = {}) {
  const fields = {
    gateEnabled: true,
    'override.present': true,
    'override.valid': true,
    'override.replace': true,
  };
  // A scoped probe with no marked root is deliberately empty. Require the
  // marker for ordinary contracts so an absence assertion can never pass just
  // because target selection failed. Removal contracts prove it pre-response.
  if (requireTarget) fields['target.found'] = true;
  return [{ type: 'bridge', phase, fields }];
}

function metadataScenario(params) {
  const card = {
    ...basicCard({ id: params.id, title: params.title, style: params.cardStyle, url: params.reference }),
    country: params.country,
    reference: params.reference,
  };
  const selector = `li#${params.id}[data-testid="consonant-Card"]`;
  return {
    config: { collection: { cardStyle: params.cardStyle, layout: { type: '3up', container: '1200MaxWidth' }, resultsPerPage: 1 } },
    cards: [card], filters: [], isHashed: false,
    expected: `card #${params.id} forwards country and reference as data-country and data-card-url`,
    observe: `the injected card root ${selector}`,
    probes: [{ selector, attributes: ['data-country', 'data-card-url', 'id'], why: 'contract card metadata root' }],
    renderability: { requiredInitial: [{ selector, minMatches: 1, why: 'the injected metadata card must mount' }] },
    assertions: [...bridgeAssertions(), {
      type: 'probe', phase: 'final', selector, count: { min: 1 }, every: {
        attributes: { 'data-country': params.country, 'data-card-url': params.reference },
      },
    }],
    ownedConfigPaths: [],
  };
}

function emptyEventsScenario(params, liveConfig) {
  const endpoint = text(liveConfig?.collection?.endpoint).trim();
  if (!endpoint) throw new Error('contract collection.empty-events-removal.v1 needs a captured live collection.endpoint');
  let url;
  try { url = new URL(endpoint); } catch { throw new Error('captured live collection.endpoint is not an absolute URL'); }
  url.searchParams.set('originSelection', 'events');
  // This selector is a QA-owned invariant for the known removal branch. If
  // the production host changes, that is a new contract version—not a model
  // parameter to mutate at runtime.
  const selector = 'div#caas.caas-preview';
  return {
    config: { collection: { endpoint: url.toString() } },
    cards: [], filters: [], isHashed: false,
    expected: `the published ${selector} host is present before an empty events response and the same host is disconnected after it`,
    observe: `the tracked published host ${selector} before and after the controlled response`,
    probes: [{ selector, attributes: ['id', 'data-caas-block'], why: 'published collection host lifecycle anchor' }],
    renderability: { requiredInitial: [{ selector, minMatches: 1, why: 'the real published host must exist before its empty response' }] },
    assertions: [
      ...bridgeAssertions({ phase: 'beforeFixture' }),
      ...bridgeAssertions({ requireTarget: false }),
      { type: 'request', query: { originSelection: 'events' }, min: 1 },
      { type: 'probe', phase: 'beforeFixture', selector, count: { min: 1 } },
      { type: 'probe', phase: 'final', selector, count: { max: 0 } },
      { type: 'tracked', selector, connected: false, min: 1, every: true },
    ],
    ownedConfigPaths: [],
  };
}

function nestedFilterScenario(params) {
  const card = {
    ...basicCard({ id: 'qa-kept-filter-card', title: `${params.keptLabel} QA Feature Story`, style: '1:2' }),
    tags: [{ id: params.keptId }, { id: 'caas:country/us' }],
  };
  const categorySelector = `input[value="${params.categoryId}"]`;
  const keptSelector = `input[value="${params.keptId}"]`;
  const removedSelector = `input[value="${params.removedId}"]`;
  return {
    config: {
      collection: { cardStyle: '1:2', layout: { type: '3up', container: '1200MaxWidth' }, resultsPerPage: 1 },
      filterPanel: {
        enabled: true,
        type: 'left',
        showEmptyFilters: false,
        filterLogic: 'or',
        categoryMappings: {},
        filters: [{
          group: 'QA products', id: 'qa-products', openedOnLoad: true,
          items: [{
            label: params.categoryLabel, id: params.categoryId, isCategory: true, opened: true,
            items: [
              { label: params.keptLabel, id: params.keptId },
              { label: params.removedLabel, id: params.removedId },
            ],
          }],
        }],
      },
    },
    cards: [card], filters: [], isHashed: false,
    expected: `opened category ${params.categoryLabel} retains ${params.keptLabel} and removes empty ${params.removedLabel}`,
    observe: `initial left filter inputs ${categorySelector}, ${keptSelector}, and ${removedSelector}`,
    probes: [
      { selector: categorySelector, attributes: ['value'], why: 'opened category anchor' },
      { selector: keptSelector, attributes: ['value'], why: 'tag-matching nested leaf' },
      { selector: removedSelector, attributes: ['value'], why: 'empty nested leaf must be absent' },
      { selector: 'li#qa-kept-filter-card[data-testid="consonant-Card"]', attributes: ['id'], why: 'fixture card tag source' },
    ],
    renderability: { requiredInitial: [
      { selector: categorySelector, minMatches: 1, why: 'opened category must mount' },
      { selector: keptSelector, minMatches: 1, why: 'matching nested leaf must mount' },
      { selector: 'li#qa-kept-filter-card[data-testid="consonant-Card"]', minMatches: 1, why: 'tagged fixture card must mount' },
    ] },
    assertions: [...bridgeAssertions(),
      { type: 'probe', phase: 'final', selector: categorySelector, count: { min: 1 } },
      { type: 'probe', phase: 'final', selector: keptSelector, count: { min: 1 } },
      { type: 'probe', phase: 'final', selector: removedSelector, count: { max: 0 } },
    ],
    ownedConfigPaths: ['filterPanel.categoryMappings'],
  };
}

function buttonCardScenario(params) {
  const card = {
    ...basicCard({ id: params.id, title: params.title, style: 'button-card', url: params.overlayLink }),
    url: params.overlayLink,
    overlayLink: params.overlayLink,
    footer: [{ left: [], center: [{ type: 'link', style: 'button', text: params.ctaText }], right: [] }],
  };
  const rootSelector = `li#${params.id}.button-card[data-testid="consonant-Card"]`;
  const ctaSelector = `li#${params.id} a.consonant-ButtonCard-link`;
  return {
    config: { collection: {
      cardStyle: 'button-card', layout: { type: '3up', container: '1200MaxWidth' }, resultsPerPage: 1,
      useOverlayLinks: false, additionalRequestParams: {},
    } },
    cards: [card], filters: [], isHashed: false,
    expected: `Button Card #${params.id} renders CTA '${params.ctaText}' with href '${params.overlayLink}' from overlayLink and footer center data`,
    observe: `the Button Card root ${rootSelector} and child CTA ${ctaSelector}`,
    probes: [
      { selector: rootSelector, attributes: ['class', 'id'], why: 'button-card root' },
      { selector: ctaSelector, attributes: ['href'], why: 'Button Card CTA source' },
      { selector: `li#${params.id} a.consonant-LinkBlocker`, attributes: ['href'], why: 'overlay link corroboration' },
    ],
    renderability: { requiredInitial: [
      { selector: rootSelector, minMatches: 1, why: 'Button Card root must mount' },
      { selector: ctaSelector, minMatches: 1, why: 'CTA must mount on initial render' },
    ] },
    assertions: [...bridgeAssertions(),
      { type: 'probe', phase: 'final', selector: rootSelector, count: { min: 1 }, every: { classIncludes: 'button-card' } },
      { type: 'probe', phase: 'final', selector: ctaSelector, count: { min: 1 }, every: {
        textEquals: params.ctaText, attributes: { href: params.overlayLink },
      } },
    ],
    // Card.jsx appends this live map to overlayLink. Own it so the exact URL
    // asserted below cannot inherit unrelated campaign parameters.
    ownedConfigPaths: ['collection.additionalRequestParams'],
  };
}

const FACTORIES = {
  'card-metadata-attributes': metadataScenario,
  'collection-empty-events-removal': emptyEventsScenario,
  'filter-nested-prune': nestedFilterScenario,
  'card-button-cta': buttonCardScenario,
};

function normaliseChoice(plan) {
  const nested = asObject(plan.contract);
  const id = text(nested.id || plan.contractId).trim();
  return { id, params: asObject(nested.params || plan.contractParams), reason: text(nested.reason).trim().slice(0, 800) };
}

function cleanRepoRelativeFile(raw, label) {
  const file = text(raw).trim();
  if (!REPO_RELATIVE_FILE.test(file)) throw new Error(`${label} must be a safe repo-relative file`);
  return file;
}

function cleanMappingEvidence(rawEvidence) {
  const entries = Array.isArray(rawEvidence) ? rawEvidence.slice(0, 4) : [];
  if (!entries.length) throw new Error('contract plan needs mappingEvidence from current source research');
  return entries.map((raw, index) => {
    const item = asObject(raw);
    const file = cleanRepoRelativeFile(item.file, `mappingEvidence[${index}].file`);
    const line = Number(item.line);
    const fact = text(item.fact).trim().replace(/\s+/g, ' ').slice(0, 1000);
    if (!Number.isInteger(line) || line < 1 || line > 1000000) {
      throw new Error(`mappingEvidence[${index}].line must be a positive line number`);
    }
    if (fact.length < 3) throw new Error(`mappingEvidence[${index}].fact must explain the source mapping`);
    return { file, line, fact };
  });
}

function searchedRanges(applicability) {
  const entries = Array.isArray(applicability?.researchSearches) ? applicability.researchSearches : [];
  return entries.flatMap((entry) => (Array.isArray(entry?.result?.matches) ? entry.result.matches : []).flatMap((match) => {
    let file;
    try { file = cleanRepoRelativeFile(match?.file, 'research match file'); } catch { return []; }
    const line = Number(match?.line);
    const startLine = Number(match?.startLine || line);
    const endLine = Number(match?.endLine || line);
    if (!Number.isInteger(startLine) || !Number.isInteger(endLine) || startLine < 1 || endLine < startLine) return [];
    return [{ file, startLine, endLine }];
  }));
}

function validateManagedApplicability(manifest, mappingEvidence, applicability) {
  // The CLI can validate a saved plan's fixture shape alone. Browser runners
  // must also prove that the selected contract is tied to current changed code
  // and a concrete raw source-search block, rather than an LLM assertion.
  if (!applicability) return;
  const changedPaths = new Set((Array.isArray(applicability.changedPaths) ? applicability.changedPaths : [])
    .flatMap((file) => {
      try { return [cleanRepoRelativeFile(file, 'changed path')]; } catch { return []; }
    }));
  const ranges = searchedRanges(applicability);
  const hintFiles = new Set(manifest.sourceHints.map((hint) => hint.file));
  const anchor = mappingEvidence.find((item) => hintFiles.has(item.file) && changedPaths.has(item.file) &&
    ranges.some((range) => range.file === item.file && item.line >= range.startLine && item.line <= range.endLine));
  if (!anchor) {
    throw new Error(`CONTRACT_APPLICABILITY_UNPROVEN: ${manifest.id} needs one mappingEvidence item from a changed contract sourceHint and returned research block`);
  }
}

function basePlanFields(rawPlan) {
  const sourceTest = text(rawPlan.sourceTest).trim();
  if (!sourceTest) throw new Error('contract plan needs sourceTest');
  const mappingEvidence = cleanMappingEvidence(rawPlan.mappingEvidence);
  return { sourceTest: sourceTest.slice(0, 1600), mappingEvidence };
}

/**
 * Compile a model's small contract selection into the full frozen scenario.
 * For a known contract, free-form fixture/config/probe fields are intentionally
 * ignored; they are the source of the earlier schema guesses.
 */
export function compileContractPlan(rawPlan, { liveConfig, applicability } = {}) {
  const plan = asObject(rawPlan);
  if (text(plan.skipReason).trim()) return { mode: 'skipped', plan: { ...plan, skipReason: text(plan.skipReason).trim().slice(0, 1000) } };
  const choice = normaliseChoice(plan);
  if (!choice.id) throw new Error('plan must choose a contract.id before fixture injection');
  if (choice.id === EXPLORATORY_CONTRACT_ID) {
    return {
      mode: 'exploratory',
      plan: {
        ...plan,
        ...basePlanFields(plan),
        contract: { id: EXPLORATORY_CONTRACT_ID, mode: 'exploratory', reason: choice.reason },
      },
    };
  }
  const manifest = getScenarioContract(choice.id);
  if (!manifest) throw new Error(`unknown contract.id: ${choice.id}`);
  const baseFields = basePlanFields(plan);
  validateManagedApplicability(manifest, baseFields.mappingEvidence, applicability);
  const params = resolveParams(manifest, choice.params);
  const scenario = FACTORIES[manifest.kind](params, liveConfig);
  const compiled = {
    ...baseFields,
    ...scenario,
    contract: {
      id: manifest.id,
      version: manifest.version,
      kind: manifest.kind,
      scope: manifest.scope,
      manifestHash: manifest.manifestHash,
      mode: 'managed',
      params,
      reason: choice.reason,
    },
  };
  validateCompiledScenario(compiled);
  return { mode: 'managed', plan: compiled };
}

/** Small deterministic preflight guard, useful to the worker and maker. */
export function validateCompiledScenario(plan) {
  const errors = [];
  if (!asObject(plan.config) || !Array.isArray(plan.cards) || !Array.isArray(plan.filters)) {
    errors.push('compiled scenario must contain config, cards, and filters');
  }
  if (!Array.isArray(plan.probes) || !plan.probes.length) errors.push('compiled scenario needs probes');
  if (!Array.isArray(plan.assertions) || !plan.assertions.length) errors.push('compiled scenario needs deterministic assertions');
  const selectors = new Set((Array.isArray(plan.probes) ? plan.probes : []).map((probe) => text(probe?.selector)));
  for (const assertion of Array.isArray(plan.assertions) ? plan.assertions : []) {
    if (assertion?.type === 'probe' && !selectors.has(assertion.selector)) {
      errors.push(`assertion selector is not a declared probe: ${assertion.selector}`);
    }
  }
  if (errors.length) throw new Error(`contract preflight failed: ${errors.join('; ')}`);
  return { ok: true, contractId: plan.contract?.id || '', mode: plan.contract?.mode || '' };
}

export function isManagedContractPlan(plan) {
  return plan?.contract?.mode === 'managed' && Array.isArray(plan?.assertions);
}

export function cloneContractPlan(plan) {
  return clone(plan);
}
