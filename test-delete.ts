import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://carjsxgacdgqoubdslah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcmpzeGdhY2RncW91YmRzbGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NTA1MzEsImV4cCI6MjA5ODMyNjUzMX0.D2UaLpGnuh_LJHeaeFREQQN0t6Y30pHPcp1neCCEeZI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: products } = await supabase.from('products').select('id').limit(1);
  if (!products || products.length === 0) {
    console.log('No products to delete');
    return;
  }
  const productId = products[0].id;
  console.log('Attempting to delete product:', productId);
  
  const p1 = await supabase.from('product_images').delete().eq('product_id', productId);
  console.log('product_images delete:', p1.error);
  
  const p2 = await supabase.from('product_colors').delete().eq('product_id', productId);
  console.log('product_colors delete:', p2.error);
  
  const p3 = await supabase.from('product_sizes').delete().eq('product_id', productId);
  console.log('product_sizes delete:', p3.error);
  
  const p4 = await supabase.from('order_items').delete().eq('product_id', productId);
  console.log('order_items delete:', p4.error);
  
  const p5 = await supabase.from('products').delete().eq('id', productId);
  console.log('products delete:', p5.error);
}
run();
