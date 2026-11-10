# 🎓 CourseraID - Platform Online Course Full-Stack

Aplikasi web online course modern mirip **Coursera** yang dibangun dengan **Next.js 14 (App Router)**, database **PostgreSQL di Supabase**, penyimpanan video & aset di **Cloudflare R2**, serta dioptimalkan untuk deployment ke **Vercel**.

---

## 🌟 Fitur Utama Berdasarkan 3 Peran (Multi-Role)

### 1. 👑 Administrator (Admin)
- **Dashboard Metrik Platform**: Memantau total pengguna (guru & murid), total kursus (draf & terbit), total pendaftaran siswa, dan sertifikat yang telah diterbitkan.
- **Manajemen Pengguna**: Melihat seluruh daftar user dan mengubah role pengguna secara instan (`ADMIN`, `PENGAJAR`, `MURID`).
- **Moderasi Kursus**: Meninjau semua kursus dari seluruh pengajar, menyetujui penerbitan (*publish/unpublish*), atau menghapus kursus.
- **Manajemen Kategori**: Menambah dan mengelola kategori kursus (Web Dev, Data Science, UI/UX, dll).

### 2. 🎓 Pengajar (Instructor)
- **Studio Pengajar Dashboard**: Statistik kursus yang dibuat, jumlah murid terdaftar, dan estimasi akumulasi pendapatan.
- **Course Creation Wizard**: Menentukan judul, subjudul, harga (atau gratis), tingkat kesulitan (*Beginner/Intermediate/Advanced*), target pembelajaran, dan unggah sampul (*thumbnail*).
- **Curriculum & Module Builder**: 
  - Membuat modul/bagian (*sections*).
  - Menambahkan video pelajaran (*lessons*) dengan durasi, deskripsi, lampiran source code/materi, dan toggle pratinjau gratis (*free preview*).
  - Integrasi upload langsung ke **Cloudflare R2**.
  - Toggle publikasi kursus (*Draft* vs *Published*).

### 3. 🎒 Murid (Student)
- **Katalog Kursus**: Pencarian langsung (*real-time search*), filter kategori, tingkat kesulitan, dan harga (Gratis vs Berbayar).
- **Detail Kursus (Coursera Style)**: Pratinjau silabus lengkap, biografi instruktur, ulasan & rating bintang siswa, serta tombol pendaftaran (*enrollment*).
- **Pembelajaran Saya (Student Dashboard)**: Memantau progres belajar kursus aktif dalam persentase progres bar.
- **Learning Player Imersif**:
  - Video player materi resolusi tinggi dari Cloudflare R2.
  - Sidebar silabus interaktif dengan checklist otomatis status penyelesaian modul.
  - Tombol *"Tandai Selesai & Lanjut"* yang otomatis menyimpan progres ke database PostgreSQL.
  - Pelacakan progres otomatis hingga mencapai 100%.
- **Sertifikat Kelulusan Resmi Digital**:
  - Otomatis diterbitkan saat kursus selesai 100%.
  - Dilengkapi kode verifikasi unik, stempel emas digital, tanda tangan instruktur, dan tombol cetak/PDF.

---

## ⚡ Akun Demo Bawaan (Quick Login)

Saat berada di halaman `/login`, tersedia tombol jalan pintas satu klik untuk mengisi akun demo:

| Peran (Role) | Email | Password | Hak Akses |
|---|---|---|---|
| 👑 **ADMIN** | `admin@coursera-clone.com` | `admin123` | Akses penuh: Panel Admin, Moderasi Kursus, Manajemen Pengguna |
| 🎓 **PENGAJAR** | `pengajar@coursera-clone.com` | `pengajar123` | Studio Pengajar, Buat Kursus, Kelola Modul & Video R2 |
| 🎒 **MURID** | `murid@coursera-clone.com` | `murid123` | Jelajah Kursus, Enrollment, Belajar Video di Player, Sertifikat |

---

## 🛠️ Tech Stack & Arsitektur Cloud

- **Framework Web**: [Next.js 14](https://nextjs.org/) (App Router, Server Components, Server Actions, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide React Icons](https://lucide.dev/)
- **Database & ORM**: PostgreSQL via [Supabase](https://supabase.com/) & [Prisma ORM](https://www.prisma.io/)
- **Autentikasi**: [NextAuth.js](https://next-auth.js.org/) (Role-based JWT session, Bcrypt password hashing)
- **Penyimpanan Berkas/Aset**: [Cloudflare R2](https://www.cloudflare.com/products/r2/) (S3-compatible, Zero Egress Fees)
- **Deployment Platform**: [Vercel](https://vercel.com/)

---

## 🚀 Panduan Menjalankan di Lokal (Local Development)

### 1. Salin Environment Variables
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

### 2. Atur Koneksi Supabase PostgreSQL
Buka `.env` dan masukkan connection string database Supabase Anda:
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="coursera_secret_key_change_me_in_production_jwt_token_2026"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Migrasi & Seed Database
Jalankan sinkronisasi schema Prisma ke PostgreSQL dan masukkan data awal:
```bash
# Push schema tabel ke Supabase
npx prisma db push

# Masukkan data akun demo (Admin, Pengajar, Murid) & kursus contoh
npm run seed
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## ☁️ Panduan Deployment Lengkap

### Langkah 1: Setup Database di Supabase
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat project baru.
2. Buka menu **Project Settings** -> **Database**.
3. Di bagian **Connection String**:
   - Pilih tab **URI**.
   - Aktifkan mode **Transaction (Port 6543)** -> Gunakan ini sebagai `DATABASE_URL`.
   - Pilih mode **Session (Port 5432)** -> Gunakan ini sebagai `DIRECT_URL`.
4. Jalankan `npx prisma db push` dari terminal lokal untuk membuat semua tabel otomatis.

### Langkah 2: Setup Storage di Cloudflare R2
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) -> Masuk ke menu **R2**.
2. Buat bucket baru bernama `coursera-assets` (atau nama pilihan Anda).
3. Di tab **Settings** bucket, aktifkan **Public Access** (Public Development R2.dev URL atau Hubungkan Custom Domain).
4. Di menu utama R2, klik **Manage R2 API Tokens** -> **Create API Token**:
   - Berikan izin: `Object Read & Write`.
   - Salin `Access Key ID`, `Secret Access Key`, dan `Account ID`.
5. Masukkan ke `.env` atau Vercel Environment Variables:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_DOMAIN`

### Langkah 3: Deploy ke Vercel
1. Push repository ini ke GitHub/GitLab.
2. Buka [Vercel Dashboard](https://vercel.com/) dan klik **Add New** -> **Project**.
3. Import repository project ini.
4. Di bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL` = Connection string Supabase (Port 6543)
   - `DIRECT_URL` = Connection string Supabase (Port 5432)
   - `NEXTAUTH_SECRET` = String acak 32 karakter
   - `NEXTAUTH_URL` = `https://[nama-project-anda].vercel.app`
   - `R2_ACCOUNT_ID` = Cloudflare Account ID
   - `R2_ACCESS_KEY_ID` = Cloudflare R2 Access Key
   - `R2_SECRET_ACCESS_KEY` = Cloudflare R2 Secret Key
   - `R2_BUCKET_NAME` = Nama bucket R2
   - `R2_PUBLIC_DOMAIN` = Domain publik bucket R2
5. Klik **Deploy**! Vercel akan otomatis menjalankan `prisma generate` dan `next build`.
