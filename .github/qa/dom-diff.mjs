// Diff two DOM "signatures" from the pre-code and post-code renders of the SAME forced
// scenario. The delta is exactly what the PR's code made appear/disappear. Anything
// identical in both renders (e.g. a class echoing an injected config value) has equal
// counts in both, so it cancels and never shows. Pure functions -> testable without a browser.
const asCounts = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const asList = (v) => (Array.isArray(v) ? v : []);
function gained(a, b) { const A = asCounts(a); const B = asCounts(b); return Object.keys(B).filter((k) => (B[k] || 0) > (A[k] || 0)).sort(); }
const minus = (a, b) => { const B = new Set(asList(b)); return [...new Set(asList(a))].filter((x) => !B.has(x)).sort(); };

export function diffSignatures(pre = {}, post = {}) {
  const addedClasses = gained(pre.classes, post.classes);
  const removedClasses = gained(post.classes, pre.classes);
  const addedTestids = minus(post.testids, pre.testids);
  const removedTestids = minus(pre.testids, post.testids);
  const addedAttrs = gained(pre.attrs, post.attrs);
  const removedAttrs = gained(post.attrs, pre.attrs);
  const addedTags = gained(pre.tags, post.tags);
  const removedTags = gained(post.tags, pre.tags);
  const preTexts = asList(pre.texts); const postTexts = asList(post.texts);
  const textChanged = JSON.stringify(preTexts) !== JSON.stringify(postTexts);
  const changed = Boolean(addedClasses.length || removedClasses.length || addedTestids.length
    || removedTestids.length || addedAttrs.length || removedAttrs.length || addedTags.length
    || removedTags.length || textChanged);
  return { changed, addedClasses, removedClasses, addedTestids, removedTestids, addedAttrs, removedAttrs, addedTags, removedTags, textChanged, preTexts, postTexts };
}

export function summarizeDiff(d) {
  const parts = [];
  if (d.addedClasses.length) parts.push(`+classes: ${d.addedClasses.join(' ')}`);
  if (d.removedClasses.length) parts.push(`-classes: ${d.removedClasses.join(' ')}`);
  if (d.addedTestids.length) parts.push(`+testids: ${d.addedTestids.join(' ')}`);
  if (d.addedAttrs.length) parts.push(`+attrs: ${d.addedAttrs.join(' ')}`);
  if (d.removedAttrs.length) parts.push(`-attrs: ${d.removedAttrs.join(' ')}`);
  if (d.addedTags.length) parts.push(`+tags: ${d.addedTags.join(' ')}`);
  if (d.textChanged) parts.push(`text/order changed`);
  return parts.length ? parts.join(' | ') : 'no structural change';
}
