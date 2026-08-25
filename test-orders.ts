import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://carjsxgacdgqoubdslah.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcmpzeGdhY2RncW91YmRzbGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NTA1MzEsImV4cCI6MjA5ODMyNjUzMX0.D2UaLpGnuh_LJHeaeFREQQN0t6Y30pHPcp1neCCEeZI'
);

async function run() {
  const { data } = await supabase.from('orders').select('*').limit(1);
  console.log(data);
}
run();
