import { Link, useNavigate, useLocation } from 'react-router';
import { ShoppingBag, Search, Menu, User, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAppStore } from '../../store/appStore';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function Navbar() {
  const { getTotals } = useCartStore();
  const { itemsCount } = getTotals();
  const { setCartOpen, isMobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const [user, setUser] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email === 'admin@gmail.com') {
        setIsAdmin(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email === 'admin@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-6 max-w-[95%] md:max-w-[1400px]">
          <div className={`bg-white/80 backdrop-blur-2xl border border-white/40 shadow-sm transition-all duration-300 ease-in-out ${isSearchOpen ? 'rounded-3xl p-4 md:px-6 md:py-4' : 'rounded-full px-6 py-0'}`}>
            <div className="h-14 md:h-16 flex items-center justify-between relative">
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 -ml-2 text-[#1D1D1F] hover:bg-black/5 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Logo */}
              <Link to="/" className="text-xl font-bold tracking-widest text-[#1D1D1F] z-10 relative px-2">
                ETOMODA
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 space-x-8 text-[13px] font-medium tracking-wide">
                <Link 
                  to="/mahsulotlar" 
                  className={`transition-all duration-300 relative ${location.pathname.startsWith('/mahsulotlar') ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                >
                  Mahsulotlar
                  {location.pathname.startsWith('/mahsulotlar') && (
                    <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black" />
                  )}
                </Link>
                <Link 
                  to="/category/clothing" 
                  className={`transition-all duration-300 relative ${location.pathname === '/category/clothing' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                >
                  Kiyimlar
                  {location.pathname === '/category/clothing' && (
                    <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black" />
                  )}
                </Link>
                <Link 
                  to="/about" 
                  className={`transition-all duration-300 relative ${location.pathname === '/about' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                >
                  Biz haqimizda
                  {location.pathname === '/about' && (
                    <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black" />
                  )}
                </Link>
                <Link 
                  to="/contact" 
                  className={`transition-all duration-300 relative ${location.pathname === '/contact' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                >
                  Aloqa
                  {location.pathname === '/contact' && (
                    <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black" />
                  )}
                </Link>
              </nav>

              {/* Actions */}
              <div className="flex items-center space-x-2 md:space-x-4 z-10 relative">
                <button 
                  className={`p-2 hover:bg-black/5 rounded-full transition-all flex items-center gap-2 ${isSearchOpen ? 'text-black bg-black/5' : 'text-gray-700 hover:text-black'}`}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Search className="w-5 h-5" />
                </button>
                
                <button 
                  className="p-2 text-gray-700 hover:bg-black/5 hover:text-black rounded-full transition-all flex items-center relative"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {itemsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-black rounded-full"></span>
                  )}
                </button>

                <div className="relative">
                  <button 
                    className="p-2 text-gray-700 hover:bg-black/5 hover:text-black rounded-full transition-all flex items-center"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-4 w-48 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden py-2 border border-white/20 z-50">
                      {!user ? (
                        <>
                          <Link to="/login" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Kirish</Link>
                          <Link to="/register" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Ro'yxatdan o'tish</Link>
                        </>
                      ) : isAdmin ? (
                        <>
                          <Link to="/admin" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Boshqaruv Paneli</Link>
                          <Link to="/admin/products/add" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Mahsulot Qo'shish</Link>
                          <Link to="/admin/products" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Mahsulotlar</Link>
                          <Link to="/admin/orders" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Buyurtmalar</Link>
                          <Link to="/admin/customers" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Mijozlar</Link>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-gray-50">Chiqish</button>
                        </>
                      ) : (
                        <>
                          <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Profil</Link>
                          <Link to="/orders" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Buyurtmalar</Link>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-gray-50">Chiqish</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Embedded Search Bar */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden pb-1"
                >
                  <form onSubmit={handleSearch} className="relative flex items-center w-full">
                    <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-4 text-gray-400 pointer-events-none" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Mahsulotlarni qidirish..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#F5F5F7] text-[#1D1D1F] placeholder-gray-400 text-sm md:text-base rounded-2xl pl-11 pr-11 py-3 focus:outline-none focus:ring-1 focus:ring-black/10 transition-all border border-black/5"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }} 
                      className="absolute right-3 p-1.5 text-gray-400 hover:text-black hover:bg-black/5 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-100 mt-16">
              <span className="text-lg font-medium tracking-tighter">ETOMODA</span>
              <button className="p-2" onClick={() => setMobileMenuOpen(false)}>Yopish</button>
            </div>
            <nav className="p-6 flex flex-col space-y-6 text-xl tracking-tight">
              <form onSubmit={handleSearch} className="mb-4 relative">
                <input 
                  type="text" 
                  placeholder="Qidiruv..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-lg pr-12" 
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </button>
              </form>
              <Link 
                to="/mahsulotlar" 
                onClick={() => setMobileMenuOpen(false)}
                className={location.pathname.startsWith('/mahsulotlar') ? 'font-semibold' : ''}
              >
                Mahsulotlar
              </Link>
              <Link 
                to="/category/clothing" 
                onClick={() => setMobileMenuOpen(false)}
                className={location.pathname === '/category/clothing' ? 'font-semibold' : ''}
              >
                Kiyimlar
              </Link>
              <Link 
                to="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className={location.pathname === '/about' ? 'font-semibold' : ''}
              >
                Biz haqimizda
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className={location.pathname === '/contact' ? 'font-semibold' : ''}
              >
                Aloqa
              </Link>
              <div className="h-px bg-gray-100 w-full my-4"></div>
              {user ? (
                <>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-gray-500">Boshqaruv paneli</Link>}
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-500">Profil</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-red-500">Chiqish</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-500">Kirish</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-gray-500">Ro'yxatdan o'tish</Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
