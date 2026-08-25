import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useAppStore } from '../../store/appStore';
import { Eye, Heart, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCurrency } from '../../hooks/useCurrency';
import { useCountdown } from '../../hooks/useCountdown';

export function ProductCard({ product, index }: { product: Product; index: number; key?: React.Key }) {
  const setQuickViewProductId = useAppStore(state => state.setQuickViewProductId);
  const { format } = useCurrency();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const mainImage = product.product_images?.[0]?.image_url;
  const hoverImage = product.product_images?.[1]?.image_url;

  const discountEndDate = product.color_images?.discount_end_date;
  const timeLeft = useCountdown(discountEndDate);
  const showDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setQuickViewProductId(product.id)}
    >
      <div className="relative aspect-[3/4] bg-[#F5F5F7] rounded-3xl overflow-hidden mb-5 border border-black/5 group-hover:shadow-xl transition-all duration-500">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-[#1D1D1F] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.2em] rounded-full shadow-sm">
              Yangi kelgan
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-white/80 backdrop-blur-md text-[#1D1D1F] border border-black/10 text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.2em] rounded-full shadow-sm">
              Sotilgan
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white border border-black/5"
        >
          <Heart className={cn("w-4 h-4 transition-colors", isFavorite ? "fill-[#1D1D1F] text-[#1D1D1F]" : "text-[#1D1D1F]")} />
        </button>

        <div className="w-full h-full bg-[#F5F5F7] flex items-center justify-center relative">
          {!mainImage ? (
            <span className="text-xs font-medium text-black/40">Rasm yo'q</span>
          ) : (
            <img
              src={mainImage}
              alt={product.title}
              onLoad={() => console.log('Rendering image successfully:', mainImage)}
              onError={(e) => { 
                console.error('Image failed to load:', mainImage);
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                const span = document.createElement('span');
                span.className = 'text-xs font-medium text-black/40';
                span.innerText = "Rasm yo'q";
                e.currentTarget.parentElement?.appendChild(span);
              }}
              className={cn(
                "w-full h-full object-cover transition-transform duration-700 ease-out absolute inset-0",
                isHovered ? "scale-105" : "scale-100"
              )}
            />
          )}
          {/* Hover Image */}
          {hoverImage && (
            <img
              src={hoverImage}
              alt={`${product.title} alternate view`}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </div>

        {/* Quick View Button (Desktop) */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProductId(product.id);
            }}
            className="w-full bg-white/90 backdrop-blur-md text-[#1D1D1F] h-12 rounded-2xl text-[13px] font-medium flex items-center justify-center gap-2 shadow-sm hover:bg-white transition-colors border border-black/5"
          >
            <Eye className="w-4 h-4" /> Tezkor ko'rish
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[15px] font-semibold text-[#1D1D1F] tracking-tight leading-tight">{product.title}</h3>
          <div className="flex flex-col items-end">
            {showDiscount ? (
              <>
                <span className="text-[16px] font-bold text-[#1D1D1F]">{format(product.discount_price!)}</span>
                <span className="text-[13px] font-medium text-[#86868B] line-through decoration-[#86868B]/60 decoration-1">{format(product.price)}</span>
              </>
            ) : (
              <span className="text-[15px] font-light text-[#86868B]">{format(product.price)}</span>
            )}
          </div>
        </div>

        {showDiscount && timeLeft && !timeLeft.expired && timeLeft.hours <= 24 && (
          <div className="mt-2 flex items-center gap-1.5 text-red-500 text-xs font-semibold bg-red-50/50 p-1.5 rounded-lg border border-red-100/50 w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span>Shoshiling, {timeLeft.hours} soat {timeLeft.minutes} daqiqa qoldi</span>
          </div>
        )}

        <div className="flex gap-1.5 mt-3">
          {product.product_colors?.map((color, i) => (
            <div key={i} className="w-4 h-4 rounded-full ring-1 ring-black/10 ring-offset-1" style={{ backgroundColor: color.color_hex || '#000' }} title={color.color_name} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
