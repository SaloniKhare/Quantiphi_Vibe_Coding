import { SORT_OPTIONS } from '../types/product';
import type { SortBy } from '../types/product';

interface SortDropdownProps {
  value: SortBy;
  onChange: (sortBy: SortBy) => void;
}

/** Presentation-order control. Deliberately separate from FilterSidebar —
 * sorting doesn't narrow the result set, it only reorders it, so it lives
 * with the grid it arranges rather than with the filter controls. */
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-by" className="text-sm text-slate-500 whitespace-nowrap">
        Sort by
      </label>
      <select
        id="sort-by"
        value={value}
        onChange={(e) => onChange(e.target.value as SortBy)}
        className="text-sm border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 bg-white text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
