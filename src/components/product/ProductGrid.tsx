import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { useSearchParams } from 'react-router';

export function ProductGrid({ 
  category, 
  gender = 'all', 
  sortBy = 'newest' 
}: { 
  category?: string;
  gender?: string;
  sortBy?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');

  useEffect(() => {
    async function fetchProducts() {
      let query = supabase.from('products').select(`
        *,
        product_images(*),
        product_colors(*),
        categories!inner(id, slug)
      `);
      
      if (category && category !== 'new' && category !== 'all') {
        query = query.eq('categories.slug', category);
      }
      
      if (gender !== 'all') {
        // Since gender is saved in 'category' column (we repurposed it)
        // If they pick 'men', show 'men' and 'unisex'. If 'women', 'women' and 'unisex'
        if (gender === 'men') {
          query = query.in('category', ['men', 'unisex']);
        } else if (gender === 'women') {
          query = query.in('category', ['women', 'unisex']);
        }
      }
      
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price_desc') {
        query = query.order('price', { ascending: false });
      }

      if (category === 'new') {
        query = query.limit(20);
      } else if (!category && !q && isHomeView) {
        query = query.limit(8);
      }
      
      const { data, error } = await query;
      if (data) {
        console.log('Loading products...');
        let finalProducts = data as Product[];
        console.log('Received images for first product:', finalProducts[0]?.product_images);
        
        // Client-side fuzzy search to handle typos like 'ftbolka' -> 'futbolka'
        if (q) {
          const searchTerm = q.toLowerCase().trim();
          finalProducts = finalProducts.filter(p => {
            const title = p.title.toLowerCase();
            if (title.includes(searchTerm)) return true;
            
            // Simple Levenshtein distance for fuzzy matching
            const track = Array(searchTerm.length + 1).fill(null).map(() => Array(title.length + 1).fill(null));
            for (let i = 0; i <= searchTerm.length; i += 1) track[i][0] = i;
            for (let j = 0; j <= title.length; j += 1) track[0][j] = j;
            for (let i = 1; i <= searchTerm.length; i += 1) {
              for (let j = 1; j <= title.length; j += 1) {
                const indicator = searchTerm[i - 1] === title[j - 1] ? 0 : 1;
                track[i][j] = Math.min(
                  track[i - 1][j] + 1,
                  track[i][j - 1] + 1,
                  track[i - 1][j - 1] + indicator
                );
              }
            }
            const distance = track[searchTerm.length][title.length];
            // Allow up to 2 typos for every 5 characters
            const maxTypos = Math.max(1, Math.floor(searchTerm.length / 3));
            return distance <= maxTypos;
          });
        }
        
        setProducts(finalProducts);
      }
      setLoading(false);
    }
    
    // Quick check if we are on home view without any filters
    const isHomeView = !category && !q;
    fetchProducts();
  }, [category, q, gender, sortBy]);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 animate-pulse">
      {[1,2,3,4].map(n => <div key={n} className="aspect-[4/5] bg-gray-100 rounded-3xl"></div>)}
    </div>
  );

  if (products.length === 0) return (
    <div className="py-20 text-center">
      <p className="text-gray-500">Mahsulotlar topilmadi.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
