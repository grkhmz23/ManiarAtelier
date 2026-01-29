import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-widest uppercase">Maniar Atelier</Link>
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-wide">
          <Link to="/men" className="hover:text-gray-600 transition-colors">Men</Link>
          <Link to="/women" className="hover:text-gray-600 transition-colors">Women</Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
