
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface ProductDetailProps {
  products: Product[];
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
  onOpenWishlist: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  products,
  wishlist, 
  onToggleWishlist, 
  onOpenWishlist 
}) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    } else {
      navigate('/products');
    }
  }, [productId, products, navigate]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 animate-pulse">
        <div className="h-6 w-32 bg-slate-100 rounded-lg mb-8 skeleton-shimmer"></div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-[4/5] rounded-[3rem] bg-slate-100 skeleton-shimmer"></div>
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-slate-100 rounded skeleton-shimmer"></div>
              <div className="h-12 w-full bg-slate-100 rounded-2xl skeleton-shimmer"></div>
              <div className="h-8 w-32 bg-slate-100 rounded-lg skeleton-shimmer"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-40 bg-slate-100 rounded skeleton-shimmer"></div>
              <div className="h-24 w-full bg-slate-100 rounded-2xl skeleton-shimmer"></div>
            </div>
            <div className="h-32 w-full bg-slate-50 rounded-[2rem] skeleton-shimmer"></div>
            <div className="flex gap-4">
              <div className="h-16 flex-1 bg-slate-100 rounded-2xl skeleton-shimmer"></div>
              <div className="h-16 flex-1 bg-slate-100 rounded-2xl skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.has(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      <div className="flex justify-between items-center mb-8 stagger-item">
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold">Return to Catalog</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-6 stagger-item" style={{ animationDelay: '0.1s' }}>
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-xl relative group">
            <img 
              src={product.image} 
              alt={product.name} 
              onLoad={() => setMainImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-1000 transform ${mainImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            />
            {!mainImageLoaded && (
               <div className="absolute inset-0 skeleton-shimmer"></div>
            )}
          </div>
        </div>

        <div className="space-y-10 stagger-item" style={{ animationDelay: '0.2s' }}>
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em]">{product.brand}</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">{product.category}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">{product.name}</h1>
            <span className="text-4xl font-black text-blue-600">₱{product.price.toLocaleString()}</span>
          </div>

          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Product Overview</h3>
            <p className="font-medium text-slate-600">{product.description}</p>
          </div>

          {(product.frameType || product.lensType || product.size) && (
            <div className="grid grid-cols-2 gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
              {product.frameType && (
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frame Type</p>
                  <p className="font-bold text-slate-900 text-lg">{product.frameType}</p>
                </div>
              )}
              {product.lensType && (
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lens Type</p>
                  <p className="font-bold text-slate-900 text-lg">{product.lensType}</p>
                </div>
              )}
              {product.size && (
                <div className="col-span-2 space-y-1 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimensions</p>
                  <p className="font-bold text-slate-900 text-lg">{product.size}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-5">
            <button 
              onClick={() => onToggleWishlist(product.id)}
              className={`flex-1 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                isWishlisted 
                  ? 'bg-red-50 text-red-600 border border-red-100' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isWishlisted ? 'Saved' : 'Save Item'}
            </button>
            <button 
              onClick={() => navigate('/appointment')}
              className="flex-1 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:border-blue-200 transition-all hover:shadow-lg active:scale-95"
            >
              Book Clinical Fitting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
