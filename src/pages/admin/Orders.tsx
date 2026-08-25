import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useCurrency } from '../../hooks/useCurrency';
import { ChevronDown, ChevronUp, Clock, CheckCircle2, User, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { format } = useCurrency();

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (*),
          order_items (
            *,
            products (title)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ order_status: newStatus }).eq('id', id);
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, order_status: newStatus } : o));
    }
  };

  const newOrders = orders.filter(o => o.order_status === 'Pending');
  const oldOrders = orders.filter(o => o.order_status !== 'Pending');

  const OrderCard = ({ order, isOld }: { order: any; isOld?: boolean; key?: any }) => {
    const isExpanded = expandedId === order.id;
    const date = new Date(order.created_at).toLocaleString('uz-UZ');

    return (
      <div className={`bg-white rounded-2xl shadow-sm border ${isOld ? 'border-gray-100 opacity-80' : 'border-black/10'} overflow-hidden transition-all duration-300`}>
        <div 
          className={`p-6 cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-gray-50/50 ${isOld ? 'bg-gray-50' : ''}`}
          onClick={() => setExpandedId(isExpanded ? null : order.id)}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isOld ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
              {isOld ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{order.order_number || order.id.slice(0,8).toUpperCase()}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isOld ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.order_status === 'Pending' ? 'Yangi' : 'Bajarildi'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{date} • {order.order_items?.length || 0} ta mahsulot</p>
            </div>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-0.5">Jami summa</p>
              <p className="font-semibold text-lg">{format(order.total)}</p>
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
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Details */}
                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-900 uppercase tracking-widest text-xs">Mijoz ma'lumotlari</h4>
                  {order.customers ? (
                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{order.customers.first_name} {order.customers.last_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{order.customers.phone}</span>
                      </div>
                      {order.customers.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="w-4 text-center text-gray-400">@</span>
                          <span className="text-gray-600">{order.customers.email}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 leading-relaxed">
                          {order.customers.address}, {order.customers.city}, {order.customers.country} {order.customers.postal_code}
                        </span>
                      </div>
                      {order.customers.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Izoh</p>
                          <p className="text-sm text-gray-700 italic">{order.customers.notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Mijoz ma'lumotlari topilmadi.</p>
                  )}

                  {!isOld && (
                    <div className="pt-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'Completed'); }}
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Buyurtmani bajarildi deb belgilash
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-900 uppercase tracking-widest text-xs">Buyurtma tarkibi</h4>
                  <div className="space-y-3">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div>
                          <p className="font-medium text-sm text-gray-900 mb-1">{item.products?.title || 'Mahsulot'}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {item.color && <span>Rang: {item.color}</span>}
                            {item.color && item.size && <span>•</span>}
                            {item.size && <span>O'lcham: {item.size}</span>}
                            <span>•</span>
                            <span>{item.quantity} dona</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{format(item.total_price)}</p>
                          <p className="text-xs text-gray-500">{format(item.unit_price)} / dona</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
          <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Buyurtmalar</h1>
          <p className="text-gray-500 mt-1">Barcha buyurtmalarni boshqarish</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 font-medium">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* New Orders */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Yangi buyurtmalar 
              <span className="bg-black text-white text-xs px-2.5 py-0.5 rounded-full">{newOrders.length}</span>
            </h2>
            {newOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300">
                <p className="text-gray-500">Hozircha yangi buyurtmalar yo'q.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {newOrders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            )}
          </section>

          {/* Old Orders */}
          <section className="space-y-4 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-500 flex items-center gap-2">
              Bajarilgan buyurtmalar
              <span className="bg-gray-200 text-gray-600 text-xs px-2.5 py-0.5 rounded-full">{oldOrders.length}</span>
            </h2>
            {oldOrders.length > 0 && (
              <div className="space-y-4">
                {oldOrders.map(order => <OrderCard key={order.id} order={order} isOld={true} />)}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
