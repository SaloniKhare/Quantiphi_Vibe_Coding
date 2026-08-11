import { useMemo, useState } from 'react';
import { products as masterProducts } from './data/products';
import type { FilterState, SortBy } from './types/product';
import { filterProducts } from './utils/filterProducts';
import { sortProducts } from './utils/sortProducts';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductGrid } from './components/ProductGrid';
import { SortDropdown } from './components/SortDropdown';

// Price bounds are derived once from the master inventory so the slider
// range always matches the real dataset instead of a hardcoded guess.
const PRICE_BOUNDS = {
  min: Math.floor(Math.min(...masterProducts.map((p) => p.price))),
  max: Math.ceil(Math.max(...masterProducts.map((p) => p.price))),
};

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  minPrice: PRICE_BOUNDS.min,
  maxPrice: PRICE_BOUNDS.max,
  minRating: 0,
};

export default function App() {
  // Single source of truth for active filter criteria, plus a separate
  // piece of state for presentation order — sorting doesn't affect
  // which products qualify, so it isn't part of FilterState.
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Two-stage derived pipeline, both memoized, neither duplicated in
  // state: masterProducts + filters -> filteredProducts (WHICH products
  // qualify), then filteredProducts + sortBy -> visibleProducts (WHAT
  // ORDER to show them in). Splitting the memo in two means changing
  // sortBy alone never re-runs the filter pass, and changing filters
  // alone re-sorts only the new (usually smaller) result — each stage
  // only recomputes when its own input actually changes.
  const filteredProducts = useMemo(
    () => filterProducts(masterProducts, filters),
    [filters],
  );

  const visibleProducts = useMemo(
    () => sortProducts(filteredProducts, sortBy),
    [filteredProducts, sortBy],
  );

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">Marketplace</h1>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Filters
            {(filters.categories.length > 0 || filters.minRating > 0) && (
              <span className="inline-flex h-2 w-2 rounded-full bg-brand-500" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6 lg:items-start">
          {/* Desktop sidebar */}
          <FilterSidebar
            filters={filters}
            priceBounds={PRICE_BOUNDS}
            onCategoriesChange={(categories) => setFilters((f) => ({ ...f, categories }))}
            onPriceChange={(minPrice, maxPrice) =>
              setFilters((f) => ({ ...f, minPrice, maxPrice }))
            }
            onRatingChange={(minRating) => setFilters((f) => ({ ...f, minRating }))}
            onReset={handleReset}
            className="hidden lg:block lg:sticky lg:top-[81px]"
          />

          <section>
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <p className="text-sm text-slate-500" role="status" aria-live="polite">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
            <ProductGrid products={visibleProducts} onReset={handleReset} />
          </section>
        </div>
      </main>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-20">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-slate-50 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="text-slate-500 hover:text-slate-800 text-xl leading-none px-2"
              >
                ×
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              priceBounds={PRICE_BOUNDS}
              onCategoriesChange={(categories) => setFilters((f) => ({ ...f, categories }))}
              onPriceChange={(minPrice, maxPrice) =>
                setFilters((f) => ({ ...f, minPrice, maxPrice }))
              }
              onRatingChange={(minRating) => setFilters((f) => ({ ...f, minRating }))}
              onReset={handleReset}
              className="border-none p-0"
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-lg bg-brand-500 text-white font-semibold py-2.5 hover:bg-brand-600"
            >
              Show {filteredProducts.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
