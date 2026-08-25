import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router';
import { deleteProduct } from '../../services/products';
import { useCurrency } from '../../hooks/useCurrency';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

export function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { format } = useCurrency();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        product_images(*)
      `)
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?")) {
      try {
        await deleteProduct(id);
        // Remove from local state immediately for fast UI update
        setProducts(prev => prev.filter(p => p.id !== id));
        // Refetch to ensure consistency
        await fetchProducts();
      } catch (error) {
        console.error("Xatolik yuz berdi:", error);
        alert("O'chirishda xatolik yuz berdi.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Mahsulotlar</h1>
        <Link to="/admin/products/add" className="bg-[#1D1D1F] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black">
            Yangi qo'shish
        </Link>
      </div>
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          {products.length === 0 ? <p>Hozircha mahsulotlar yo'q.</p> : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 w-16">Rasm</th>
                            <th className="px-6 py-3">Nomi</th>
                            <th className="px-6 py-3">Narxi</th>
                            <th className="px-6 py-3">Kategoriya</th>
                            <th className="px-6 py-3 text-right">Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="bg-white border-b">
                                <td className="px-6 py-4">
                                  {product.product_images?.[0]?.image_url ? (
                                    <img 
                                      src={product.product_images[0].image_url} 
                                      alt={product.title}
                                      className="w-10 h-10 object-cover rounded"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.classList.add('bg-gray-100');
                                      }}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                      <span className="text-[8px] text-gray-400">Yo'q</span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4">{product.title}</td>
                                <td className="px-6 py-4">{format(product.price)}</td>
                                <td className="px-6 py-4">{product.category?.name || product.category_id}</td>
                                <td className="px-6 py-4 text-right relative">
                                    <button 
                                      onClick={() => setActiveMenu(activeMenu === product.id ? null : product.id)}
                                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                      <MoreVertical className="w-5 h-5 text-gray-500" />
                                    </button>
                                    
                                    {activeMenu === product.id && (
                                      <div ref={menuRef} className="absolute right-8 top-10 bg-white shadow-xl border border-black/5 rounded-xl py-2 w-40 z-10 text-left">
                                        <Link 
                                          to={`/admin/products/edit/${product.id}`} 
                                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 w-full"
                                        >
                                          <Edit className="w-4 h-4" /> Edit
                                        </Link>
                                        <button 
                                          onClick={() => {
                                            handleDelete(product.id);
                                            setActiveMenu(null);
                                          }} 
                                          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm font-medium text-red-600 w-full text-left"
                                        >
                                          <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                      </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
