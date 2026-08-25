import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '../store/cartStore';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Lock, UserPlus } from 'lucide-react';
import { submitOrder, OrderData } from '../lib/api';
import { useCurrency } from '../hooks/useCurrency';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Ism kiritish majburiy'),
  lastName: z.string().min(2, 'Familiya kiritish majburiy'),
  email: z.string().email('Noto\'g\'ri elektron pochta manzili'),
  phone: z.string().min(10, 'To\'g\'ri telefon raqamini kiriting'),
  telegram: z.string().optional(),
  address: z.string().min(5, 'Manzil kiritish majburiy'),
  city: z.string().min(2, 'Shahar kiritish majburiy'),
  country: z.string().min(2, 'Davlat kiritish majburiy'),
  postalCode: z.string().min(3, 'Pochta indeksi majburiy'),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function Checkout() {
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal } = getTotals();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (user) {
      if (user.email) setValue('email', user.email);
      if (user.user_metadata?.first_name) setValue('firstName', user.user_metadata.first_name);
      if (user.user_metadata?.last_name) setValue('lastName', user.user_metadata.last_name);
    }
  }, [user, setValue]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!user) {
        alert("Iltimos, oldin tizimga kiring!");
        return;
    }
    try {
      const orderData: OrderData = {
        orderNumber: `ORD-${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toISOString(),
        customer: data,
        items: items,
        total: total,
      };

      await submitOrder(orderData);
      
      clearCart();
      navigate('/success');
    } catch (error) {
      console.error('Checkout failed:', error);
      // In a real app, show error toast
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto pt-32 pb-24 px-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight mb-4 text-[#1D1D1F]">Savatchangiz bo'sh</h1>
        <p className="text-[#86868B] mb-8">Rasmiylashtirishni davom ettirish uchun savatchaga mahsulot qo'shing.</p>
        <Link to="/" className="inline-flex items-center text-[13px] font-semibold uppercase tracking-widest text-[#1D1D1F] hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4 mr-2" /> Do'konga qaytish
        </Link>
      </div>
    );
  }

  if (authLoading) {
    return <div className="max-w-7xl mx-auto pt-32 pb-24 text-center">Yuklanmoqda...</div>;
  }

  if (!user) {
    return (
        <div className="max-w-3xl mx-auto pt-32 pb-24 px-4 text-center">
            <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-black/5 border border-black/5 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="w-8 h-8 text-[#1D1D1F]" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight mb-4 text-[#1D1D1F]">Tizimga kiring</h1>
                <p className="text-[#515154] mb-8">
                    Xaridni amalga oshirish va buyurtmalaringizni kuzatib borish uchun ro'yxatdan o'tishingiz yoki tizimga kirishingiz kerak.
                </p>
                <div className="space-y-4">
                    <Link to="/login" className="w-full bg-[#1D1D1F] text-white py-4 rounded-2xl font-medium flex items-center justify-center hover:bg-black transition-all active:scale-[0.98]">
                        Tizimga kirish
                    </Link>
                    <Link to="/register" className="w-full bg-white text-[#1D1D1F] border border-black/10 py-4 rounded-2xl font-medium flex items-center justify-center hover:bg-gray-50 transition-all active:scale-[0.98]">
                        Ro'yxatdan o'tish
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
      <Link to="/" className="inline-flex items-center text-[13px] font-semibold uppercase tracking-widest text-[#86868B] hover:text-[#1D1D1F] mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Do'konga qaytish
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Form Column */}
        <div className="lg:col-span-7 xl:col-span-8">
          <h1 className="text-4xl font-semibold tracking-tight mb-8 text-[#1D1D1F]">Rasmiylashtirish</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">Aloqa ma'lumotlari</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Ism</Label>
                  <Input id="firstName" {...register('firstName')} className={`bg-white border-black/10 rounded-xl h-12 ${errors.firstName ? 'border-red-500' : 'focus:border-black'}`} />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Familiya</Label>
                  <Input id="lastName" {...register('lastName')} className={`bg-white border-black/10 rounded-xl h-12 ${errors.lastName ? 'border-red-500' : 'focus:border-black'}`} />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Elektron pochta</Label>
                  <Input id="email" type="email" {...register('email')} className={`bg-white border-black/10 rounded-xl h-12 ${errors.email ? 'border-red-500' : 'focus:border-black'}`} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Telefon raqami</Label>
                  <Input id="phone" {...register('phone')} className={`bg-white border-black/10 rounded-xl h-12 ${errors.phone ? 'border-red-500' : 'focus:border-black'}`} />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Telegram foydalanuvchi nomi (Ixtiyoriy)</Label>
                  <Input id="telegram" placeholder="@username" {...register('telegram')} className="bg-white border-black/10 rounded-xl h-12 focus:border-black" />
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-6 pt-8 border-t border-black/5">
              <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">Yetkazib berish manzili</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Manzil</Label>
                  <Input id="address" {...register('address')} className={`bg-white border-black/10 rounded-xl h-12 ${errors.address ? 'border-red-500' : 'focus:border-black'}`} />
                  {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Shahar</Label>
                  <Input id="city" {...register('city')} className={`bg-white border-black/10 rounded-xl h-12 ${errors.city ? 'border-red-500' : 'focus:border-black'}`} />
                  {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Pochta indeksi</Label>
                  <Input id="postalCode" {...register('postalCode')} className={`bg-white border-black/10 rounded-xl h-12 ${errors.postalCode ? 'border-red-500' : 'focus:border-black'}`} />
                  {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="country" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Davlat</Label>
                  <Input id="country" {...register('country')} className={`bg-white border-black/10 rounded-xl h-12 ${errors.country ? 'border-red-500' : 'focus:border-black'}`} />
                  {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Buyurtma izohlari (Ixtiyoriy)</Label>
                  <Input id="notes" {...register('notes')} className="bg-white border-black/10 rounded-xl h-12 focus:border-black" />
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#1D1D1F] text-white py-5 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Jarayonda...' : `To'lash ${format(total)}`}
              {!isSubmitting && <Lock className="w-4 h-4 ml-2" />}
            </button>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 xl:col-span-4 mt-12 lg:mt-0">
          <div className="bg-white rounded-3xl p-8 sticky top-24 shadow-2xl shadow-black/5 border border-black/5">
            <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F] mb-8">Buyurtma xulosasi</h2>
            
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 mb-8 hidden-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-gradient-to-br from-[#E8E8ED] to-[#D2D2D7] rounded-xl overflow-hidden flex-shrink-0 p-1 relative flex items-center justify-center">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded-lg absolute inset-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const span = document.createElement('span');
                          span.className = 'text-[10px] font-medium text-black/40';
                          span.innerText = "Yo'q";
                          e.currentTarget.parentElement?.appendChild(span);
                        }} 
                      />
                    ) : (
                      <span className="text-[10px] font-medium text-black/40">Yo'q</span>
                    )}
                  </div>
                  <div className="flex-1 py-1">
                    <h3 className="text-[14px] font-semibold text-[#1D1D1F] line-clamp-2">{item.title}</h3>
                    <p className="text-[12px] text-[#86868B] mt-1 uppercase tracking-wider">
                      {item.color} / {item.size} <br />
                      Miqdor: {item.quantity}
                    </p>
                    <p className="text-[14px] font-medium mt-2">{format(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-black/5 pt-8 space-y-4">
              <div className="flex justify-between text-[13px] font-semibold uppercase tracking-widest text-[#1D1D1F]">
                <span>Jami</span>
                <span className="font-light normal-case tracking-normal text-[#86868B] text-base">{format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] font-semibold uppercase tracking-widest text-[#1D1D1F]">
                <span>Yetkazib berish</span>
                <span className="font-medium normal-case tracking-normal text-[#007AFF] text-[13px]">Bepul</span>
              </div>
              <div className="border-t border-black/5 pt-6 flex justify-between items-end">
                <span className="text-[13px] font-semibold uppercase tracking-widest text-[#1D1D1F]">Umumiy summa</span>
                <span className="text-2xl font-light text-[#1D1D1F]">{format(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
