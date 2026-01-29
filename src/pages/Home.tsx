import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden bg-gray-900">
        <img
          src="/images/hero-1.jpg"
          alt="Maniar Atelier Collection"
          className="h-full w-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-black/30">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 drop-shadow-lg">MANIAR ATELIER</h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg drop-shadow-md">
            Where modern aesthetics meet timeless elegance.
          </p>
          <div className="flex gap-4">
            <Link to="/men" className="px-8 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition shadow-lg">
              Shop Men
            </Link>
            <Link to="/women" className="px-8 py-3 border-2 border-white text-white font-medium rounded hover:bg-white/10 transition shadow-lg">
              Shop Women
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-12 uppercase tracking-wide">Season Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
           {/* Feature 1 */}
           <div className="relative group overflow-hidden rounded-lg aspect-[4/5] cursor-pointer bg-gray-200">
             <img src="/images/hero-2.png" alt="Women" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-90" />
             <div className="absolute bottom-8 left-8 text-white">
               <h3 className="text-2xl font-bold mb-2">Women's New Arrivals</h3>
               <p className="mb-4 text-gray-200">Elegance for every occasion.</p>
               <Link to="/women" className="underline underline-offset-4 hover:text-white">View Collection</Link>
             </div>
           </div>

           {/* Feature 2 */}
           <div className="flex flex-col justify-center items-center text-center p-12 rounded-lg bg-gray-50 border border-gray-100">
              <h3 className="text-3xl font-bold mb-4">The Men's Edit</h3>
              <p className="text-gray-600 mb-8 max-w-xs">Sharp looks for the modern gentleman. Discover jackets, shirts, and essentials.</p>
              <Link to="/men" className="px-8 py-3 bg-black text-white rounded hover:bg-gray-800 transition">
                Explore Men
              </Link>
           </div>

        </div>
      </div>
    </div>
  );
}
