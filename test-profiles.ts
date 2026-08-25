import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

async function run() {
  let supabaseUrl = process.env.SUPABASE_URL || '';
  if (supabaseUrl.endsWith('/rest/v1/')) {
    supabaseUrl = supabaseUrl.replace('/rest/v1/', '');
  }
  const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase.from('profiles').select('*');
  console.log(data, error);
}
run();
