import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const url = 'https://carjsxgacdgqoubdslah.supabase.co/rest/v1/products?select=*';
  const res = await fetch(url, {
    headers: {
      'apikey': 'sb_publishable_4Spmn0ePJGmGJHB6WC8vEg_wq4iA2_Z',
      'Authorization': 'Bearer sb_publishable_4Spmn0ePJGmGJHB6WC8vEg_wq4iA2_Z'
    }
  });
  console.log(res.status, await res.text());
}
check();
