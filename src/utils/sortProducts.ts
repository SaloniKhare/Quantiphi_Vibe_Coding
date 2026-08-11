import type { Product, SortBy } from '../types/product';

/**
 * Arranges an already-filtered product list into presentation order.
 *
 * This is deliberately a SEPARATE function from filterProducts, and is
 * always called AFTER it in the pipeline:
 *
 *   filterProducts(masterProducts, filters)  -> which products qualify
 *   sortProducts(thatResult, sortBy)         -> what order to show them in
 *
 * Sorting never changes set membership — a product that passed the filter
 * stays visible no matter what sortBy is selected, it just moves position.
 * That separation is what makes both stages easy to reason about (and
 * test) independently, and lets sorting flip instantly with no re-filter.
 *
 * Returns a NEW array (via [...products].sort(...)) rather than sorting
 * in place, so the caller's reference to the filtered list — and anything
 * memoized against it — is never mutated out from under it.
 */
export function sortProducts(products: Product[], sortBy: SortBy): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'default':
    default:
      return sorted;
  }
}
