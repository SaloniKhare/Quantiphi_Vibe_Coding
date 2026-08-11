import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

/** Renders a star rating as filled/half/empty glyphs, e.g. 3.5 -> ★★★½☆☆ */
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className="text-amber-500 text-sm" aria-hidden="true">
      {'★'.repeat(full)}
      {hasHalf ? '⯨' : ''}
      {'☆'.repeat(Math.max(empty, 0))}
    </span>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-brand-600 bg-brand-50 rounded-full px-2 py-0.5 mb-2">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug">{product.name}</h3>

        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-slate-500">{product.rating.toFixed(1)}</span>
        </div>

        {product.description && (
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{product.description}</p>
        )}

        <p className="text-base font-bold text-slate-900 mt-2">${product.price.toFixed(2)}</p>
      </div>
    </article>
  );
}
