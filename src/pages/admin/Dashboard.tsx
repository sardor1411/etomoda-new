import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../hooks/useCurrency';
import { Loader2, DollarSign, ShoppingBag, Package, Users, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { format } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    pendingOrders: 0,
    products: 0,
    customers: 0
  });

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Orders
        const { data: ordersData } = await supabase.from('orders').select('total, order_status');
        
        let revenue = 0;
        let pendingOrders = 0;
        let ordersCount = 0;

        if (ordersData) {
          ordersCount = ordersData.length;
          ordersData.forEach(order => {
            if (order.order_status === 'Completed') {
              revenue += (order.total || 0);
            }
            if (order.order_status === 'Pending') {
              pendingOrders++;
            }
          });
        }

        // Products
        const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

        // Customers (from profiles where role isn't necessarily admin, or just count profiles)
        const { count: customersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

        setStats({
          revenue,
          orders: ordersCount,
          pendingOrders,
          products: productsCount || 0,
          customers: customersCount || 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/20" />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, trend, subtitle, delay = 0 }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-2xl border border-black/5 flex flex-col relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[13px] font-medium text-[#86868B]">{title}</h3>
        <div className="p-2 bg-black/5 rounded-xl text-black/40 group-hover:bg-[#1D1D1F] group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">{value}</p>
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span className={`text-[12px] font-medium flex items-center gap-0.5 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
          )}
          {subtitle && <span className="text-[12px] text-[#86868B]">{subtitle}</span>}
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br from-black/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Umumiy ko'rinish</h1>
        <p className="text-[#86868B] text-sm mt-1">Haqiqiy vaqt rejimida do'kon statistikasi.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Umumiy Daromad" 
          value={format(stats.revenue)} 
          icon={DollarSign} 
          subtitle="Faqat yakunlangan buyurtmalar"
          delay={0.1}
        />
        <StatCard 
          title="Kutilayotgan Buyurtmalar" 
          value={stats.pendingOrders} 
          icon={Clock} 
          subtitle={`Jami buyurtmalar: ${stats.orders}`}
          delay={0.2}
        />
        <StatCard 
          title="Mahsulotlar" 
          value={stats.products} 
          icon={Package} 
          subtitle="Faol va nofaol mahsulotlar"
          delay={0.3}
        />
        <StatCard 
          title="Mijozlar" 
          value={stats.customers} 
          icon={Users} 
          subtitle="Ro'yxatdan o'tgan foydalanuvchilar"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-black/5 p-6 h-96 flex flex-col justify-center items-center text-center"
        >
          <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-4 text-black/20">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1">Daromad Grafigi</h3>
          <p className="text-[13px] text-[#86868B] max-w-sm">Grafiklarni ko'rsatish uchun Recharts kutubxonasi o'rnatilishi va yetarli ma'lumotlar to'planishi kerak.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl border border-black/5 p-6"
        >
          <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-6">So'nggi faollik</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <div>
                <p className="text-[13px] font-medium text-[#1D1D1F]">Yangi buyurtma qabul qilindi</p>
                <p className="text-[12px] text-[#86868B] mt-0.5">2 daqiqa oldin</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
              <div>
                <p className="text-[13px] font-medium text-[#1D1D1F]">Mahsulot yangilandi: Oq futbolka</p>
                <p className="text-[12px] text-[#86868B] mt-0.5">1 soat oldin</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
              <div>
                <p className="text-[13px] font-medium text-[#1D1D1F]">Yangi mijoz ro'yxatdan o'tdi</p>
                <p className="text-[12px] text-[#86868B] mt-0.5">3 soat oldin</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
