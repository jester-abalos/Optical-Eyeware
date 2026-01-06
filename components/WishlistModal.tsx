
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface WishlistModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ 
  products,
  isOpen, 
  onClose, 
  wishlist, 
  onToggleWishlist 
}) => {
  const navigate = useNavigate();
  const wishlistedProducts = products.filter(p => wishlist.has(p.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] flex flex-col animate-in slide-in-from-bottom-12 zoom-in-95 duration-500">
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Saved Masterpieces</h2>
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Your Personal Selection</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          {wishlistedProducts.length > 0 ? (
            <div className="grid gap-6">
              {wishlistedProducts.map(product => (
                <div 
                  key={product.id} 
                  className="flex gap-6 p-5 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all group cursor-pointer animate-in fade-in slide-in-from-right duration-300"
                  onClick={() => { navigate(`/product/${product.id}`); onClose(); }}
                >
                  <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{product.brand}</span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{product.name}</h3>
                    <p className="text-blue-600 font-black text-lg mt-1 tracking-tighter">₱{product.price.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                    className="self-center p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                    title="Remove from favorites"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-300 mb-8 relative">
                <div className="absolute inset-0 bg-blue-100 rounded-[2.5rem] animate-ping opacity-20"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">No Masterpieces Saved</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto leading-relaxed mb-10">
                Explore our curated collection and save the designs that define your visual identity.
              </p>
              <button 
                onClick={() => { navigate('/products'); onClose(); }}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                Start Exploring
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;
