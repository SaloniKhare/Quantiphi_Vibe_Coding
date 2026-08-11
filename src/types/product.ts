export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number; // 0 - 5, supports .5 increments
  image: string;
  description?: string;
}

/** The set of active filter criteria. All fields always have a defined
 * value (never undefined/null) — "inactive" is represented by a sentinel
 * (empty array for categories, 0 for minRating) rather than by omission.
 * This keeps filterProducts() free of undefined-checks. */
export interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export const CATEGORIES = [
  'Electronics',
  'Apparel',
  'Footwear',
  'Home',
  'Accessories',
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Sort is intentionally its own piece of state, separate from
 * FilterState — it doesn't change WHICH products qualify, only the
 * presentation order of whichever products already survived filtering.
 * Keeping it separate is what lets the pipeline stay two clean stages:
 * filter(dataset) -> sort(filteredResult).
 */
export const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated First' },
] as const;

export type SortBy = (typeof SORT_OPTIONS)[number]['value'];
