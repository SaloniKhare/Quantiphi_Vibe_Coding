# E-Commerce Product Multi-Filter Sidebar

A responsive product catalog with simultaneous category, price-range, and
minimum-rating filtering. React + TypeScript + Vite + Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

Run the filtering unit tests:

```bash
npm test
```

## Project structure

```
src/
├── components/
│   ├── FilterSidebar.tsx      composition/layout only, no state
│   ├── CategoryFilter.tsx     checkbox group
│   ├── PriceRangeFilter.tsx   dual-thumb slider
│   ├── RatingFilter.tsx       radio group
│   ├── SortDropdown.tsx       presentation-order control, top-right of grid
│   ├── ProductGrid.tsx        renders cards or EmptyState
│   ├── ProductCard.tsx        single product card
│   └── EmptyState.tsx         "no results" + reset
├── data/
│   └── products.ts            master product inventory (28 items)
├── types/
│   └── product.ts             Product, FilterState, SortBy, CATEGORIES
├── utils/
│   ├── filterProducts.ts      stage 1: which products qualify
│   ├── filterProducts.test.ts unit tests
│   ├── sortProducts.ts        stage 2: what order to show them in
│   └── sortProducts.test.ts   unit tests
├── App.tsx                    owns filter state, wires everything together
├── main.tsx
└── index.css
```

## Architecture

`App` is the single owner of filter state (`useState<FilterState>`). It
passes `filters` and callbacks down to `FilterSidebar`, which is a pure
layout component — it renders `CategoryFilter`, `PriceRangeFilter`, and
`RatingFilter`, but holds no state of its own. Every control change calls
back up to `App`, which updates `filters`. There is no submit step: each
`setFilters` call triggers a re-render immediately.

`filteredProducts` (and the sorted list shown on screen) are **derived**,
not stored, as a two-stage pipeline:

```ts
const filteredProducts = useMemo(
  () => filterProducts(masterProducts, filters),
  [filters],
);

const visibleProducts = useMemo(
  () => sortProducts(filteredProducts, sortBy),
  [filteredProducts, sortBy],
);
```

`masterProducts` never changes, so stage 1 recomputes only when `filters`
changes. Stage 2 recomputes only when either its input (`filteredProducts`)
or `sortBy` changes — so switching "Sort by" alone never re-runs the filter
pass, it just reorders the array that's already there. Storing either
result as its own state would risk it drifting out of sync with its inputs
(e.g. after a reset, or after a filter narrows the set mid-sort) — deriving
both removes that class of bug entirely.

**Why sorting is a separate stage from filtering, not folded into it:**
filtering decides *membership* (is this product in the result set at all?);
sorting decides *order* (given that set, how should it be arranged?). They
answer different questions and change for different reasons — a product
matching "Electronics, $50–$200" is true regardless of whether the person
picked "Price: Low to High" or "Top Rated First". Keeping them as two
functions, chained rather than merged, keeps each one single-purpose,
independently testable (see `sortProducts.test.ts`), and cheap to reorder:
sort only ever runs on the smaller, already-filtered list, never on the
full 28-item master inventory.

## Filtering algorithm

`utils/filterProducts.ts` is the single source of truth for filter logic,
used by both the app and its tests:

```ts
products.filter((product) => {
  const categoryMatch = categories.length === 0 || categories.includes(product.category);
  const priceMatch = product.price >= minPrice && product.price <= maxPrice;
  const ratingMatch = minRating === 0 || product.rating >= minRating;
  return categoryMatch && priceMatch && ratingMatch;
});
```

- **Category**: OR across selected categories (a product matches if it's in
  *any* selected category), but AND against the other filter types. An empty
  `categories` array is the sentinel for "no category filter" — every
  product passes that check.
- **Price**: inclusive range (`>=` / `<=`), so boundary prices match.
- **Rating**: `minRating = 0` is the sentinel for "Any rating". Otherwise a
  product qualifies if its rating is `>=` the selected minimum (inclusive).
- **Combination**: all three checks are ANDed — a product must satisfy every
  *active* criterion simultaneously.

This is a single `Array.filter` pass, so it's **O(n)** in the number of
products regardless of how many filters are active.

## Design decisions / assumptions

- **Price bounds** are derived from the actual dataset
  (`Math.min`/`Math.max` over `masterProducts`) rather than hardcoded, so the
  slider always matches the real data range ($14.99–$249.50 here).
- **Dual-range slider** is built from two overlapping native
  `<input type="range">` elements rather than a third-party library, per
  "avoid unnecessary libraries." Each thumb is clamped against the other in
  the change handlers so min can never exceed max.
- **Images** use `picsum.photos/seed/<name>/600/450` — a seed per product
  gives a stable, distinct image with no API key and no risk of dead links.
- **Mobile filters** are a slide-in drawer (rather than filters stacked
  inline above the grid) to keep the product grid the primary focus on small
  screens, per the "collapsible panel/drawer" option in the spec.
- **Star rating** supports half-stars (e.g. 3.5) since real product ratings
  are rarely whole numbers; the "★ 4+" filter still works correctly against
  fractional ratings via `>=`.

## A note on this build environment

This project's dependencies (React, Vite, Tailwind, Vitest, etc.) were **not
installed or run** here — this sandbox has no outbound network access, so
`npm install` cannot reach the npm registry. Every file was written by hand
and cross-checked with the TypeScript compiler (using the project's own
`tsconfig.json` settings) for syntax errors and prop/type mismatches before
delivery, but it has not been executed in a browser. Run `npm install && npm
run dev` locally to launch it — if anything doesn't compile, it's likely a
version drift in a dependency rather than a logic error, and the fix will be
narrow.

