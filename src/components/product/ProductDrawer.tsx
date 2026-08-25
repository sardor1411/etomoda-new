import { Sheet, SheetContent } from '../ui/sheet';
import { useAppStore } from '../../store/appStore';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '../../store/cartStore';
import { X, Loader2, ChevronLeft, ChevronRight, Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import { useMediaQuery } from '../../lib/hooks/useMediaQuery';
import { useCurrency } from '../../hooks/useCurrency';
import { supabase } from '../../lib/supabaseClient';
import { Product } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountdown } from '../../hooks/useCountdown';

export function ProductDrawer() {
  const { quickViewProductId, setQuickViewProductId } = useAppStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const addItem = useCartStore(state => state.addItem);
  const setCartOpen = useAppStore(state => state.setCartOpen);
  const { format } = useCurrency();

  const discountEndDate = product?.color_images?.discount_end_date;
  const timeLeft = useCountdown(discountEndDate);
  const showDiscount = product?.discount_price && product.discount_price < product.price;

  useEffect(() => {
    async function fetchProduct() {
      if (!quickViewProductId) return;
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select(`*, product_images(*), product_colors(*), product_sizes(*)`)
        .eq('id', quickViewProductId)
        .single();
        
      if (data) {
        setProduct(data as Product);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [quickViewProductId]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.product_sizes?.[0]?.size || '');
      setSelectedColor(product.product_colors?.[0]?.color_name || '');
      setActiveImageIndex(0);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    const rawImg = product.product_images?.[0]?.image_url;
    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      title: product.title,
      price: showDiscount ? product.discount_price! : product.price,
      image: rawImg || '',
      color: selectedColor,
      size: selectedSize,
      quantity: 1
    });
    setQuickViewProductId(null);
    setCartOpen(true);
  };

  let currentGallery: string[] = [];
  if (product?.product_images?.length) {
    currentGallery = product.product_images.map(img => img.image_url);
  }

  return (
      <Sheet open={!!quickViewProductId} onOpenChange={(open) => !open && setQuickViewProductId(null)}>
        <SheetContent side="right" className="!w-full !max-w-[100vw] md:!w-[95vw] lg:!w-[1200px] p-0 border-l border-black/5 bg-white/50 backdrop-blur-2xl shadow-2xl" showCloseButton={false}>
          {loading || !product ? (
            <div className="h-full w-full flex items-center justify-center bg-white/80 backdrop-blur-xl">
              <Loader2 className="w-8 h-8 animate-spin text-black/20" />
            </div>
          ) : (
            <div className="h-[100dvh] w-full flex flex-col md:flex-row bg-white relative overflow-y-auto md:overflow-hidden">
              {!isDesktop && (
                <button type="button" onClick={() => setQuickViewProductId(null)} className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full text-black shadow-sm hover:bg-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
              
              {/* Immersive Image Gallery */}
              <div className="w-full md:w-[55%] h-[60vh] md:h-full bg-[#F5F5F7] relative flex-shrink-0 group overflow-hidden">
                <AnimatePresence initial={false} custom={activeImageIndex}>
                  {currentGallery.length > 0 ? (
                    <motion.img 
                      key={activeImageIndex}
                      src={currentGallery[activeImageIndex]} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      onError={(e) => { 
                        e.currentTarget.style.display = 'none';
                        const span = document.createElement('span');
                        span.className = 'text-sm font-medium text-black/40 absolute inset-0 flex items-center justify-center';
                        span.innerText = "Rasm yuklanmadi";
                        e.currentTarget.parentElement?.appendChild(span);
                      }}
                      alt={`${product.title} ko'rinish ${activeImageIndex + 1}`} 
                      className="absolute inset-0 w-full h-full object-cover md:object-contain bg-transparent" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium text-black/40">Rasm yo'q</span>
                    </div>
                  )}
                </AnimatePresence>

                {/* Gallery Navigation Controls (Desktop) */}
                {isDesktop && currentGallery.length > 1 && (
                  <>
                    <button 
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : currentGallery.length - 1))}
                      className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-3 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev < currentGallery.length - 1 ? prev + 1 : 0))}
                      className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-3 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {currentGallery.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                    {currentGallery.map((_, i) => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={() => setActiveImageIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${activeImageIndex === i ? 'w-6 bg-black' : 'w-1.5 bg-black/20 hover:bg-black/40'}`} 
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Luxury Product Details */}
              <div className="w-full md:w-[45%] md:h-full flex flex-col flex-shrink-0 bg-white relative">
                <div className="flex-1 md:overflow-y-auto px-6 md:px-12 pt-8 pb-32 md:pb-40 hidden-scrollbar">
                  {isDesktop && (
                    <div className="flex justify-end mb-8">
                      <button type="button" onClick={() => setQuickViewProductId(null)} className="p-2 text-black/40 hover:text-black transition-colors rounded-full hover:bg-black/5">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                  
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="flex flex-col mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868B] mb-2">ETOMODA EXCLUSIVE</span>
                      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1D1D1F] leading-[1.1]">{product.title}</h2>
                    </div>
                    
                    <div className="flex items-end gap-3 mt-4 mb-8">
                      {showDiscount ? (
                        <>
                          <span className="text-3xl font-semibold text-[#1D1D1F]">{format(product.discount_price!)}</span>
                          <span className="text-lg font-medium text-[#86868B] line-through decoration-[#86868B]/60 decoration-1 mb-1">{format(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-3xl font-semibold text-[#1D1D1F]">{format(product.price)}</span>
                      )}
                    </div>

                    {showDiscount && timeLeft && !timeLeft.expired && timeLeft.hours <= 24 && (
                      <div className="mb-8 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-2xl border border-red-100">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">Shoshiling, chegirma tugashiga {timeLeft.hours} soat {timeLeft.minutes} daqiqa qoldi</span>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-10">
                    {/* Colors */}
                    {product.product_colors && product.product_colors.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] font-medium text-[#1D1D1F]">Rang: <span className="text-[#86868B]">{selectedColor}</span></span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {product.product_colors.map(color => (
                            <button
                              key={color.id || color.color_name}
                              type="button"
                              onClick={() => {
                                setSelectedColor(color.color_name);
                                if (color.image_url) {
                                  const matchIndex = currentGallery.findIndex(img => img === color.image_url || img.includes(color.image_url!));
                                  if (matchIndex !== -1) setActiveImageIndex(matchIndex);
                                }
                              }}
                              className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all ${selectedColor === color.color_name ? 'ring-2 ring-offset-2 ring-[#1D1D1F]' : 'ring-1 ring-black/10 hover:ring-black/30'}`}
                            >
                              <div className="w-9 h-9 rounded-full shadow-inner" style={{ backgroundColor: color.color_hex || '#000' }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sizes */}
                    {product.product_sizes && product.product_sizes.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] font-medium text-[#1D1D1F]">O'lcham: <span className="text-[#86868B]">{selectedSize}</span></span>
                          <button type="button" className="text-[13px] text-[#86868B] underline underline-offset-4 hover:text-[#1D1D1F] transition-colors">O'lchamlar jadvali</button>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                          {product.product_sizes.map(size => (
                            <button
                              key={size.id || size.size}
                              type="button"
                              onClick={() => setSelectedSize(size.size)}
                              className={`py-3.5 rounded-2xl text-[14px] font-medium border transition-all duration-300 ${
                                selectedSize === size.size 
                                ? 'border-transparent bg-[#1D1D1F] text-white shadow-md scale-[1.02]' 
                                : 'border-black/10 text-[#1D1D1F] hover:border-black/30 bg-white'
                              }`}
                            >
                              {size.size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="pt-6 border-t border-black/5">
                      <p className="text-[15px] leading-relaxed text-[#515154]">
                        {product.description}
                      </p>
                    </div>

                    {/* Delivery & Return Details */}
                    <div className="space-y-4 pt-6 border-t border-black/5">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center flex-shrink-0">
                          <Truck className="w-5 h-5 text-[#1D1D1F]" />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-semibold text-[#1D1D1F]">Bepul yetkazib berish</h4>
                          <p className="text-[13px] text-[#86868B] mt-1">O'zbekiston bo'ylab 1-3 kunda</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center flex-shrink-0">
                          <RotateCcw className="w-5 h-5 text-[#1D1D1F]" />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-semibold text-[#1D1D1F]">Oson qaytarish</h4>
                          <p className="text-[13px] text-[#86868B] mt-1">Xarid qilingan kundan boshlab 14 kun ichida</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Sticky Bottom Actions */}
                <div className="fixed md:absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-white/90 md:bg-white/80 backdrop-blur-xl border-t border-black/5 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] z-20">
                  <button 
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full bg-[#1D1D1F] text-white py-4 md:py-5 rounded-full text-[15px] font-semibold tracking-wide hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-black/20"
                  >
                    Savatchaga qo'shish — {format(showDiscount ? product.discount_price! : product.price)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
}
