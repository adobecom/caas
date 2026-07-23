# Mount catalog — coverage gaps (add these back)

Covered so far: 50 entries — 15 card styles, video button, themes, layouts (2/4/5up + carousel),
containers, borders, hover, filters (left/top), sort, search, bookmarks, pagination (loadMore/paginator),
banner, label, footer + divider, logo, badge, and all 10... (see below), infobit types.

## Not yet added (mount-and-check — quick via window._qa)
- **Config toggles:** layout gutter (2x/3x/4x); button styles (collection button: primary / call-to-action / over-background); collectionButtonStyle; disableBanners; useThemeThree; mode 'lightest'.
- **Infobit types missing:** gated, bookmark (2 of 12; other 10 done).
- **Card content bits:** title, description, image, gradient, CTA text variants, gated video, detailText variants.
- **overlay-link** (card.overlayLink) — marker/mechanism not yet found; needs digging.

## Filter / sort sub-behaviors (mostly mount-and-check, some need a click)
- filter side-search box, nested/category filters (category renders in baseline), clear-all, AND/OR logic.
- sort orders (the actual sort option list).

## Interaction / click-based (need the ACTION LAYER — separate mechanism: click then re-check)
- carousel ADVANCE (next/prev) — layout mounts; advancing is a click.
- filter expand/collapse; load-more click; paginator page click; search typing; bookmark toggle; modal open (video modal).

## Skipped by choice
- custom-card (separate function path).
