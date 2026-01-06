
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Appointment from './components/Appointment';
import ProductDetail from './components/ProductDetail';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import WishlistModal from './components/WishlistModal';
import Admin from './components/Admin';
import { User, Product } from './types';
import { useProducts } from './hooks/useProducts';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Use real-time products from Supabase
  const { products, loading, error } = useProducts();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('optivision_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedWishlist = localStorage.getItem('optivision_wishlist');
    if (savedWishlist) setWishlist(new Set(JSON.parse(savedWishlist)));
  }, []);

  useEffect(() => {
    localStorage.setItem('optivision_wishlist', JSON.stringify(Array.from(wishlist)));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const addProduct = (newProduct: Product) => {
    // Note: With real-time Supabase, products are automatically updated
    // This function can be used to trigger a refresh if needed
    console.log('Product added:', newProduct);
  };

  const handleLogin = () => {
    const mockUser: User = {
      id: 'usr_123',
      name: 'Admin User',
      email: 'admin@optivision.ph',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    };
    setUser(mockUser);
    localStorage.setItem('optivision_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('optivision_user');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar 
        currentPage={location.pathname} 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        wishlistCount={wishlist.size}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <div className="animate-in fade-in duration-700">
              <Hero onCtaClick={() => navigate('/products')} />
              
              <div id="discover-more" className="full-wide-container -mt-8 relative z-10 scroll-mt-32">
                <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-16 grid md:grid-cols-3 gap-12 text-white shadow-2xl">
                  {[
                    { id: '01', title: 'Zeiss 3D Scan', desc: 'Precision mapping for 100% frame accuracy.' },
                    { id: '02', title: 'Global Curation', desc: 'Direct imports from Milan & Tokyo boutiques.' },
                    { id: '03', title: 'Clinical Optic', desc: 'Medical-grade lenses by PhD optometrists.' }
                  ].map((item, i) => (
                    <div key={item.id} className="flex items-center gap-6 stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl font-bold">{item.id}</div>
                      <div>
                        <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <section className="py-32 bg-[#f8fafc]">
                <div className="full-wide-container">
                  <div className="text-center max-w-3xl mx-auto mb-20 stagger-item">
                    <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">The MSV Signature Experience</span>
                    <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tighter mb-6">World-Class Services <span className="text-blue-600">Tailored to You.</span></h2>
                    <p className="text-slate-500 font-medium">Beyond eyewear, we provide a complete visual healthcare ecosystem powered by cutting-edge German technology.</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { title: "Zeiss i.Terminal 2 Fitting", desc: "Digital centration capturing parameters with 0.1mm accuracy.", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                      { title: "OCT Retinal Imaging", desc: "Hospital-grade scanning to detect early ocular health changes.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
                      { title: "Bespoke Frame Styling", desc: "Personalized styling consultation to match frames with your brand.", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                      { title: "Specialty Contact Clinic", desc: "Advanced fittings for Ortho-K and complex corneal conditions.", icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
                    ].map((service, idx) => (
                      <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover-lift group">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{service.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">{service.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="py-32 bg-slate-50">
                <div className="full-wide-container">
                  <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 stagger-item">
                      <div className="bg-white p-2 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden aspect-video relative group">
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.9482181744154!2d121.1448!3d14.7431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397bb2f9540b03f%3A0x6734125f19005c2e!2sKasiglahan%20Village%201!5e0!3m2!1sen!2sph!4v1709123456789!5m2!1sen!2sph" 
                          width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) contrast(1.2)' }} loading="lazy" 
                          className="group-hover:filter-none transition-all duration-1000"
                        ></iframe>
                      </div>
                    </div>
                    <div className="order-1 lg:order-2 space-y-10 stagger-item">
                      <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs">Our Location</span>
                      <h2 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[0.9]">Visit Our <br/><span className="text-blue-600">Rizal Flagship.</span></h2>
                      <div className="space-y-6">
                        <div className="flex gap-6">
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-600 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xl mb-1">Kasiglahan Village 1</h4>
                            <p className="text-slate-500 font-medium">Block 10 lot 1G phase 1B, San Jose Rodriguez Rizal</p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => window.open('https://maps.google.com/?q=Kasiglahan+Village+1+Rodriguez+Rizal', '_blank')}
                        className="px-10 py-5 bg-white border-2 border-slate-100 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-900 hover:border-blue-600 hover:text-blue-600 transition-all"
                      >
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          } />
          
          <Route path="/products" element={<Products products={products} loading={loading} error={error} user={user} onLogin={handleLogin} wishlist={wishlist} onToggleWishlist={toggleWishlist} onOpenWishlist={() => setIsWishlistOpen(true)} />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/product/:productId" element={<ProductDetail products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} onOpenWishlist={() => setIsWishlistOpen(true)} />} />
          <Route path="/admin" element={<Admin onAddProduct={addProduct} />} />
        </Routes>
      </main>

      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-[40] w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 border border-slate-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <WishlistModal products={products} isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
      <ChatWidget />
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AppContent />
  </HashRouter>
);

export default App;
