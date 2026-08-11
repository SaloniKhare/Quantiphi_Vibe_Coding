interface RatingFilterProps {
  minRating: number;
  onChange: (minRating: number) => void;
}

const OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Any rating' },
  { value: 1, label: '★ 1+' },
  { value: 2, label: '★ 2+' },
  { value: 3, label: '★ 3+' },
  { value: 4, label: '★ 4+' },
  { value: 5, label: '★ 5' },
];

/** Single-select radio group. minRating = 0 is the sentinel for "Any
 * rating" and disables rating filtering in filterProducts. */
export function RatingFilter({ minRating, onChange }: RatingFilterProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-900 mb-3">Minimum Rating</legend>
      <div className="space-y-2">
        {OPTIONS.map((option) => {
          const inputId = `rating-${option.value}`;
          const checked = minRating === option.value;
          return (
            <div key={option.value} className="flex items-center">
              <input
                id={inputId}
                type="radio"
                name="minRating"
                checked={checked}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 border-slate-300 text-brand-500 focus:ring-2 focus:ring-brand-500 cursor-pointer"
              />
              <label
                htmlFor={inputId}
                className={`ml-2 text-sm cursor-pointer select-none ${
                  checked ? 'text-slate-900 font-medium' : 'text-slate-600'
                }`}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
