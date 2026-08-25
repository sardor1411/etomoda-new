import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://carjsxgacdgqoubdslah.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || 'sb_secret_C2VSEQzlLMS9bMpxy6iJGQ_97HckKMb';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1);
  console.log('Profiles table:', pError || 'exists');
  
  // also try to create the admin user if they don't exist
  const { data: { users }, error: uError } = await supabase.auth.admin.listUsers();
  if (uError) {
    console.error('List users error:', uError);
  } else {
    const adminUser = (users as any[]).find(u => u.email === 'admin@gmail.com');
    if (!adminUser) {
      console.log('Creating admin user...');
      const { data: newUser, error: cError } = await supabase.auth.admin.createUser({
        email: 'admin@gmail.com',
        password: 'admin123',
        email_confirm: true
      });
      console.log('Create admin user:', cError || 'success');
      
      if (newUser.user) {
        // also create profile
        await supabase.from('profiles').insert([{ id: newUser.user.id, name: 'Admin', role: 'admin' }]);
      }
    } else {
      console.log('Admin user already exists');
      // check their profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', adminUser.id).single();
      if (!profile) {
          console.log('Creating profile for admin...');
          const {error: pInsErr} = await supabase.from('profiles').insert([{ id: adminUser.id, name: 'Admin', role: 'admin' }]);
          console.log('Profile created', pInsErr);
      } else if (profile.role !== 'admin') {
          console.log('Updating profile role to admin...');
          await supabase.from('profiles').update({ role: 'admin' }).eq('id', adminUser.id);
      }
    }
  }
}
check();
