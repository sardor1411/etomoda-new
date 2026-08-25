import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://carjsxgacdgqoubdslah.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || 'sb_secret_C2VSEQzlLMS9bMpxy6iJGQ_97HckKMb';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@gmail.com',
    password: 'admin123',
    options: {
        data: { full_name: 'Admin User' }
    }
  });
  console.log('Signup result:', data, error);
}
check();
