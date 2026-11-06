# C2 collection opt-in POC

This is a structural prototype, not an approved C2 design implementation or a production rollout. It demonstrates a saved collection option, scoped rendering, image geometry, and a reversible fallback.

## Preview

Build the repository bundles, serve the repository root, and open `/html/c2-poc/`. For the existing webpack 3 build on Node 24, use `NODE_OPTIONS=--openssl-legacy-provider npx webpack`. The page uses synthetic local card data and public Adobe image assets. It offers a Use C2 checkbox, a supported/unsupported style selector, local browser persistence, and JSON export. Exported configurations use the demo endpoint and need a real endpoint before reuse.

This page is an in-repository configurator prototype. The production Milo configurator is unchanged and needs a separate integration to write `collection.presentation`.

## Naming and compatibility

| Concern | Value | Meaning |
| --- | --- | --- |
| Saved layout identifier | `1:2` or `one-half` | Existing whole-card layout; preserved for compatibility |
| Presentation | `legacy` (default) or `c2` | Collection-level opt-in |
| Resolved C2 card | `media` | Internal semantic presentation name, not a claim about official Figma variant naming |
| Media aspect ratio | `16:9` | Image width divided by image height; not a replacement layout identifier |

`Helpers/presentation.js` is the explicit mapping boundary. Add future supported layouts there after reviewing their fields and rendering needs. Do not rename persisted `1:2` values to `16:9`: a card layout and an image ratio are different concepts. Future authoring labels can be friendly names without changing stored IDs.

The current map only accepts a one-half collection, a light/lightest/default mode, and the existing 3up grid with its standard containers. Unsupported styles, mixed card collections, dark themes, and other layouts keep the entire legacy presentation. The setting is an opt-in, not an entitlement or security control.

## Rendering and fields

A supported collection gets `caas-c2`, `data-c2-card="media"`, and `data-c2-media-ratio="16:9"` on its own wrapper. CSS is scoped to that wrapper. Adjacent collections remain independent. Turning the option off restores legacy markup and styles.

- Existing images use the existing crop behavior inside a 16:9 image area. Image height grows with card width. Source images are not rewritten.
- Existing `styles.mnemonic`, when present, supplies the product icon above the copy. Missing values leave no placeholder. No new tag lookup or backend field is introduced.
- Existing eBook badge data and position are retained. Final badge/eyebrow/icon combinations still need design approval.
- The demo supplies one existing secondary outline button. The POC does not validate all possible authored footer combinations.
- Existing typography and colors are retained. Spacing and radius in the pilot stylesheet are provisional.
- Existing 3up grid and breakpoints are reused. The POC does not introduce a 12/10/8 grid or claim approved C2 reflow behavior.

## Before production

Agree on C2 tokens, responsive rules, allowed field combinations, CTA variations, and rollout eligibility. Review keyboard behavior, contrast, focus, icon meaning/accessible naming, long text, localization and RTL. The prototype treats the mnemonic as decorative; meaningful product identity requires an agreed text/accessibility approach. Backend description truncation is unchanged. Supporting longer descriptions requires separate service work, not a new image ratio or a CSS change.

Implement the production configurator option in Milo, confirm configuration propagation and preview/export behavior, and agree on US pilot scope and later regional rollout gates. No backend or Milo changes are included here.

## Shareable collection comparison

After publishing this build's versioned assets, use `?caasver=<published-version>&caas_c2_review=1` on a Milo page. The first parameter chooses the library; the second explicitly enables prototype comparison controls above each collection. Supported collections initially show C2. Each checkbox independently switches the same loaded content between C2 and legacy without refetching, changing stored configuration, or changing the grid. Reloading resets review switches to C2. Unsupported collections show an explanatory message and retain their authored presentation.

Without `caas_c2_review=1`, no review controls appear and the authored presentation setting applies. This is a review mechanism, not the production authoring checkbox. Reviewers can compare multiple compatible collections on a page; other card styles, dark themes and other grid layouts remain outside this pilot. The demo URL does not grant access to restricted pages.

The release package alone is not a live Adobe.com preview. The existing Rundeck Release CAAS UI job must publish it before `caasver` can load it. `Pin=false` updates the chosen version and beta, while stable/0 should remain unchanged and require verification. A new immutable version should be used for each review build; do not overwrite a previously shared version.

Capture feedback with the full URL/version, collection title or location, viewport width, C2/legacy selection, and the specific discrepancy. Review short/long copy, missing icons, badge/icon combinations and mobile/tablet layouts. Final design, accessibility and localization sign-off remain separate from this demonstration.
