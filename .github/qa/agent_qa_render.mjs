// Pure render helpers for Agent QA verdict tracking (open/resolved checklist).
// No I/O -- unit-testable in isolation.
export function renderQaChecklist({ verdict, pct, priorVerdict, priorSince, shortSha }) {
  const isFail = verdict === 'FAIL';
  let delta, since = '', openItem = null, resolvedItem = false;
  if (isFail) {
    const persisting = priorVerdict === 'FAIL';
    since = persisting && priorSince ? priorSince : shortSha;
    openItem = { isNew: !persisting, since };
    delta = persisting ? 'still failing' : 'new visual regression';
  } else {
    if (priorVerdict === 'FAIL') { resolvedItem = true; delta = 'regression resolved'; }
    else { delta = 'passing, no regressions'; }
  }
  const openCount = openItem ? 1 : 0;
  const resolvedCount = resolvedItem ? 1 : 0;
  const L = [];
  L.push(`**${openCount} open · ${resolvedCount} resolved** · visual diff **${pct}%** · verdict **${verdict}**`);
  L.push('');
  L.push('### Open findings');
  if (openItem) {
    L.push(`- [ ] 🔴 **Visual regression detected** (${pct}% of pixels changed)`
      + (openItem.isNew ? ' 🆕' : ` _(open since \`${openItem.since}\`)_`));
  } else {
    L.push('- [x] No visual regressions ✅');
  }
  if (resolvedItem) {
    L.push('');
    L.push('### ✅ Resolved');
    L.push(`- [x] ~~🔴 **Visual regression**~~ — resolved in \`${shortSha}\``);
  }
  return { core: L.join('\n'), delta, since };
}
