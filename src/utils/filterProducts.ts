import type { Product, FilterState } from '../types/product';

/**
 * Applies all active filter criteria to a product inventory and returns the
 * matching subset. A product must satisfy EVERY active criterion
 * (category AND price AND rating) to be included — this is a logical AND
 * across filter *types*, while categories themselves are combined with OR
 * (a product matches if it belongs to ANY selected category).
 *
 * "Inactive" filters are represented by sentinel values so this function
 * never needs to check for undefined/null:
 *   - categories: []  -> category filtering is skipped entirely
 *   - minRating: 0    -> rating filtering is skipped entirely
 *   - minPrice/maxPrice always have concrete numeric bounds
 *
 * Complexity: O(n) over the product list — a single pass, three cheap
 * per-item checks. No nested loops, no re-filtering of intermediate
 * results, so this scales linearly regardless of how many filters are
 * active.
 */
export function filterProducts(products: Product[], filters: FilterState): Product[] {
  const { categories, minPrice, maxPrice, minRating } = filters;

  return products.filter((product) => {
    const categoryMatch = categories.length === 0 || categories.includes(product.category);

    const priceMatch = product.price >= minPrice && product.price <= maxPrice;

    const ratingMatch = minRating === 0 || product.rating >= minRating;

    return categoryMatch && priceMatch && ratingMatch;
  });
}
