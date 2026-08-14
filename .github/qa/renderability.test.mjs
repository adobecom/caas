import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  applyScenarioRepair,
  findMissingRequiredInitial,
  normalizeRenderability,
  prioritizeRenderabilityProbes,
  requireRenderability,
} from './renderability.mjs';

test('missing initial target triggers a repair while duplicate rendered targets pass', () => {
  const contract = normalizeRenderability({ requiredInitial: [
    { selector: '.consonant-Search-input', minMatches: 1, why: 'aria-label lives here' },
  ] });
  const topObserved = { probes: [{ selector: '.consonant-Search-input', matches: [] }] };
  assert.deepEqual(findMissingRequiredInitial(topObserved, contract), [{
    selector: '.consonant-Search-input', minMatches: 1, why: 'aria-label lives here', actualMatches: 0, selectorError: '',
  }]);
  const leftObserved = { probes: [{ selector: '.consonant-Search-input', matches: [{ tag: 'input' }, { tag: 'input' }] }] };
  assert.deepEqual(findMissingRequiredInitial(leftObserved, contract), []);
});

test('absence assertions can require a stable parent instead of the intentionally absent target', () => {
  const contract = normalizeRenderability({ requiredInitial: [
    { selector: '.consonant-Card', minMatches: 1, why: 'the rendered card is the stable absence-test anchor' },
  ] });
  const observed = { probes: [
    { selector: '.consonant-Card', matches: [{ tag: 'li' }] },
    { selector: '.removed-child', matches: [] },
  ] };
  assert.deepEqual(findMissingRequiredInitial(observed, contract), []);
});

test('requirements are bounded, deduplicated, and prioritized into probes', () => {
  const contract = normalizeRenderability({ requiredInitial: [
    { selector: '.target', minMatches: 0, why: 'first' },
    { selector: '.target', minMatches: 4, why: 'duplicate' },
    { selector: '.anchor', minMatches: 9, why: 'second' },
    { selector: '.third', minMatches: 1 },
    { selector: '.fourth', minMatches: 1 },
  ] });
  assert.deepEqual(contract.requiredInitial, [
    { selector: '.target', minMatches: 1, why: 'first' },
    { selector: '.anchor', minMatches: 5, why: 'second' },
    { selector: '.third', minMatches: 1, why: '' },
  ]);
  const probes = prioritizeRenderabilityProbes([
    { selector: '.ordinary', attributes: [], why: 'ordinary' },
    { selector: '.target', attributes: ['class'], why: 'target' },
  ], contract);
  assert.deepEqual(probes.map((probe) => probe.selector), ['.target', '.anchor', '.third', '.ordinary']);
});

test('a plan must explicitly declare a valid positive initial-render prerequisite', () => {
  assert.throws(() => requireRenderability({}), /must declare/);
  assert.throws(() => requireRenderability({ requiredInitial: [{ selector: 'x'.repeat(201) }] }), /must declare/);
  assert.deepEqual(requireRenderability({ requiredInitial: [{ selector: '.card', minMatches: 1 }] }), {
    requiredInitial: [{ selector: '.card', minMatches: 1, why: '' }],
  });
});

test('invalid selector evidence is treated as a missing prerequisite', () => {
  const contract = normalizeRenderability({ requiredInitial: [{ selector: '[', minMatches: 1, why: 'must parse' }] });
  const observed = { probes: [{ selector: '[', matches: [{ selectorError: "Failed to execute 'querySelectorAll'" }] }] };
  assert.deepEqual(findMissingRequiredInitial(observed, contract), [{
    selector: '[', minMatches: 1, why: 'must parse', actualMatches: 1,
    selectorError: "Failed to execute 'querySelectorAll'",
  }]);
});

test('repair can change only scenario inputs, never the assertion contract', () => {
  const original = {
    sourceTest: 'Search.spec.js > accessible input',
    expected: 'input has aria-label',
    observe: 'initial DOM',
    mappingEvidence: [{ file: 'Search.jsx', line: 1, fact: 'input' }],
    probes: [{ selector: '.consonant-Search-input', attributes: ['aria-label'], why: 'target' }],
    renderability: { requiredInitial: [{ selector: '.consonant-Search-input', minMatches: 1, why: 'target' }] },
    config: { filterPanel: { type: 'top' } }, cards: [], filters: [], isHashed: false,
  };
  const repaired = applyScenarioRepair(original, {
    config: { filterPanel: { type: 'left' } }, cards: [{ id: 'card-1' }], filters: [], isHashed: true,
  });
  assert.equal(repaired.sourceTest, original.sourceTest);
  assert.equal(repaired.expected, original.expected);
  assert.deepEqual(repaired.probes, original.probes);
  assert.deepEqual(repaired.config, { filterPanel: { type: 'left' } });
  assert.equal(repaired.isHashed, true);
  assert.throws(() => applyScenarioRepair(original, {
    sourceTest: 'different assertion', config: {}, cards: [], filters: [],
  }), /must not change sourceTest/);
  assert.throws(() => applyScenarioRepair(original, {
    config: [], cards: [], filters: [],
  }), /must provide config/);
});
