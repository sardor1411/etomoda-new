import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, 
  PlusCircle, Menu, X, Bell, Search, ChevronRight, UserCircle, Store
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Yangi mahsulot', path: '/admin/products/add', icon: PlusCircle },
    { name: 'Mahsulotlar', path: '/admin/products', icon: Package },
    { name: 'Buyurtmalar', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Mijozlar', path: '/admin/customers', icon: Users },
  ];

  const breadcrumbs = location.pathname.split('/').filter(Boolean);

  return (
    <div className="h-screen w-full bg-[#FAFAFA] flex overflow-hidden font-sans text-[#1D1D1F]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`
              fixed md:static inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-black/5 flex flex-col flex-shrink-0
              ${isMobile ? 'shadow-2xl' : ''}
            `}
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-black/5">
              <Link to="/admin" className="text-[17px] font-bold tracking-tight text-[#1D1D1F] flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-[10px]">ET</span>
                </div>
                ETOMODA
              </Link>
              {isMobile && (
                <button onClick={() => setIsSidebarOpen(false)} className="text-black/50 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-black/40 mb-3 block px-3">Asosiy</span>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                        isActive 
                        ? 'bg-black/5 text-[#1D1D1F]' 
                        : 'text-[#515154] hover:bg-black/5 hover:text-[#1D1D1F]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-black/5 space-y-1">
              <Link 
                to="/"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-[#1D1D1F] hover:bg-black/5 transition-colors"
              >
                <Store className="w-4 h-4 text-[#86868B]" />
                Do'konga qaytish
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-[#1D1D1F] hover:bg-black/5 transition-colors"
              >
                <LogOut className="w-4 h-4 text-[#86868B]" />
                Chiqish
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA]">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-black/5 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-black/50 hover:text-black">
                <Menu className="w-6 h-6" />
              </button>
            )}
            
            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-2 text-[13px] font-medium text-[#86868B]">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={isLast ? 'text-[#1D1D1F]' : 'capitalize'}>{crumb}</span>
                    {!isLast && <ChevronRight className="w-3.5 h-3.5 text-black/20" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden md:flex items-center">
              <Search className="w-4 h-4 text-black/40 absolute left-3" />
              <input 
                type="text" 
                placeholder="Qidirish..." 
                className="pl-9 pr-4 py-1.5 text-[13px] bg-black/5 border-transparent rounded-lg focus:bg-white focus:border-black/20 focus:ring-2 focus:ring-black/10 transition-all w-64 outline-none"
              />
              <div className="absolute right-3 flex gap-1">
                <kbd className="hidden lg:inline-flex items-center justify-center text-[10px] font-mono text-black/40 border border-black/10 rounded px-1">⌘</kbd>
                <kbd className="hidden lg:inline-flex items-center justify-center text-[10px] font-mono text-black/40 border border-black/10 rounded px-1.5">K</kbd>
              </div>
            </div>
            
            <button className="relative text-black/50 hover:text-black transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            
            <div className="w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black/20 transition-colors">
              <UserCircle className="w-6 h-6 text-black/40" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
