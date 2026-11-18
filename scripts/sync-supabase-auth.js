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
const { PrismaClient } = require('@prisma/client');

const s = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);
const prisma = new PrismaClient();

const accounts = [
  { email: 'admin@eduvibe.id', password: 'admin123', role: 'ADMIN', name: 'Super Administrator' },
  { email: 'pengajar@eduvibe.id', password: 'pengajar123', role: 'PENGAJAR', name: 'Drs. Bambang Sudiro, M.Pd' },
  { email: 'pengajar2@eduvibe.id', password: 'pengajar123', role: 'PENGAJAR', name: 'Nurul Aini, M.Mat' },
  { email: 'murid@eduvibe.id', password: 'murid123', role: 'MURID', name: 'Budi Santoso' },
  { email: 'murid2@eduvibe.id', password: 'murid123', role: 'MURID', name: 'Dewi Anggraini' },
  { email: 'murid3@eduvibe.id', password: 'murid123', role: 'MURID', name: 'Reza Fahlevi' },
  { email: 'murid4@eduvibe.id', password: 'murid123', role: 'MURID', name: 'Anisa Rahma' },
  { email: 'murid5@eduvibe.id', password: 'murid123', role: 'MURID', name: 'Fajar Nugroho' },
];

async function syncAll() {
  console.log('Menyelaraskan akun Supabase Auth & Prisma User...');
  for (const acc of accounts) {
    // 1. Cek atau buat di Supabase Auth
    const { data: listData } = await s.auth.admin.listUsers();
    let authUser = listData.users.find(u => u.email === acc.email);

    if (!authUser) {
      console.log(`Membuat akun auth: ${acc.email}`);
      const { data: created, error } = await s.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: { full_name: acc.name, role: acc.role },
      });
      if (error) {
        console.error(`Gagal membuat auth ${acc.email}:`, error);
        continue;
      }
      authUser = created.user;
    } else {
      // Pastikan password dan email_confirmed_at aktif
      await s.auth.admin.updateUserById(authUser.id, {
        password: acc.password,
        email_confirm: true,
        user_metadata: { full_name: acc.name, role: acc.role },
      });
    }

    // 2. Hubungkan authUserId di Prisma User
    await prisma.user.updateMany({
      where: { email: acc.email },
      data: { authUserId: authUser.id },
    });
    console.log(`✓ Akun ${acc.email} (${acc.role}) tersinkronisasi sempurna! ID: ${authUser.id}`);
  }

  await prisma.$disconnect();
  console.log('Semua akun Supabase Auth dan Prisma Database siap digunakan untuk login!');
}

syncAll();
