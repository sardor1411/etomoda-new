import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-lg font-semibold tracking-tight text-[#1D1D1F] mb-4 inline-block">
              ETOMODA
            </Link>
            <p className="text-sm text-[#515154] leading-relaxed">
              Arxitektura shakllarini o'rganish. Oliy sifatli materiallardan ehtiyotkorlik bilan tayyorlangan.
            </p>
          </div>
          
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#1D1D1F] mb-4">Do'kon</h4>
            <ul className="space-y-3 text-[13px] text-[#86868B] font-medium">
              <li><Link to="/mahsulotlar" className="hover:text-[#1D1D1F] transition-colors">Barcha mahsulotlar</Link></li>
              <li><Link to="/category/clothing" className="hover:text-[#1D1D1F] transition-colors">Kiyimlar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#1D1D1F] mb-4">Aloqa</h4>
            <ul className="space-y-3 text-[13px] text-[#86868B] font-medium">
              <li><a href="https://instagram.com/etomoda_uz" target="_blank" rel="noopener noreferrer" className="hover:text-[#1D1D1F] transition-colors">Instagram: etomoda_uz</a></li>
              <li><a href="https://t.me/etomodauz" target="_blank" rel="noopener noreferrer" className="hover:text-[#1D1D1F] transition-colors">Telegram: @etomodauz</a></li>
              <li><a href="tel:+998904380888" className="hover:text-[#1D1D1F] transition-colors">Tel: +998 90 438 08 88</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#1D1D1F] mb-4">Yangiliklar</h4>
            <form className="flex border-b border-black/10 pb-2">
              <input 
                type="email" 
                placeholder="Elektron manzilingizni kiriting" 
                className="bg-transparent border-none outline-none text-[13px] w-full text-[#1D1D1F] placeholder:text-[#86868B]"
              />
              <button type="submit" className="text-[13px] font-semibold text-[#1D1D1F] hover:opacity-70 transition-opacity">
                Obuna bo'lish
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 text-[10px] text-[#86868B] uppercase tracking-[0.15em] font-medium">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ETOMODA — Barcha huquqlar himoyalangan
          </p>
          <div className="flex space-x-8">
            <Link to="/sustainability" className="hover:text-[#1D1D1F] transition-colors">Barqarorlik hisoboti</Link>
            <Link to="/privacy" className="hover:text-[#1D1D1F] transition-colors">Maxfiylik siyosati</Link>
            <Link to="/terms" className="hover:text-[#1D1D1F] transition-colors">Foydalanish shartlari</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
