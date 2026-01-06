
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-2xl shadow-xl w-14 h-14 flex items-center justify-center overflow-hidden border border-slate-800">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3017/3017056.png" 
                  alt="MSV" 
                  className="w-10 h-10 object-contain" 
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">MSV<span className="text-blue-500 font-normal">Eyeworks</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Manila's premier destination for clinical eye care and high-fashion eyewear. Experience the intersection of precision and style with MSV Eyeworks Optical.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Kasiglahan Village 1, Rodriguez Rizal
              </p>
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +63 2 8123 4567
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#/products" className="hover:text-blue-400 transition-colors">Our Products</a></li>
              <li><a href="#/appointment" className="hover:text-blue-400 transition-colors">Book Exam</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Our Rizal Clinic</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Clinical Support</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Prescription Guide</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Lens Technology</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Lens Care</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Rizal Exclusive</h4>
            <p className="text-sm mb-4">Join our VIP list for exclusive MSV Eyeworks store event invites.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                id="footer-email"
                name="footer-email"
                placeholder="Email address" 
                className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-xs text-center">
          &copy; {new Date().getFullYear()} MSV Eyeworks Optical Rizal. Premium Eyecare Specialists.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
