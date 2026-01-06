
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, User } from '../types';
import ProductCard from './ProductCard';

interface ProductsProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  user: User | null;
  onLogin: () => void;
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
  onOpenWishlist: () => void;
}

const ProductSkeleton = () => (
  <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden flex flex-col h-full animate-pulse">
    <div className="aspect-[4/5] skeleton-shimmer"></div>
    <div className="p-8 space-y-4">
      <div className="h-6 bg-slate-100 rounded-lg w-3/4"></div>
      <div className="h-4 bg-slate-50 rounded-lg w-full"></div>
    </div>
  </div>
);

const Products: React.FC<ProductsProps> = ({ 
  products,
  loading = false,
  error = null,
  wishlist, 
  onToggleWishlist, 
  onOpenWishlist 
}) => {
  const navigate = useNavigate();
  const [filterLoading, setFilterLoading] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [priceRange, setPriceRange] = useState<string>('All Prices');

  const categories = useMemo(() => {
  const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
  console.log('📦 Available categories in database:', uniqueCategories);
  console.log('📊 Total products loaded:', products.length);
  console.log('📋 Sample products:', products.slice(0, 3).map(p => ({ name: p.name, category: p.category })));
  return ['All', ...uniqueCategories.sort()];
}, [products]);
  const priceOptions = ['All Prices', 'Under ₱5,000', '₱5,000 - ₱15,000', 'Over ₱15,000'];

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
    return ['All Brands', ...uniqueBrands.sort()];
  }, [products]);

  // Helper functions for category matching
  const normalizeCategory = (cat: string | undefined) => cat?.toLowerCase().trim() || '';
  const normalizeFilter = (f: string) => f.toLowerCase().trim();

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const result = products.filter(p => {
      // Simple and reliable category matching
      const categoryMatch = filter === 'All' || 
        (p.category && p.category.toLowerCase().trim() === filter.toLowerCase().trim());
      
      const brandMatch = selectedBrand === 'All Brands' || 
        (p.brand && p.brand.toLowerCase().trim() === selectedBrand.toLowerCase().trim());
      
      let priceMatch = true;
      if (priceRange === 'Under ₱5,000') priceMatch = p.price < 5000;
      else if (priceRange === '₱5,000 - ₱15,000') priceMatch = p.price >= 5000 && p.price <= 15000;
      else if (priceRange === 'Over ₱15,000') priceMatch = p.price > 15000;

      return categoryMatch && brandMatch && priceMatch;
    });
    
    console.log('🔍 Final Filter Results:', {
      currentFilter: filter,
      totalProducts: products.length,
      filteredCount: result.length,
      availableCategories: [...new Set(products.map(p => p.category))],
      productsByCategory: products.reduce((acc, p) => {
        if (p.category) {
          if (!acc[p.category]) acc[p.category] = [];
          acc[p.category].push(p.name);
        }
        return acc;
      }, {}),
      filteredProducts: result.map(p => ({ name: p.name, category: p.category, price: p.price }))
    });
    
    return result;
  }, [products, filter, selectedBrand, priceRange]);

  return (
    <div className="pt-40 pb-32">
      <div className="full-wide-container">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-3xl stagger-item">
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">The 2024 Collection</span>
            <h2 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tighter mb-6 leading-[0.9]">
              Exceptional Frames for <span className="text-slate-400">Exceptional Eyes.</span>
            </h2>
          </div>
          
          <button 
            onClick={onOpenWishlist}
            className="group relative flex items-center gap-4 bg-white px-8 py-5 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-slate-50 overflow-hidden stagger-item active:scale-95"
          >
            <div className={`p-2.5 rounded-full transition-all ${wishlist.size > 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={wishlist.size > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-black text-slate-900 text-lg leading-none">Saved Items</span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{wishlist.size} {wishlist.size === 1 ? 'Frame' : 'Frames'}</span>
            </div>
          </button>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-16 items-start">
          <aside className="hidden lg:block sticky top-32 space-y-10 bg-white/50 backdrop-blur-sm p-8 rounded-[3rem] border border-white shadow-sm">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Category</h3>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => { setFilterLoading(true); setFilter(cat); }} className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border ${filter === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Designer Brand</h3>
              <div className="flex flex-wrap gap-2">
                {brands.map(brand => (
                  <button key={brand} onClick={() => { setFilterLoading(true); setSelectedBrand(brand); }} className={`px-4 py-2 rounded-xl text-xs font-bold border ${selectedBrand === brand ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border-slate-100'}`}>{brand}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { setFilter('All'); setSelectedBrand('All Brands'); setPriceRange('All Prices'); }} className="w-full py-4 text-red-500 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-red-50 rounded-2xl hover:bg-red-50 transition-colors">Reset Selection</button>
          </aside>

          <div className="min-h-[600px]">
            {error ? (
              <div className="text-center py-40 bg-red-50 rounded-[4rem] border-2 border-red-100">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">Unable to Load Products</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <p className="text-sm text-red-500">Please check your Supabase configuration and try again.</p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} isWishlisted={wishlist.has(product.id)} onToggleWishlist={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }} />
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">No Products Found</h3>
                <p className="text-slate-400 font-medium mb-4">
                  {filter === 'All' 
                    ? 'No products available in the database.' 
                    : `No products found in "${filter}" category.`
                  }
                </p>
                <p className="text-sm text-slate-500">
                  Try selecting a different category or check if products exist in the database.
                </p>
                {filter !== 'All' && (
                  <button 
                    onClick={() => { setFilter('All'); setSelectedBrand('All Brands'); setPriceRange('All Prices'); }}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                  >
                    Show All Products
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
