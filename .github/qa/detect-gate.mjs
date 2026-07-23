// Deterministic detect gate for the feature-QA back-test.
//
// The diff-based pipeline renders the forced scenario on BOTH pre- and post-PR
// code and asks the judge to compare the detected old-vs-new render diff against
// the PR's stated intent. Because the verdict now comes from that diff (not from
// an assertion authored up front), the gate no longer needs to decide whether a
// behavior is "assertable" — a decision the old LLM detect prompt got wrong for
// visual-only and no-op product changes (false skips).
//
// The only changes that can never produce a meaningful old-vs-new render diff are
// CI / tooling / docs changes. Everything else — any product-code change, INCLUDING
// visual/CSS-only tweaks and apparent no-ops — must reach render + diff + judge.
// Unknown/unmatched paths are treated as PRODUCT (fail open toward rendering), so a
// missing pattern costs a harmless extra render, never a false skip.

// Documentation files (any directory).
const DOCS_FILE = /\.(?:md|mdx|markdown|txt|rst|adoc)$/i;
// Documentation directories.
const DOCS_DIR = /(?:^|\/)(?:docs?|documentation)\//i;
// CI / editor / tooling directories.
const TOOLING_DIR = /(?:^|\/)(?:\.github|\.husky|\.vscode|\.circleci|\.idea)\//i;
// Named non-code metadata files (with or without an extension).
const NAMED_META = /(?:^|\/)(?:LICENSE|LICENCE|AUTHORS|CONTRIBUTORS|CODEOWNERS|CHANGELOG|NOTICE|PATENTS)(?:\.[^/]+)?$/i;
// Dotfile config + lockfiles + common JS tooling configs. Note: package.json is
// deliberately NOT here — a dependency change can alter the bundle, so it renders.
const TOOLING_FILE = new RegExp(
  '(?:^|\\/)(?:'
  + '\\.[^/]*(?:ignore|rc)(?:\\.(?:json|ya?ml|js|cjs|mjs))?'   // .gitignore, .eslintrc, .prettierrc.json, ...
  + '|\\.editorconfig|\\.nvmrc|\\.node-version|\\.browserslistrc'
  + '|\\.eslintrc[^/]*|\\.prettierrc[^/]*|\\.stylelintrc[^/]*'
  + '|babel\\.config\\.[cm]?js|jest\\.config\\.[cm]?js|commitlint\\.config\\.[cm]?js'
  + '|renovate\\.json|codecov\\.ya?ml|netlify\\.toml|vercel\\.json'
  + '|package-lock\\.json|yarn\\.lock|pnpm-lock\\.ya?ml'
  + ')$',
  'i',
);

// True when a changed path cannot affect rendered product output.
export function isNonProductPath(filePath) {
  const p = String(filePath || '');
  if (!p) return true;
  return DOCS_FILE.test(p)
    || DOCS_DIR.test(p)
    || TOOLING_DIR.test(p)
    || NAMED_META.test(p)
    || TOOLING_FILE.test(p);
}

// Partition changed paths and decide whether the PR should be skipped at the
// detect gate. Skip ONLY when there is nothing but CI/tooling/docs to render.
export function classifyChangedPaths(changedPaths = []) {
  const paths = (Array.isArray(changedPaths) ? changedPaths : []).map(String).filter(Boolean);
  const productPaths = paths.filter((p) => !isNonProductPath(p));
  const nonProductPaths = paths.filter((p) => isNonProductPath(p));
  return { productPaths, nonProductPaths, skip: productPaths.length === 0 };
}
