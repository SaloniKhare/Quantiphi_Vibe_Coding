interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <div className="text-4xl mb-3" aria-hidden="true">
        🔍
      </div>
      <p className="text-slate-700 font-medium mb-4">No items match your criteria.</p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        Reset Filters
      </button>
    </div>
  );
}
