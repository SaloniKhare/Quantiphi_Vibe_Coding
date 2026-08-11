import type { FilterState } from '../types/product';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { RatingFilter } from './RatingFilter';

interface FilterSidebarProps {
  filters: FilterState;
  priceBounds: { min: number; max: number };
  onCategoriesChange: (categories: string[]) => void;
  onPriceChange: (minPrice: number, maxPrice: number) => void;
  onRatingChange: (minRating: number) => void;
  onReset: () => void;
  className?: string;
}

/** Pure composition/layout component — it owns no state itself. All filter
 * state lives in App and flows down as props; every control change bubbles
 * back up through the on*Change callbacks. */
export function FilterSidebar({
  filters,
  priceBounds,
  onCategoriesChange,
  onPriceChange,
  onRatingChange,
  onReset,
  className = '',
}: FilterSidebarProps) {
  return (
    <aside className={`bg-white rounded-xl border border-slate-200 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slate-900">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
        >
          Reset Filters
        </button>
      </div>

      <div className="space-y-6">
        <CategoryFilter selected={filters.categories} onChange={onCategoriesChange} />

        <hr className="border-slate-100" />

        <PriceRangeFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          bounds={priceBounds}
          onChange={onPriceChange}
        />

        <hr className="border-slate-100" />

        <RatingFilter minRating={filters.minRating} onChange={onRatingChange} />
      </div>
    </aside>
  );
}
