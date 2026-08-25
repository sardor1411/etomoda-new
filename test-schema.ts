import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://carjsxgacdgqoubdslah.supabase.co';
const supabaseKey = 'sb_secret_C2VSEQzlLMS9bMpxy6iJGQ_97HckKMb';

async function test() {
  const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`;
  const res = await fetch(url);
  const swagger = await res.json();
  const productsDefinition = swagger.definitions?.products;
  console.log('Products columns:', Object.keys(productsDefinition?.properties || {}));
}
test();
