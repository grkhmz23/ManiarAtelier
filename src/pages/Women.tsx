import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Women() {
  const womenProducts = products.filter(p => p.category === 'women');

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-wide">Women's Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {womenProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
