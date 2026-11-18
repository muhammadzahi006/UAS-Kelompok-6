const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2 && !line.startsWith('#')) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    envVars[key] = val;
  }
});

const { createClient } = require('@supabase/supabase-js');
const s = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data, error } = await s.auth.admin.listUsers();
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Total Supabase Auth Users:', data.users.length);
  data.users.forEach(u => {
    console.log(`- ${u.email} | Role: ${u.user_metadata?.role} | Confirmed: ${!!u.email_confirmed_at}`);
  });
}

main();
