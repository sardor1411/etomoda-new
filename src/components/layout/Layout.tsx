import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { ProductDrawer } from '../product/ProductDrawer';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // 3.5 seconds splash screen
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F5F5F7] overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1D1D1F]"
              >
                ETOMODA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, filter: 'blur(5px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-base md:text-xl text-[#515154] font-medium tracking-tight px-4 text-center"
              >
                O'z stilingizni biz bilan yarating ✨
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-black/10">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
        <ProductDrawer />
      </div>
    </>
  );
}
