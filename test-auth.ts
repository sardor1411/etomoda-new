import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://carjsxgacdgqoubdslah.supabase.co';
const supabaseKey = 'sb_secret_C2VSEQzlLMS9bMpxy6iJGQ_97HckKMb';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const adminUser = (users as any[])?.find(u => u.email === 'admin@gmail.com');
  
  if (adminUser) {
      const { error: pError } = await supabase.from('profiles').insert([
          { id: adminUser.id, full_name: 'Admin', role: 'admin' }
      ]);
      console.log('Admin profile created:', pError || 'success');
  }
}
test();
