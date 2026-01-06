
import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const scrollToDiscover = () => {
    const section = document.getElementById('discover-more');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center pt-24 pb-32 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-[#f1f5f9]/80 rounded-bl-[200px] -z-10 animate-in fade-in slide-in-from-right duration-1000"></div>
      <div className="absolute top-40 right-40 w-96 h-96 bg-blue-400/10 blur-[150px] animate-pulse"></div>
      
      <div className="full-wide-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-12 stagger-item">
            <div>
              <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-blue-100 mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                </span>
                Est. 2024 • MSV Eyeworks Manila
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-extrabold text-slate-900 leading-[1.1] tracking-tighter">
                Clarity is the <br />
                <span className="text-blue-600 inline-block relative">
                  New Luxury
                  <div className="absolute -bottom-2 left-0 w-full h-4 bg-blue-100 -z-10 rounded-full blur-sm opacity-50"></div>
                </span>
              </h1>
            </div>
            
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
              Discover a bespoke vision experience at MSV Eyeworks, where world-class clinical expertise meets the avant-garde aesthetic of Manila's modern elite.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={onCtaClick}
                className="group relative px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-extrabold text-lg hover:bg-blue-700 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.25)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Explore The Collection
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </button>
              
              <button 
                onClick={scrollToDiscover}
                className="px-10 py-5 bg-slate-50 text-slate-900 border-2 border-slate-100 rounded-[2rem] font-extrabold text-lg hover:border-blue-600 hover:text-blue-600 transition-all hover:bg-white flex items-center justify-center gap-3 group"
              >
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-12 pt-8">
              {[
                { label: 'Curated Brands', val: '15+' },
                { label: 'Global Excellence', val: '24/7' },
                { label: 'Patient Loyalty', val: '98%' }
              ].map((stat, i) => (
                <div key={stat.label} className="animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${0.5 + (i * 0.1)}s` }}>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{stat.val}</div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative group stagger-item hidden lg:block" style={{ animationDelay: '0.3s' }}>
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.12)] border-[12px] border-white animate-float bg-slate-50">
              <img 
                src="/assets/597249834_33435671399364564_2689499441945697335_n.jpg" 
                alt="Luxury Eyewear" 
                className="w-full h-auto min-h-[500px] object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
            </div>
            
            <div className="absolute -bottom-10 -right-6 z-20 glass-effect p-8 rounded-[3rem] shadow-2xl border border-white/50 max-w-[280px] animate-in slide-in-from-right duration-1000">
              <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-900 font-extrabold text-xl leading-tight mb-2">Clinical Precision.</p>
              <p className="text-slate-500 text-sm font-medium">MSV Eyeworks ensures every frame is fitted with clinical accuracy using Zeiss 3D technology.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div 
        onClick={scrollToDiscover}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group opacity-50 hover:opacity-100 transition-opacity duration-500"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-blue-600 transition-colors">Scroll</span>
        <div className="w-6 h-10 border-2 border-slate-200 rounded-full flex justify-center p-1 group-hover:border-blue-200 transition-colors">
          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce group-hover:bg-blue-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
