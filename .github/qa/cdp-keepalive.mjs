// Shared CDP keep-alive helper for the QA wrapper (agent-review.mjs) and the
// interactive runner (qa-runner-v2.mjs).
//
// Playwright's connectOverCDP throws "Browser context management is not
// supported" when the target Chrome has ZERO page tabs, so we must guarantee a
// tab exists BEFORE connecting. And because a timed-out run is SIGKILL'd (and a
// crashed run may throw) before its own cleanup, we also REAP leftover tabs so
// zombies cannot accumulate across runs. Uses the CDP HTTP API rather than
// Playwright, which cannot attach to an empty browser in the first place.
//
// NOTE: check-then-act here is not atomic, which is safe because the self-hosted
// qa-audit runner executes runs serially against a single Chrome; concurrent
// access to the same CDP endpoint does not occur in this setup.
export async function ensureBrowserTab(cdp) {
  const base = String(cdp || '').replace(/\/$/, '');
  if (!base) return;
  let pages;
  try {
    const list = await fetch(`${base}/json`).then((r) => r.json());
    pages = (Array.isArray(list) ? list : []).filter((t) => t.type === 'page');
  } catch (e) {
    // Surface a real connectivity failure clearly; connectOverCDP will then throw
    // the true error rather than us masking it as a "0 tabs" state.
    console.log(`[keep-alive] CDP endpoint unreachable at ${base}/json (${e && e.message ? e.message : e})`);
    return;
  }
  try {
    if (pages.length === 0) {
      let ok = await fetch(`${base}/json/new?about:blank`, { method: 'PUT' }).then((r) => r.ok).catch(() => false);
      if (!ok) ok = await fetch(`${base}/json/new?about:blank`).then((r) => r.ok).catch(() => false);
      console.log(`[keep-alive] 0 tabs; opened a keep-alive blank tab (ok=${ok})`);
      return;
    }
    // Reap zombie tabs left by crashed/timed-out prior runs: keep exactly one.
    const extras = pages.slice(1);
    for (const t of extras) await fetch(`${base}/json/close/${t.id}`).catch(() => {});
    if (extras.length) console.log(`[keep-alive] reaped ${extras.length} stale tab(s), kept 1`);
  } catch (e) {
    console.log(`[keep-alive] ensureBrowserTab error: ${e && e.stack ? e.stack.split('\n')[0] : String(e)}`);
  }
}
