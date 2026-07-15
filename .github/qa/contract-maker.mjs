#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { researchCode } from './code-search.mjs';
import { getScenarioContract, listScenarioContracts, SUPPORTED_CONTRACT_KINDS, validateContractManifest } from './contracts/catalog.mjs';
import { compileContractPlan } from './contracts/compiler.mjs';
import { requestBoundedJson } from './llm-json.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_DIR = path.join(HERE, 'contracts', 'manifests');
const text = (value) => (value === undefined || value === null ? '' : String(value));

function option(args, name, fallback = '') {
  const index = args.indexOf(name);
  return index === -1 ? fallback : text(args[index + 1]).trim();
}

function usage() {
  return `Usage:
  node contract-maker.mjs list
  node contract-maker.mjs validate <proposal.json>
  node contract-maker.mjs validate-plan --plan <agent-plan.json> [--live-config <config.json>]
  node contract-maker.mjs health [--repo-root <repo>]
  node contract-maker.mjs propose --id <new-contract.v1> --evidence <evidence.txt> --out <proposal.json> [--repo-root <repo>]

propose only writes a new, inert JSON proposal outside contracts/manifests. A reviewer must validate, back-test, and commit it in a separate QA-owned PR.`;
}

/**
 * A manifest's `kind` is a reviewed compiler adapter, not an open-ended model
 * instruction. Keep a proposed new behavior honest: it is either compatible
 * with an existing adapter or explicitly asks QA to add one first.
 */
export function validateContractProposal(value, requestedId = '') {
  const raw = value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  if (!raw) throw new Error('proposal must be a JSON object');
  if (raw.status === 'NEEDS_ADAPTER') {
    const reason = text(raw.reason).trim().replace(/\s+/g, ' ').slice(0, 1600);
    if (reason.length < 3) throw new Error('NEEDS_ADAPTER proposal needs a concrete reason');
    const neededCapabilities = (Array.isArray(raw.neededCapabilities) ? raw.neededCapabilities : [])
      .map((item) => text(item).trim().replace(/\s+/g, ' ').slice(0, 300)).filter(Boolean).slice(0, 8);
    if (!neededCapabilities.length) throw new Error('NEEDS_ADAPTER proposal needs at least one required capability');
    return { status: 'NEEDS_ADAPTER', reason, neededCapabilities };
  }
  if (raw.status && raw.status !== 'PROPOSAL') throw new Error(`unsupported proposal status: ${text(raw.status)}`);
  const manifest = raw.status === 'PROPOSAL' ? raw.manifest : raw;
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new Error('PROPOSAL needs a manifest object');
  if (requestedId && manifest.id !== requestedId) throw new Error('proposal id did not match requested id');
  return { status: 'PROPOSED', manifest: validateContractManifest(manifest) };
}

/** Read-only catalog health check suitable for a weekly scheduler. */
export function contractCatalogHealth(repoRoot) {
  const root = path.resolve(repoRoot || process.cwd());
  const contracts = listScenarioContracts();
  const issues = contracts.flatMap((contract) => contract.sourceHints.flatMap((hint) => {
    const file = path.resolve(root, hint.file);
    if (!file.startsWith(`${root}${path.sep}`)) return [{ contract: contract.id, file: hint.file, issue: 'unsafe source hint' }];
    try {
      const source = readFileSync(file, 'utf8');
      const missingNeedles = hint.needles.filter((needle) => !source.includes(needle));
      return missingNeedles.length
        ? [{ contract: contract.id, file: hint.file, issue: 'source hint tokens no longer match', missingNeedles }]
        : [];
    }
    catch { return [{ contract: contract.id, file: hint.file, issue: 'source hint no longer exists' }]; }
  }));
  return {
    status: issues.length ? 'STALE' : 'HEALTHY',
    checkedAt: new Date().toISOString(),
    contractCount: contracts.length,
    issues,
  };
}

async function proxyResponse(prompt, maxTokens = 5000) {
  const proxy = process.env.PROXY_URL;
  const model = process.env.MODEL;
  const token = process.env.IMS_ACCESS_TOKEN;
  if (!proxy || !model || !token) throw new Error('PROXY_URL, MODEL, and IMS_ACCESS_TOKEN are required for propose');
  const body = JSON.stringify({ model, max_tokens: maxTokens, stream: true, messages: [{ role: 'user', content: prompt }] });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180000);
  try {
    const response = await fetch(proxy, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01' },
      body, signal: controller.signal,
    });
    const raw = await response.text();
    if (!response.ok) throw new Error(`proposal proxy returned HTTP ${response.status}: ${raw.slice(0, 400)}`);
    let responseText = '';
    let stopReason = '';
    for (const line of raw.split('\n')) {
      const value = line.trim();
      if (!value.startsWith('data:')) continue;
      const data = value.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      let event;
      try { event = JSON.parse(data); } catch { continue; }
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') responseText += event.delta.text || '';
      if (event.type === 'message_delta') stopReason = event.delta?.stop_reason || stopReason;
      if (event.type === 'message_stop') stopReason = event.message?.stop_reason || stopReason || 'end_turn';
    }
    if (!responseText.trim()) throw new Error('proposal proxy returned no text');
    return { text: responseText.trim(), stopReason: stopReason || 'end_turn' };
  } finally { clearTimeout(timeout); }
}

function safeProposalPath(outputPath) {
  const output = path.resolve(outputPath);
  if (output.startsWith(`${MANIFEST_DIR}${path.sep}`) || output === MANIFEST_DIR) {
    throw new Error('propose may not write directly into contracts/manifests; review the candidate in a separate QA PR first');
  }
  return output;
}

