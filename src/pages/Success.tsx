import { Link } from 'react-router';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Success() {
  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center px-4 bg-[#F5F5F7]">
      <div className="max-w-md w-full text-center space-y-6">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 bg-white shadow-2xl shadow-black/5 rounded-full flex items-center justify-center border border-black/5">
            <CheckCircle2 className="w-10 h-10 text-[#007AFF]" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-semibold tracking-tight mb-4 text-[#1D1D1F]">Buyurtma tasdiqlandi</h1>
          <p className="text-[#86868B] text-lg mb-10 leading-relaxed">
            Xaridingiz uchun tashakkur. Biz sizning buyurtmangizni qabul qildik va tez orada uni qayta ishlashni boshlaymiz.
          </p>
          
          <div className="bg-white shadow-2xl shadow-black/5 border border-black/5 rounded-3xl p-8 mb-10 text-center">
            <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[#1D1D1F] mb-4">Keyin nima bo'ladi?</h2>
            <p className="text-[16px] font-medium text-[#1D1D1F]">
              Sizga o'zimiz aloqaga chiqamiz.
            </p>
          </div>
          
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 bg-[#1D1D1F] text-white py-5 rounded-2xl font-medium w-full hover:bg-black transition-all active:scale-[0.98]"
          >
            Xaridni davom ettirish <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
