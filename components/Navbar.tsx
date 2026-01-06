
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  currentPage: string;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  user, 
  onLogin, 
  onLogout, 
  wishlistCount, 
  onOpenWishlist 
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Appointment', path: '/appointment' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 pointer-events-none ${scrolled ? 'pt-2' : 'pt-6'}`}>
      <div className="full-wide-container">
        <div className={`transition-all duration-500 pointer-events-auto border ${scrolled ? 'bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] border-white/50 px-6 py-1 mx-auto max-w-[1400px]' : 'bg-transparent border-transparent px-4 py-2'}`}>
          <div className="flex justify-between h-16 items-center">
            {/* MSV Eyeworks Logo - Now PNG and White BG */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="relative bg-white p-2 rounded-full shadow-xl shadow-blue-50 border border-blue-50 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center w-14 h-14 overflow-hidden">
                <img 
                  src="/assets/599508280_875966468709600_626380504237681260_n.jpg" 
                  alt="MSV" 
                  className="w-10 h-10 object-contain filter drop-shadow-sm" 
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-black tracking-tighter leading-none transition-colors duration-500 text-slate-900`}>MSV EYEWORKS</span>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mt-0.5">OPTICAL</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex gap-8 lg:gap-12 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold transition-all hover:text-blue-600 relative group/link ${
                    currentPage === link.path ? 'text-blue-600' : 'text-slate-500'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${currentPage === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={onOpenWishlist}
                className="relative p-3 text-slate-500 hover:text-blue-600 transition-all hover:bg-blue-50 rounded-2xl"
                title="View Wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                  >
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl border border-slate-200" />
                    <span className="text-sm font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 py-3 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="px-5 py-3 border-b border-slate-50 mb-2">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Signed In As</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                      </div>
                      <button className="w-full text-left px-5 py-2.5 text-sm text-slate-600 hover:bg-blue-50 transition-colors font-medium">My Profile</button>
                      <button 
                        onClick={() => { onOpenWishlist(); setIsProfileOpen(false); }}
                        className="w-full text-left px-5 py-2.5 text-sm text-slate-600 hover:bg-blue-50 transition-colors font-medium"
                      >
                        Wishlisted Items
                      </button>
                      <div className="mt-2 pt-2 border-t border-slate-50">
                        <button 
                          onClick={() => { onLogout(); setIsProfileOpen(false); }}
                          className="w-full text-left px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-bold"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={onLogin}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-700 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                  Login
                </button>
              )}
              
              <Link 
                to="/appointment"
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 whitespace-nowrap"
              >
                Book Consultation
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center gap-3">
              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2 bg-slate-100 rounded-xl transition-all active:scale-90">
                 {isOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-4 top-24 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 py-6 px-4 animate-in slide-in-from-top-4 duration-300 z-50 pointer-events-auto">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-left px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                  currentPage === link.path ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
