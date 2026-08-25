import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../hooks/useCurrency';
import { ChevronDown, ChevronUp, User, Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { format } = useCurrency();

  useEffect(() => {
    async function fetchCustomers() {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          orders (
            *,
            order_items (
              *,
              products (title)
            )
          )
        `)
        .order('created_at', { ascending: false });
      if (data) setCustomers(data);
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  const CustomerCard = ({ customer }: { customer: any; key?: any }) => {
    const isExpanded = expandedId === customer.id;
    const date = new Date(customer.created_at).toLocaleDateString('uz-UZ');
    const orderCount = customer.orders?.length || 0;
    const totalSpent = customer.orders?.reduce((acc: number, order: any) => acc + (order.total || 0), 0) || 0;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-black/10 overflow-hidden transition-all duration-300">
        <div 
          className="p-6 cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-gray-50/50"
          onClick={() => setExpandedId(isExpanded ? null : customer.id)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{customer.first_name} {customer.last_name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {customer.email || 'Email yo\'q'}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {customer.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-0.5">{orderCount} ta buyurtma</p>
              <p className="font-semibold text-lg">{format(totalSpent)}</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 bg-gray-50/30"
            >
              <div className="p-6">
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-fit">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{customer.address}, {customer.city}, {customer.country} {customer.postal_code}</p>
                </div>

                <h4 className="font-semibold text-gray-900 uppercase tracking-widest text-xs mb-4">Buyurtmalar tarixi</h4>
                {orderCount === 0 ? (
                  <p className="text-gray-500 text-sm">Hali hech narsa xarid qilmagan.</p>
                ) : (
                  <div className="space-y-4">
                    {customer.orders.sort((a:any,b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((order: any) => (
                      <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
                          <div>
                            <p className="font-medium">{order.order_number || order.id.slice(0,8).toUpperCase()}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleString('uz-UZ')}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.order_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'}`}>
                              {order.order_status === 'Pending' ? 'Yangi' : 'Bajarildi'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                {item.quantity}x {item.products?.title || 'Noma\'lum mahsulot'}
                                {(item.color || item.size) && <span className="text-gray-400 ml-1">({item.color} {item.size})</span>}
                              </span>
                              <span className="font-medium text-gray-900">{format(item.total_price)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                          <span className="text-gray-500">Jami</span>
                          <span className="font-bold text-gray-900 text-base">{format(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Mijozlar</h1>
          <p className="text-gray-500 mt-1">Barcha xaridorlar va ularning tarixi</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 font-medium">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300">
              <p className="text-gray-500">Hozircha mijozlar yo'q.</p>
            </div>
          ) : (
            customers.map(customer => <CustomerCard key={customer.id} customer={customer} />)
          )}
        </div>
      )}
    </div>
  );
}
