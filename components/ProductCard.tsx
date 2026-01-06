
import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, isWishlisted = false, onToggleWishlist }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isLimitedStock = product.stock > 0 && product.stock <= 5;
  const isInStock = product.stock > 5;

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className={`group relative cursor-pointer bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover-lift hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.12)] hover:bg-slate-50/80 hover:border-blue-200 flex flex-col h-full transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/5 z-10 transition-colors duration-700 pointer-events-none"></div>
        
        <div className="w-full h-full relative flex items-center justify-center bg-slate-50">
          <img 
            src={product.image} 
            alt={product.name}
            className="max-w-full max-h-full object-contain transition-all duration-[2s] ease-out group-hover:scale-110 group-hover:rotate-1 group-hover:brightness-105"
          />
        </div>
        
        <button
          onClick={onToggleWishlist}
          className={`absolute top-6 right-6 z-20 p-3.5 rounded-2xl shadow-xl transition-all transform hover:scale-110 active:scale-90 ${
            isWishlisted ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white/80 text-slate-400 hover:text-blue-600 hover:bg-white backdrop-blur-xl border border-white/50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
          {product.brand && (
            <div className="bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
              {product.brand}
            </div>
          )}
          {isInStock && (
            <div className="bg-emerald-500/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              In Stock
            </div>
          )}
          {isLimitedStock && (
            <div className="bg-amber-500/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl flex items-center gap-2 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Limited
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow relative transition-all duration-500">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1 transition-transform duration-500 group-hover:-translate-y-1">
            <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-2xl tracking-tighter leading-tight">{product.name}</h3>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.3em]">{product.category}</p>
          </div>
          <span className="font-black text-slate-900 text-2xl tracking-tighter transition-transform duration-500 group-hover:scale-110 group-hover:text-blue-600">₱{product.price.toLocaleString()}</span>
        </div>
        
        <p className="text-slate-400 text-sm mb-8 line-clamp-2 leading-relaxed font-medium transition-colors duration-500 group-hover:text-slate-500">
          {product.description}
        </p>

        <div className="mt-auto flex justify-between items-center pt-8 border-t border-slate-100 group-hover:border-blue-100 transition-all duration-500">
          <div className="flex gap-3">
            {product.colors && product.colors.length > 0 && product.colors.map((color, index) => {
              // Handle color mapping for common colors
              const getColorCode = (colorName: string) => {
                const colorLower = colorName.toLowerCase().trim();
                switch(colorLower) {
                  case 'gold': return '#FFD700';
                  case 'silver': return '#C0C0C0';
                  case 'tortoise': return '#A52A2A';
                  case 'crystal': 
                  case 'crystal clear': 
                  case 'clear': return '#F0F8FF';
                  case 'black': return '#000000';
                  case 'brown': return '#8B4513';
                  case 'blue': return '#0000FF';
                  case 'red': return '#FF0000';
                  case 'green': return '#008000';
                  default: return colorLower;
                }
              };

              return (
                <div 
                  key={`${color}-${index}`}
                  className="w-5 h-5 rounded-full border-2 border-slate-100 ring-2 ring-transparent group-hover:ring-blue-50 ring-offset-2 transition-all hover:scale-125 shadow-sm"
                  style={{ backgroundColor: getColorCode(color) }}
                  title={color}
                ></div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700">
            View Design
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
