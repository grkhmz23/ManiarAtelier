import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100 mb-4 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>
      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
      <p className="mt-1 text-sm text-gray-500">${product.price.toFixed(2)}</p>
    </div>
  );
}