async function propose(args) {
  const id = option(args, '--id');
  const evidencePath = option(args, '--evidence');
  const outputPath = option(args, '--out');
  const repoRoot = path.resolve(option(args, '--repo-root', process.cwd()));
  if (!id || !evidencePath || !outputPath) throw new Error('propose needs --id, --evidence, and --out');
  if (getScenarioContract(id)) throw new Error(`contract ${id} already exists; changed semantics require a new versioned id`);
  const evidence = readFileSync(path.resolve(evidencePath), 'utf8').slice(0, 22000);
  const askText = async (prompt, maxTokens) => (await proxyResponse(prompt, maxTokens)).text;
  const research = await researchCode({
    ask: askText,
    repoRoot,
    maxSearches: 6,
    taskContext: `Design a QA-owned fixture contract proposal, not a test plan. It must capture a reusable raw config/card/filter shape from this evidence:\n${evidence}`,
  });
  const kinds = [...SUPPORTED_CONTRACT_KINDS].sort();
  const response = await requestBoundedJson({
    ask: proxyResponse,
    label: 'contract proposal',
    maxTokens: 3000,
    retryMaxTokens: 1800,
    maxChars: 9000,
    retrySuffix: 'Return only one complete documented JSON object, with no prose: either a PROPOSAL with a supported existing kind, valid versioned id, sourceHints (including needles), and parameter defaults; or NEEDS_ADAPTER when no existing kind fits.',
    parseAndValidate: (raw) => validateContractProposal(raw, id),
    prompt:
`Propose one NEW, QA-owned, inert fixture-contract manifest. It will be reviewed and back-tested before any catalog change. Never emit JavaScript, shell, selectors that execute code, workflow YAML, or a full scenario fixture.

Requested id: ${id}
Supported compiler kinds (choose exactly one): ${JSON.stringify(kinds)}
Existing contracts: ${JSON.stringify(listScenarioContracts().map(({ id: contractId, kind, summary }) => ({ id: contractId, kind, summary })))}

Evidence supplied by the maintainer:\n${evidence}

Bounded current-code research:\n${research.report}

Return ONLY one of these JSON shapes:
{"status":"PROPOSAL","manifest":{"id":"${id}","version":1,"kind":"one supported kind","title":"short title","summary":"reusable fixture behavior","useWhen":["when to choose it"],"params":{"name":{"type":"string|identifier|url|tag","default":"safe literal","description":"..."}},"sourceHints":[{"file":"repo-relative source file","symbol":"symbol/path proved by research","needles":["short exact source token"]}]}}
{"status":"NEEDS_ADAPTER","reason":"why no existing compiler kind can build and assert this behavior safely","neededCapabilities":["one or more QA-owned adapter capabilities"]}

This is a proposal only. It must describe behavior already supported by the selected compiler kind. If no kind fits, never choose the closest kind and never invent a kind: return NEEDS_ADAPTER so QA can add and test a reviewed adapter in its own PR.`,
  });
  const output = safeProposalPath(outputPath);
  const saved = response.value.status === 'PROPOSED' ? response.value.manifest : response.value;
  writeFileSync(output, `${JSON.stringify(saved, null, 2)}\n`);
  console.log(JSON.stringify({ status: response.value.status, output,
    contract: response.value.manifest, reason: response.value.reason,
    neededCapabilities: response.value.neededCapabilities, searches: research.searches.length }, null, 2));
}

function validatePlan(args) {
  const planPath = option(args, '--plan', args[0] || '');
  const configPath = option(args, '--live-config');
  if (!planPath) throw new Error('validate-plan needs --plan <agent-plan.json>');
  const parsedPlan = JSON.parse(readFileSync(path.resolve(planPath), 'utf8'));
  const rawPlan = parsedPlan?.plan || parsedPlan;
  const liveConfig = configPath ? JSON.parse(readFileSync(path.resolve(configPath), 'utf8')) : {};
  const compiled = compileContractPlan(rawPlan, { liveConfig });
  const plan = compiled.plan;
  console.log(JSON.stringify({
    status: plan.skipReason ? 'SKIPPED' : 'VALID_SCENARIO',
    mode: compiled.mode,
    contract: plan.contract || null,
    sourceTest: plan.sourceTest || '',
    generated: plan.skipReason ? undefined : {
      cards: Array.isArray(plan.cards) ? plan.cards.length : 0,
      probes: Array.isArray(plan.probes) ? plan.probes.length : 0,
      ownedConfigPaths: plan.ownedConfigPaths || [],
    },
  }, null, 2));
}

async function main() {
  const [command = '', ...args] = process.argv.slice(2);
  if (command === 'list') {
    console.log(JSON.stringify(listScenarioContracts(), null, 2));
    return;
  }
  if (command === 'validate') {
    const file = args[0];
    if (!file) throw new Error('validate needs a proposal path');
    const proposal = validateContractProposal(JSON.parse(readFileSync(path.resolve(file), 'utf8')));
    console.log(JSON.stringify(proposal.status === 'PROPOSED'
      ? { status: 'VALID', manifest: proposal.manifest }
      : proposal, null, 2));
    return;
  }
  if (command === 'validate-plan') return validatePlan(args);
  if (command === 'health') {
    const report = contractCatalogHealth(option(args, '--repo-root', process.cwd()));
    console.log(JSON.stringify(report, null, 2));
    if (report.status !== 'HEALTHY') process.exitCode = 2;
    return;
  }
  if (command === 'propose') return propose(args);
  throw new Error(usage());
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`[contract-maker] ${error.message}`);
    process.exitCode = 1;
  });
}
