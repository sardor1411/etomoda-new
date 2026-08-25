import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductGrid } from '../components/product/ProductGrid';
import { ArrowRight, Filter, ChevronDown } from 'lucide-react';
import { Link, useParams, useSearchParams, useLocation } from 'react-router';

export function Home() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const q = searchParams.get('q');
  
  const [genderFilter, setGenderFilter] = useState<'all'|'men'|'women'>('all');
  const [sortBy, setSortBy] = useState('newest');

  const isHome = location.pathname === '/';
  const isMahsulotlar = location.pathname === '/mahsulotlar';
  
  const activeCategory = isMahsulotlar ? 'all' : id;

  let pageTitle = 'Yangi kelganlar';
  let pageDesc = "Doimiy kolleksiyamizdagi eng yangi qo'shilganlar.";
  
  if (q) {
    pageTitle = `Qidiruv natijalari: "${q}"`;
    pageDesc = "Qidiruvingiz bo'yicha topilgan barcha mahsulotlar.";
  } else if (isMahsulotlar) {
    pageTitle = 'Barcha Mahsulotlar';
    pageDesc = "Eng so'nggi urfdagi va yuqori sifatli kiyimlar to'plami. O'z uslubingizni kashf eting.";
  } else if (id === 'clothing') {
    pageTitle = "Kiyimlar";
    pageDesc = "Kundalik va maxsus kunlar uchun kiyimlar kolleksiyasi.";
  } else if (id === 'outerwear') {
    pageTitle = "Tashqi kiyim";
    pageDesc = "Yuqori sifatli paltolar, kurtkalar va plashlar.";
  } else if (id) {
    pageTitle = `${id.charAt(0).toUpperCase() + id.slice(1)} bo'limi`;
    pageDesc = "Ushbu bo'limdagi barcha mahsulotlar.";
  }

  return (
    <div className="flex flex-col bg-white">
      {isHome && (
        <>
          {/* Hero Section */}
          <section className="h-[100svh] w-full relative overflow-hidden bg-[#1D1D1F]">
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2787&auto=format&fit=crop" 
                alt="High Fashion Editorial" 
                className="w-full h-full object-cover object-top opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
            </motion.div>
            
            <div className="absolute inset-0 flex flex-col justify-end pb-24 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-8"
              >
                <div>
                  <h1 className="text-6xl md:text-[120px] font-bold tracking-tighter leading-[0.85] text-white uppercase drop-shadow-xl">
                    ETOMODA
                  </h1>
                </div>
                <div className="flex flex-col gap-6 md:pb-4">
                  <p className="text-white/80 text-lg md:text-xl font-light max-w-sm leading-relaxed">
                    A curated selection of luxury garments. Designed for the modern minimalist.
                  </p>
                  <Link to="/mahsulotlar" className="group inline-flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-sm font-semibold tracking-widest hover:bg-white hover:text-black transition-all duration-500 w-fit">
                    Kolleksiyani ko'rish <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Philosophy Statement */}
          <section className="py-32 md:py-48 px-6 w-full bg-white flex justify-center items-center">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#86868B] mb-8 block"
              >
                Bizning Falsafamiz
              </motion.span>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-[#1D1D1F]"
              >
                Kiyim — bu shunchaki mato emas.<br className="hidden md:block" /> Bu sizning hikoyangizning<br className="hidden md:block" /> jim ifodasi.
              </motion.p>
            </div>
          </section>

          {/* Luxury Collection Cards */}
          <section className="px-4 md:px-8 pb-32 bg-white w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-[1600px] mx-auto">
              
              <Link to="/mahsulotlar" className="group relative h-[260px] md:h-[400px] overflow-hidden rounded-3xl bg-[#F5F5F7]">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop" alt="Premium Kolleksiya" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/70 mb-2 md:mb-3">Yangi</span>
                  <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">Premium<br />Kolleksiya</h3>
                  <div className="w-0 group-hover:w-16 h-0.5 bg-white transition-all duration-700 ease-out" />
                </div>
              </Link>
              
              <Link to="/mahsulotlar" className="group relative h-[260px] md:h-[400px] overflow-hidden rounded-3xl bg-[#F5F5F7]">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2640&auto=format&fit=crop" alt="Trend Kiyimlar" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/70 mb-2 md:mb-3">Mashhur</span>
                  <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">Trend<br />Kiyimlar</h3>
                  <div className="w-0 group-hover:w-16 h-0.5 bg-white transition-all duration-700 ease-out" />
                </div>
              </Link>

            </div>
          </section>
        </>
      )}

      {/* Featured Products */}
      <section className={`px-4 md:px-8 w-full ${isHome ? 'py-16 md:py-32 bg-[#F9F9F9]' : 'py-32'}`}>
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1D1D1F] mb-3">
              {pageTitle}
            </h2>
            <p className="text-[#515154] text-lg max-w-2xl">
              {pageDesc}
            </p>
          </div>
          {isHome && (
            <Link to="/mahsulotlar" className="text-[13px] font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity hidden sm:flex items-center gap-2 border-b border-black/20 pb-1">
              Barchasini ko'rish <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        {isMahsulotlar && (
          <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-black/5 gap-4">
            <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
              <button 
                onClick={() => setGenderFilter('all')}
                className={`text-[13px] font-medium px-5 py-2.5 rounded-full flex-shrink-0 transition-colors ${genderFilter === 'all' ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] hover:bg-gray-200 text-[#1D1D1F]'}`}
              >
                Barchasi
              </button>
              <button 
                onClick={() => setGenderFilter('men')}
                className={`text-[13px] font-medium px-5 py-2.5 rounded-full flex-shrink-0 flex items-center gap-2 transition-colors ${genderFilter === 'men' ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] hover:bg-gray-200 text-[#1D1D1F]'}`}
              >
                <Filter className="w-3.5 h-3.5" /> Erkaklar
              </button>
              <button 
                onClick={() => setGenderFilter('women')}
                className={`text-[13px] font-medium px-5 py-2.5 rounded-full flex-shrink-0 flex items-center gap-2 transition-colors ${genderFilter === 'women' ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] hover:bg-gray-200 text-[#1D1D1F]'}`}
              >
                <Filter className="w-3.5 h-3.5" /> Ayollar
              </button>
            </div>
            <div className="relative hidden md:block">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none text-[13px] bg-[#F5F5F7] border-none rounded-full px-5 py-2.5 pr-10 font-medium cursor-pointer focus:ring-2 focus:ring-black/5 outline-none text-[#1D1D1F]"
              >
                <option value="newest">Eng yangilari</option>
                <option value="price_asc">Arzonlari oldin</option>
                <option value="price_desc">Qimmatlari oldin</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
        )}
        
        <ProductGrid category={activeCategory} gender={genderFilter} sortBy={sortBy} />
        
        {isHome && (
          <div className="flex justify-center mt-16">
            <Link to="/mahsulotlar" className="inline-flex items-center gap-2 bg-white border border-black/10 shadow-sm text-[#1D1D1F] px-8 py-4 rounded-2xl font-medium hover:bg-gray-50 transition-all active:scale-[0.98]">
              Barcha mahsulotlarni ko'rish <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
