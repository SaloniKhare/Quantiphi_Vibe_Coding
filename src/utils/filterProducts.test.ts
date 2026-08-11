import { describe, it, expect } from 'vitest';
import { filterProducts } from './filterProducts';
import type { Product, FilterState } from '../types/product';

const sample: Product[] = [
  { id: 1, name: 'A', category: 'Electronics', price: 100, rating: 4, image: '' },
  { id: 2, name: 'B', category: 'Apparel', price: 50, rating: 2, image: '' },
  { id: 3, name: 'C', category: 'Footwear', price: 150, rating: 5, image: '' },
  { id: 4, name: 'D', category: 'Electronics', price: 200, rating: 3, image: '' },
];

const baseFilters: FilterState = {
  categories: [],
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
};

describe('filterProducts', () => {
  it('returns the full inventory when no filters are active', () => {
    expect(filterProducts(sample, baseFilters)).toHaveLength(4);
  });

  it('filters by a single category', () => {
    const result = filterProducts(sample, { ...baseFilters, categories: ['Electronics'] });
    expect(result.map((p) => p.id)).toEqual([1, 4]);
  });

  it('filters by multiple categories using OR', () => {
    const result = filterProducts(sample, {
      ...baseFilters,
      categories: ['Apparel', 'Footwear'],
    });
    expect(result.map((p) => p.id)).toEqual([2, 3]);
  });

  it('filters by price range inclusively', () => {
    const result = filterProducts(sample, { ...baseFilters, minPrice: 100, maxPrice: 150 });
    expect(result.map((p) => p.id)).toEqual([1, 3]);
  });

  it('filters by minimum rating inclusively', () => {
    const result = filterProducts(sample, { ...baseFilters, minRating: 4 });
    expect(result.map((p) => p.id)).toEqual([1, 3]);
  });

  it('combines category, price, and rating with AND', () => {
    const result = filterProducts(sample, {
      categories: ['Electronics'],
      minPrice: 0,
      maxPrice: 150,
      minRating: 4,
    });
    expect(result.map((p) => p.id)).toEqual([1]);
  });

  it('returns an empty array when nothing matches', () => {
    const result = filterProducts(sample, { ...baseFilters, minPrice: 5000, maxPrice: 6000 });
    expect(result).toHaveLength(0);
  });

  it('handles an empty product inventory safely', () => {
    expect(filterProducts([], { ...baseFilters, categories: ['Electronics'] })).toEqual([]);
  });

  it('treats minPrice === maxPrice as an exact-price match', () => {
    const result = filterProducts(sample, { ...baseFilters, minPrice: 100, maxPrice: 100 });
    expect(result.map((p) => p.id)).toEqual([1]);
  });
});
