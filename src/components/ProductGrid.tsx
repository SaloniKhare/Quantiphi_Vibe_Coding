import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { EmptyState } from './EmptyState';

interface ProductGridProps {
  products: Product[];
  onReset: () => void;
}

/** Renders the filtered product list, or the empty state when nothing
 * matches. `products` is always the already-filtered, derived list —
 * this component has no filtering knowledge of its own. */
export function ProductGrid({ products, onReset }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
