
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { Product, User } from '../types';
import ProductCard from './ProductCard';

interface CatalogProps {
  user: User | null;
  onLogin: () => void;
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
  onOpenWishlist: () => void;
}

const Catalog: React.FC<CatalogProps> = ({ 
  user, 
  onLogin, 
  wishlist, 
  onToggleWishlist, 
  onOpenWishlist 
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [maxPrice, setMaxPrice] = useState<number>(300);

  const categories = [
    { name: 'All', icon: 'M4 6h16M4 12h16M4 18h16' },
    { name: 'Optical', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
    { name: 'Sunglasses', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Contact Lenses', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(MOCK_PRODUCTS.map(p => p.brand)));
    return ['All Brands', ...uniqueBrands.sort()];
  }, []);

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const categoryMatch = filter === 'All' || p.category === filter;
    const brandMatch = selectedBrand === 'All Brands' || p.brand === selectedBrand;
    const priceMatch = p.price <= maxPrice;

    return categoryMatch && brandMatch && priceMatch;
  });

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="full-wide-container pt-40 pb-32">
      {/* Catalog Header */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-16">
        <div className="max-w-3xl">
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">OptiVision Flagship</span>
          <h2 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tighter mb-6 leading-[0.9]">
            The <span className="text-blue-600">Premium</span> <br />Eyewear Catalog.
          </h2>
          <p className="text-xl text-slate-500 font-medium">Precision-crafted frames for the discerning eye. Filter by brand, price, and category to find your perfect fit.</p>
        </div>
        
        <button 
          onClick={onOpenWishlist}
          className="group relative flex items-center gap-4 bg-white px-8 py-5 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all border border-slate-50 overflow-hidden"
        >
          <div className={`p-2.5 rounded-full transition-all ${wishlist.size > 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
            <svg xmlns="http://www.w3.org/2000/center" className="h-6 w-6" fill={wishlist.size > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="font-bold text-slate-700 text-lg">My Favorites</span>
          {wishlist.size > 0 && (
            <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-full">{wishlist.size}</span>
          )}
        </button>
      </div>

      {/* Modern Filter Layout */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16 items-start">
        
        {/* Category Buttons (Visually Distinct) */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Collections</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setFilter(cat.name)}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all border-2 ${
                  filter === cat.name 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'bg-white border-slate-50 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                </svg>
                <span className="text-xs font-bold tracking-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Brand Selector (Chips instead of dropdown) */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Designer Brands</h3>
          <div className="flex flex-wrap gap-2">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                  selectedBrand === brand 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Slider (Instead of dropdown) */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Price Ceiling</h3>
            <span className="text-blue-600 font-black text-lg tracking-tight">${maxPrice}</span>
          </div>
          <div className="space-y-4">
            <input 
              type="range" 
              min="0" 
              max="300" 
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all hover:bg-slate-200"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">
              <span>$0</span>
              <span>$150</span>
              <span>$300+</span>
            </div>
          </div>
          <button 
            onClick={() => {
              setFilter('All');
              setSelectedBrand('All Brands');
              setMaxPrice(300);
            }}
            className="w-full py-4 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 rounded-2xl transition-colors border-2 border-dashed border-red-50"
          >
            Reset Catalog
          </button>
        </div>
      </div>

      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">
            {filteredProducts.length} Results Found
          </span>
        </div>
        
        <div className="hidden md:flex gap-2">
          {filter !== 'All' && (
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{filter}</span>
          )}
          {selectedBrand !== 'All Brands' && (
            <span className="bg-slate-100 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{selectedBrand}</span>
          )}
          {maxPrice < 300 && (
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Under ${maxPrice}</span>
          )}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product, idx) => (
            <div key={product.id} className="stagger-item" style={{ animationDelay: `${idx * 0.05}s` }}>
              <ProductCard 
                product={product} 
                onClick={() => handleProductClick(product)}
                isWishlisted={wishlist.has(product.id)}
                onToggleWishlist={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product.id);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center">
          <div className="bg-slate-50 w-32 h-32 rounded-full flex items-center justify-center mb-8 text-slate-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">No Matches Found</h3>
          <p className="text-slate-400 text-lg font-medium max-w-sm">Try broadening your search or resetting the filters to explore our flagship collection.</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
