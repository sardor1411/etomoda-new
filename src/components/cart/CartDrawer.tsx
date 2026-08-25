import React, { useState } from 'react';
import { Sheet, SheetContent } from '../ui/sheet';
import { useCartStore } from '../../store/cartStore';
import { useAppStore } from '../../store/appStore';
import { Minus, Plus, X, ArrowRight, ShoppingBag, Trash2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCurrency } from '../../hooks/useCurrency';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { isCartOpen, setCartOpen } = useAppStore();
  const { items, removeItem, updateQuantity, getTotals } = useCartStore();
  const { subtotal } = getTotals();
  const navigate = useNavigate();
  const { format } = useCurrency();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  const freeShippingThreshold = 500000;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="!w-full !max-w-[100vw] sm:!max-w-md flex flex-col p-0 border-l border-white/20 bg-white/70 backdrop-blur-3xl shadow-2xl" showCloseButton={false}>
        <div className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-black/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-[#1D1D1F]">Savatcha</h2>
            <span className="bg-[#1D1D1F] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{items.length}</span>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-2 -mr-2 text-black/40 hover:text-black hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length > 0 && (
          <div className="px-6 md:px-8 py-5 border-b border-black/5 bg-white/40 flex-shrink-0">
            <div className="flex justify-between items-end mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1D1D1F]">Bepul yetkazib berish</span>
              <span className="text-xs font-medium text-[#86868B]">
                {subtotal >= freeShippingThreshold ? 'Tabriklaymiz!' : `${format(freeShippingThreshold - subtotal)} qoldi`}
              </span>
            </div>
            <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToFreeShipping}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${subtotal >= freeShippingThreshold ? 'bg-green-500' : 'bg-[#1D1D1F]'}`}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto hidden-scrollbar px-6 md:px-8 py-4">
          <AnimatePresence initial={false}>
            {items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-full bg-black/5 flex items-center justify-center border border-black/5 shadow-inner">
                  <ShoppingBag className="w-10 h-10 text-[#1D1D1F]/20" />
                </div>
                <div>
                  <p className="text-lg font-medium text-[#1D1D1F] mb-2">Savatchangiz bo'sh</p>
                  <p className="text-sm text-[#86868B] max-w-[250px]">O'zingizga mos uslubni topish uchun katalogga o'ting.</p>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="bg-[#1D1D1F] text-white px-8 py-4 rounded-full text-[13px] font-semibold tracking-wide hover:bg-black transition-transform active:scale-95 shadow-lg shadow-black/10 mt-4"
                >
                  Xaridni boshlash
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6 py-4">
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    className="flex gap-4 group"
                  >
                    <div className="w-[100px] h-[130px] rounded-2xl overflow-hidden bg-[#F5F5F7] flex-shrink-0 relative border border-black/5 flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover absolute inset-0" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const span = document.createElement('span');
                            span.className = 'text-[10px] font-medium text-black/40';
                            span.innerText = "Rasm yo'q";
                            e.currentTarget.parentElement?.appendChild(span);
                          }}
                        />
                      ) : (
                        <span className="text-[10px] font-medium text-black/40">Rasm yo'q</span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="text-[14px] font-semibold text-[#1D1D1F] leading-snug">{item.title}</h3>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 -mr-1.5 text-black/30 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[12px] font-medium text-[#86868B] mt-1 tracking-wide">
                          {item.color} <span className="mx-1.5 text-black/20">•</span> {item.size}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[15px] font-semibold text-[#1D1D1F]">{format(item.price)}</span>
                        
                        <div className="flex items-center bg-white border border-black/10 rounded-full overflow-hidden shadow-sm">
                          <button 
                            className="w-8 h-8 flex items-center justify-center text-[#515154] hover:bg-black/5 hover:text-black transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[13px] font-semibold w-6 text-center tabular-nums">{item.quantity}</span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center text-[#515154] hover:bg-black/5 hover:text-black transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/5 bg-white/90 backdrop-blur-xl flex-shrink-0">
            {/* Promo code area */}
            <div className="px-6 md:px-8 py-4 border-b border-black/5">
              <button className="flex items-center justify-between w-full text-left group">
                <div className="flex items-center gap-3 text-[#1D1D1F]">
                  <Tag className="w-4 h-4 text-black/50 group-hover:text-black transition-colors" />
                  <span className="text-[13px] font-semibold tracking-wide">Promokod qo'shish</span>
                </div>
                <Plus className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#86868B]">Mahsulotlar ({items.length})</span>
                  <span className="font-medium text-[#1D1D1F]">{format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#86868B]">Yetkazib berish</span>
                  <span className="font-medium text-[#1D1D1F]">{subtotal >= freeShippingThreshold ? 'Bepul' : 'Hisoblanadi'}</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-black/5 mt-3">
                  <span className="text-[16px] font-bold text-[#1D1D1F]">Jami</span>
                  <span className="text-[22px] font-bold tracking-tight text-[#1D1D1F]">{format(subtotal)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="relative overflow-hidden w-full bg-[#1D1D1F] text-white py-5 rounded-full text-[15px] font-semibold tracking-wide flex items-center justify-center gap-3 hover:bg-black active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] group"
              >
                <span>Xaridni rasmiylashtirish</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
