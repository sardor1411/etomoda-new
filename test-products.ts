import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://carjsxgacdgqoubdslah.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcmpzeGdhY2RncW91YmRzbGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NTA1MzEsImV4cCI6MjA5ODMyNjUzMX0.D2UaLpGnuh_LJHeaeFREQQN0t6Y30pHPcp1neCCEeZI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: products } = await supabase.from('products').select(`
    *,
    product_images(*)
  `).limit(2);
  
  console.log(JSON.stringify(products, null, 2));
}
run();
