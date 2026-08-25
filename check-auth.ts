import dotenv from 'dotenv';
dotenv.config();

async function checkAuth() {
  const url = 'https://carjsxgacdgqoubdslah.supabase.co/auth/v1/signup';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': 'sb_publishable_4Spmn0ePJGmGJHB6WC8vEg_wq4iA2_Z',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: 'test@example.com', password: 'password123'})
  });
  console.log(res.status, await res.text());
}
checkAuth();
