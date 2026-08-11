import { CATEGORIES } from '../types/product';

interface CategoryFilterProps {
  selected: string[];
  onChange: (categories: string[]) => void;
}

/** Multi-select checkbox group. Selecting a category adds it to the array;
 * unselecting removes it. An empty array means "no category filter active"
 * — handled centrally in filterProducts, not here. */
export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  function toggle(category: string) {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-900 mb-3">Category</legend>
      <div className="space-y-2">
        {CATEGORIES.map((category) => {
          const inputId = `category-${category}`;
          const checked = selected.includes(category);
          return (
            <div key={category} className="flex items-center">
              <input
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={() => toggle(category)}
                className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-2 focus:ring-brand-500 cursor-pointer"
              />
              <label
                htmlFor={inputId}
                className={`ml-2 text-sm cursor-pointer select-none ${
                  checked ? 'text-slate-900 font-medium' : 'text-slate-600'
                }`}
              >
                {category}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
