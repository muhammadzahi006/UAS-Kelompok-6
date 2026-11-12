const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();

async function main() {
  if (process.env.SEED_ALLOW_DESTRUCTIVE_RESET !== "true") {
    throw new Error("Seed ini menghapus seluruh data bisnis. Set SEED_ALLOW_DESTRUCTIVE_RESET=true hanya setelah menyetujui reset database.");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Seed demo memerlukan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY untuk membuat akun Supabase Auth.");
  }
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const authPreflight = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (authPreflight.error) throw new Error(`Supabase Auth admin preflight failed: ${authPreflight.error.message}`);

  console.log("🌱 Mulai seeding database EduNexus (Kelompok 6)...");

  // 1. Bersihkan data lama
  await prisma.notificationQueue.deleteMany();
  await prisma.quizAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.review.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Data lama berhasil dibersihkan");

  // 2. Hash passwords
  const hashAdmin = await bcrypt.hash("admin123", 10);
  const hashPengajar = await bcrypt.hash("pengajar123", 10);
  const hashMurid = await bcrypt.hash("murid123", 10);

  // 3. Buat 1 Admin
  const admin = await prisma.user.create({
    data: {
      name: "Super Administrator",
      email: "admin@edunexus.id",
      password: hashAdmin,
      role: "ADMIN",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=b6e3f4",
      headline: "Platform Administrator & Operations Lead",
      bio: "Mengelola seluruh ekosistem pembelajaran daring platform EduNexus.",
    },
  });

  // 4. Buat 2 Pengajar
  const pengajar1 = await prisma.user.create({
    data: {
      name: "Dr. Ahmad Hidayat, M.Kom",
      email: "pengajar@edunexus.id",
      password: hashPengajar,
      role: "PENGAJAR",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad&backgroundColor=d1d4f9",
      headline: "Senior Cloud & Software Architect",
      bio: "Praktisi teknologi lebih dari 12 tahun dengan spesialisasi Next.js, Cloud Architectures (AWS/Cloudflare), dan Distributed Systems.",
    },
  });

  const pengajar2 = await prisma.user.create({
    data: {
      name: "Siti Rahmawati, S.Ds",
      email: "pengajar2@edunexus.id",
      password: hashPengajar,
      role: "PENGAJAR",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=siti&backgroundColor=ffd5dc",
      headline: "UI/UX Designer & Product Strategist",
      bio: "Desainer produk digital dengan pengalaman 8 tahun di startup teknologi terkemuka.",
    },
  });

  // 5. Buat 5 Murid
  const murid1 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "murid@edunexus.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
      headline: "Mahasiswa Ilmu Komputer",
      bio: "Aspiring Full-Stack Developer yang gemar belajar teknologi web modern.",
    },
  });

  const murid2 = await prisma.user.create({
    data: {
      name: "Dewi Anggraini",
      email: "murid2@edunexus.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dewi",
      headline: "Fresh Graduate Teknik Informatika",
      bio: "Ingin berkarir di bidang data science dan machine learning.",
    },
  });

  const murid3 = await prisma.user.create({
    data: {
      name: "Reza Fahlevi",
      email: "murid3@edunexus.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
      headline: "Profesional Beralih Karir ke IT",
      bio: "Mantan akuntan yang ingin beralih ke bidang UI/UX Design.",
    },
  });

  const murid4 = await prisma.user.create({
    data: {
      name: "Anisa Rahma",
      email: "murid4@edunexus.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anisa",
      headline: "Pelajar SMA Jurusan IPA",
      bio: "Tertarik mempelajari pemrograman sejak kelas 10 SMA.",
    },
  });

  const murid5 = await prisma.user.create({
    data: {
      name: "Fajar Nugroho",
      email: "murid5@edunexus.id",
      password: hashMurid,
      role: "MURID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fajar",
      headline: "Junior Developer di Startup",
      bio: "Developer junior yang ingin meningkatkan kemampuan cloud dan DevOps.",
    },
  });

  console.log("✅ 1 Admin, 2 Pengajar, 5 Murid berhasil dibuat");

  // 6. Kategori
  const catWeb = await prisma.category.create({
    data: { name: "Web Development", slug: "web-development", description: "Belajar Next.js, React, Node.js, TypeScript.", icon: "Code" },
  });
  const catData = await prisma.category.create({
    data: { name: "Data Science & AI", slug: "data-science-ai", description: "Python, machine learning, generative AI.", icon: "Cpu" },
  });
  const catDesign = await prisma.category.create({
    data: { name: "UI/UX & Desain Produk", slug: "ui-ux-design", description: "Desain antarmuka aplikasi interaktif.", icon: "Palette" },
  });
  const catCloud = await prisma.category.create({
    data: { name: "Cloud & DevOps", slug: "cloud-devops", description: "Deployment, Docker, CI/CD, Vercel, Supabase.", icon: "Cloud" },
  });
  const catMobile = await prisma.category.create({
    data: { name: "Mobile Development", slug: "mobile-development", description: "React Native, Flutter, Android, iOS.", icon: "Smartphone" },
  });

  console.log("✅ 5 Kategori berhasil dibuat");

  // === KURSUS 1: Next.js Full-Stack ===
  const course1 = await prisma.course.create({
    data: {
      title: "Mastering Full-Stack Next.js 14, Supabase & Cloudflare R2",
      slug: "mastering-fullstack-nextjs-supabase-r2",
      subtitle: "Panduan lengkap membangun aplikasi web modern dari nol hingga deploy di Vercel.",
      description: `Kursus komprehensif untuk menguasai ekosistem web modern. Anda akan belajar Next.js App Router, Supabase PostgreSQL via Prisma ORM, storage Cloudflare R2, NextAuth multi-role, dan deployment Vercel.`,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
      price: 249000,
      level: "INTERMEDIATE",
      isPublished: true,
      requirements: "HTML, CSS, JavaScript dasar. Pemahaman React akan sangat membantu.",
      objectives: "Membangun aplikasi full-stack production-ready; Deploy ke Vercel + Supabase; Autentikasi multi-role.",
      instructorId: pengajar1.id,
      categoryId: catWeb.id,
      sections: {
        create: [
          {
            title: "Modul 1: Fondasi Next.js App Router",
            order: 1,
            lessons: {
              create: [
                { title: "1. Pengenalan Next.js 14 & App Router", description: "Overview arsitektur modern Next.js App Router vs Pages Router.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", duration: 480, order: 1, isPreview: true },
                { title: "2. Server Components vs Client Components", description: "Memahami paradigma React Server Components dan 'use client'.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", duration: 720, order: 2, isPreview: false },
                { title: "3. Routing, Layout & Loading States", description: "Nested layouts, error.tsx, loading.tsx, dan not-found.tsx.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", duration: 600, order: 3, isPreview: false },
              ],
            },
          },
          {
            title: "Modul 2: Database Supabase & Prisma ORM",
            order: 2,
            lessons: {
              create: [
                { title: "4. Setup Supabase & Connection Pooling", description: "Konfigurasi Transaction Pooler (port 6543) dan Direct URL.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", duration: 650, order: 1, isPreview: false },
                { title: "5. Schema Prisma & Relasi Database", description: "Menulis schema Prisma dengan relasi 1-to-many dan cascading.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", duration: 890, order: 2, isPreview: false },
              ],
            },
          },
          {
            title: "Modul 3: Autentikasi Multi-Role dengan NextAuth",
            order: 3,
            lessons: {
              create: [
                { title: "6. Setup NextAuth.js dengan Credentials Provider", description: "Konfigurasi JWT session, bcrypt password hashing, dan callback.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4", duration: 780, order: 1, isPreview: false },
                { title: "7. Middleware Role-Based Access Control", description: "Membuat middleware.ts untuk proteksi route berdasarkan role.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", duration: 540, order: 2, isPreview: false },
              ],
            },
          },
        ],
      },
    },
  });

  // === KURSUS 2: UI/UX Figma ===
  const course2 = await prisma.course.create({
    data: {
      title: "UI/UX Design Masterclass: Desain Web & Mobile di Figma",
      slug: "ui-ux-design-masterclass-figma",
      subtitle: "Kuasai riset pengguna, wireframing, design system, hingga prototipe interaktif di Figma.",
      description: `Kursus ini mengajarkan prinsip desain produk digital modern dari nol. Anda akan menguasai Figma, membuat design system yang konsisten, dan menghasilkan prototipe siap handoff ke developer.`,
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80",
      price: 0,
      level: "BEGINNER",
      isPublished: true,
      requirements: "Tidak ada. Hanya butuh laptop dan akun Figma gratis.",
      objectives: "Mendesain UI modern; Figma Components & Auto-layout; Interactive prototype; Design System.",
      instructorId: pengajar2.id,
      categoryId: catDesign.id,
      sections: {
        create: [
          {
            title: "Modul 1: Prinsip Desain & Pengenalan Figma",
            order: 1,
            lessons: {
              create: [
                { title: "1. Prinsip UI/UX & Heuristik Nielsen", description: "10 prinsip usability dan bagaimana menerapkannya.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", duration: 520, order: 1, isPreview: true },
                { title: "2. Tour Figma: Tools, Frame, & Auto-Layout", description: "Mengenal seluruh panel Figma dan shortcut produktivitas.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", duration: 680, order: 2, isPreview: false },
              ],
            },
          },
          {
            title: "Modul 2: Design System & Komponen",
            order: 2,
            lessons: {
              create: [
                { title: "3. Membangun Design System dari Nol", description: "Membuat color palette, typography scale, spacing system.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", duration: 900, order: 1, isPreview: false },
                { title: "4. Figma Components & Variants", description: "Buat komponen reusable dengan properties dan variants.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", duration: 760, order: 2, isPreview: false },
              ],
            },
          },
        ],
      },
    },
  });

  // === KURSUS 3: Python Data Science ===
  const course3 = await prisma.course.create({
    data: {
      title: "Python untuk Data Science & Machine Learning",
      slug: "python-data-science-machine-learning",
      subtitle: "Dari dasar Python hingga membangun model ML dan visualisasi data profesional.",
      description: `Pelajari Python, Pandas, NumPy, Matplotlib, Scikit-learn, dan dasar-dasar deep learning. Kursus ini cocok untuk pemula yang ingin memulai karir di bidang data.`,
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1000&auto=format&fit=crop&q=80",
      price: 199000,
      level: "BEGINNER",
      isPublished: true,
      requirements: "Logika pemrograman dasar. Tidak perlu pengalaman Python sebelumnya.",
      objectives: "Kuasai Python; Analisis data dengan Pandas; Visualisasi dengan Matplotlib; Machine learning dasar.",
      instructorId: pengajar1.id,
      categoryId: catData.id,
      sections: {
        create: [
          {
            title: "Modul 1: Fundamental Python",
            order: 1,
            lessons: {
              create: [
                { title: "1. Instalasi Python & Jupyter Notebook", description: "Setup environment dan mengenal ekosistem data science Python.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", duration: 400, order: 1, isPreview: true },
                { title: "2. Tipe Data, Variabel & Struktur Kontrol", description: "List, dict, tuple, loop, dan conditional di Python.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", duration: 650, order: 2, isPreview: false },
                { title: "3. Fungsi, OOP & Modul Python", description: "Menulis fungsi, kelas, dan mengimpor library pihak ketiga.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", duration: 720, order: 3, isPreview: false },
              ],
            },
          },
          {
            title: "Modul 2: Analisis Data dengan Pandas & NumPy",
            order: 2,
            lessons: {
              create: [
                { title: "4. Pandas DataFrame: Load, Clean & Transform", description: "Membaca CSV, menangani missing values, dan transformasi data.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", duration: 870, order: 1, isPreview: false },
                { title: "5. Visualisasi Data dengan Matplotlib & Seaborn", description: "Membuat grafik, histogram, heatmap, dan scatter plot profesional.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", duration: 790, order: 2, isPreview: false },
              ],
            },
          },
        ],
      },
    },
  });

  // === KURSUS 4: Cloud & DevOps ===
  const course4 = await prisma.course.create({
    data: {
      title: "DevOps Modern: Docker, CI/CD & Deployment ke Cloud",
      slug: "devops-modern-docker-cicd-cloud",
      subtitle: "Kuasai containerisasi Docker, pipeline CI/CD GitHub Actions, dan deploy ke berbagai platform cloud.",
      description: `Kursus praktis DevOps yang mengajarkan containerisasi dengan Docker, orkestrasi dengan Docker Compose, otomasi CI/CD dengan GitHub Actions, dan deployment ke Vercel, Railway, serta Cloudflare Workers.`,
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1000&auto=format&fit=crop&q=80",
      price: 299000,
      level: "INTERMEDIATE",
      isPublished: true,
      requirements: "Pengalaman dasar Linux/terminal dan familiar dengan Git.",
      objectives: "Containerisasi dengan Docker; Setup CI/CD dengan GitHub Actions; Deploy ke cloud modern.",
      instructorId: pengajar1.id,
      categoryId: catCloud.id,
      sections: {
        create: [
          {
            title: "Modul 1: Docker & Containerisasi",
            order: 1,
            lessons: {
              create: [
                { title: "1. Mengapa Docker & Arsitektur Container", description: "Perbedaan VM vs Container dan konsep image, container, registry.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", duration: 560, order: 1, isPreview: true },
                { title: "2. Dockerfile, Build & Publish ke Docker Hub", description: "Menulis Dockerfile optimal dengan multi-stage build.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", duration: 840, order: 2, isPreview: false },
                { title: "3. Docker Compose untuk Multi-Container App", description: "Orkestrasi aplikasi + database + redis dengan Docker Compose.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", duration: 920, order: 3, isPreview: false },
              ],
            },
          },
          {
            title: "Modul 2: CI/CD dengan GitHub Actions",
            order: 2,
            lessons: {
              create: [
                { title: "4. GitHub Actions: Workflow YAML dari Nol", description: "Memahami trigger, jobs, steps, dan environment secrets.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", duration: 710, order: 1, isPreview: false },
                { title: "5. Auto Deploy ke Vercel & Supabase Migration", description: "Pipeline lengkap: test → build → migrate DB → deploy.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", duration: 950, order: 2, isPreview: false },
              ],
            },
          },
        ],
      },
    },
  });

  // === KURSUS 5: React Native Mobile ===
  const course5 = await prisma.course.create({
    data: {
      title: "React Native: Bangun Aplikasi Mobile iOS & Android",
      slug: "react-native-aplikasi-mobile-ios-android",
      subtitle: "Buat aplikasi mobile lintas platform profesional dengan React Native dan Expo.",
      description: `Pelajari React Native dari nol hingga publikasi ke App Store dan Play Store. Mencakup navigasi, state management, integrasi API, kamera, notifikasi push, dan optimasi performa.`,
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1000&auto=format&fit=crop&q=80",
      price: 349000,
      level: "ADVANCED",
      isPublished: true,
      requirements: "Wajib menguasai React.js dan JavaScript ES6+ dengan baik.",
      objectives: "Bangun app mobile iOS & Android; Navigasi React Navigation; Integrasi API & push notification; Publish ke store.",
      instructorId: pengajar2.id,
      categoryId: catMobile.id,
      sections: {
        create: [
          {
            title: "Modul 1: Fundamental React Native & Expo",
            order: 1,
            lessons: {
              create: [
                { title: "1. Setup Expo & Anatomi Proyek React Native", description: "Expo Go, Metro Bundler, dan struktur folder standar.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", duration: 480, order: 1, isPreview: true },
                { title: "2. Core Components: View, Text, Image, ScrollView", description: "Komponen dasar React Native dan StyleSheet API.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", duration: 690, order: 2, isPreview: false },
                { title: "3. Navigasi dengan React Navigation v6", description: "Stack, Tab, Drawer navigator dan passing params antar layar.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", duration: 870, order: 3, isPreview: false },
              ],
            },
          },
          {
            title: "Modul 2: State Management & API Integration",
            order: 2,
            lessons: {
              create: [
                { title: "4. Zustand & AsyncStorage untuk State Management", description: "Global state ringan dengan Zustand dan persistensi lokal.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", duration: 760, order: 1, isPreview: false },
                { title: "5. Fetching API & Error Handling dengan React Query", description: "TanStack Query untuk caching, loading state, dan refetch.", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", duration: 820, order: 2, isPreview: false },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ 5 Kursus berhasil dibuat");

  // === KUIS untuk setiap kursus ===

  // Quiz Kursus 1: Next.js
  const quiz1 = await prisma.quiz.create({
    data: {
      title: "Kuis Akhir: Next.js App Router & Supabase",
      description: "Uji pemahaman Anda tentang Next.js 14, Supabase, dan konsep full-stack modern.",
      passingScore: 70,
      courseId: course1.id,
      questions: {
        create: [
          {
            text: "Apa perbedaan utama antara Server Components dan Client Components di Next.js 14?",
            order: 1,
            explanation: "Server Components dirender di server dan tidak bisa menggunakan hooks React. Client Components dirender di client/browser.",
            options: {
              create: [
                { text: "Server Components lebih lambat dari Client Components", isCorrect: false },
                { text: "Server Components dirender di server dan tidak bisa menggunakan useState/useEffect", isCorrect: true },
                { text: "Client Components tidak bisa mengambil data dari database", isCorrect: false },
                { text: "Tidak ada perbedaan, hanya penamaan berbeda", isCorrect: false },
              ],
            },
          },
          {
            text: "Apa fungsi dari Transaction Pooler (port 6543) di Supabase?",
            order: 2,
            explanation: "Transaction Pooler menggunakan PgBouncer untuk manajemen koneksi yang efisien, cocok untuk serverless environment seperti Vercel.",
            options: {
              create: [
                { text: "Untuk menyimpan file dan aset media", isCorrect: false },
                { text: "Untuk manajemen koneksi database yang efisien di environment serverless", isCorrect: true },
                { text: "Untuk enkripsi data di database", isCorrect: false },
                { text: "Untuk replikasi database ke region lain", isCorrect: false },
              ],
            },
          },
          {
            text: "Direktif 'use client' di Next.js digunakan untuk...",
            order: 3,
            explanation: "'use client' menandai komponen sebagai Client Component yang dirender di browser dan bisa menggunakan React hooks.",
            options: {
              create: [
                { text: "Mengoptimalkan performa loading halaman", isCorrect: false },
                { text: "Menandai komponen agar bisa menggunakan React hooks dan browser APIs", isCorrect: true },
                { text: "Membuat API routes di Next.js", isCorrect: false },
                { text: "Mengaktifkan caching otomatis", isCorrect: false },
              ],
            },
          },
          {
            text: "Apa keunggulan Cloudflare R2 dibandingkan Amazon S3 untuk penyimpanan aset?",
            order: 4,
            explanation: "Cloudflare R2 memiliki zero egress fee (tidak ada biaya untuk mengambil data), berbeda dengan S3 yang mengenakan biaya egress.",
            options: {
              create: [
                { text: "R2 memiliki kapasitas penyimpanan yang lebih besar", isCorrect: false },
                { text: "R2 tidak memiliki biaya egress (transfer data keluar), berbeda dengan S3", isCorrect: true },
                { text: "R2 lebih mudah dikonfigurasi daripada S3", isCorrect: false },
                { text: "R2 mendukung lebih banyak tipe file", isCorrect: false },
              ],
            },
          },
          {
            text: "Apa peran JWT (JSON Web Token) dalam sistem autentikasi NextAuth.js?",
            order: 5,
            explanation: "JWT digunakan sebagai session token yang menyimpan informasi user (id, role, email) secara terenkripsi tanpa perlu menyimpan session di database.",
            options: {
              create: [
                { text: "Untuk menyimpan password user secara aman", isCorrect: false },
                { text: "Sebagai session token terenkripsi yang menyimpan informasi user tanpa perlu database session", isCorrect: true },
                { text: "Untuk komunikasi antar microservices", isCorrect: false },
                { text: "Untuk validasi form input di frontend", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // Quiz Kursus 2: UI/UX
  const quiz2 = await prisma.quiz.create({
    data: {
      title: "Kuis: Prinsip UI/UX & Figma Fundamentals",
      description: "Evaluasi pemahaman Anda tentang prinsip desain dan penggunaan Figma.",
      passingScore: 65,
      courseId: course2.id,
      questions: {
        create: [
          {
            text: "Apa yang dimaksud dengan 'Visual Hierarchy' dalam desain UI?",
            order: 1,
            explanation: "Visual hierarchy adalah teknik mengatur elemen visual untuk memandu mata pengguna mengikuti urutan kepentingan informasi.",
            options: {
              create: [
                { text: "Urutan komponen dalam kode HTML", isCorrect: false },
                { text: "Penataan elemen visual yang memandu perhatian pengguna ke informasi terpenting", isCorrect: true },
                { text: "Hierarki role pengguna dalam sistem", isCorrect: false },
                { text: "Tingkatan prioritas bug yang perlu diperbaiki", isCorrect: false },
              ],
            },
          },
          {
            text: "Apa fungsi 'Auto Layout' di Figma?",
            order: 2,
            explanation: "Auto Layout memungkinkan frame untuk menyesuaikan ukuran secara otomatis berdasarkan konten, mirip dengan Flexbox di CSS.",
            options: {
              create: [
                { text: "Membuat animasi otomatis pada prototype", isCorrect: false },
                { text: "Memungkinkan frame menyesuaikan ukuran otomatis seperti Flexbox, berguna untuk komponen responsif", isCorrect: true },
                { text: "Mengatur tata letak grid secara otomatis", isCorrect: false },
                { text: "Menyinkronkan desain ke kode CSS otomatis", isCorrect: false },
              ],
            },
          },
          {
            text: "Apa perbedaan antara Wireframe dan Prototype dalam proses desain UX?",
            order: 3,
            explanation: "Wireframe adalah sketsa kasar layout tanpa styling, sedangkan prototype adalah simulasi interaktif dari produk final.",
            options: {
              create: [
                { text: "Wireframe berwarna, prototype hitam-putih", isCorrect: false },
                { text: "Wireframe adalah sketsa struktural layout, prototype adalah simulasi interaktif high-fidelity", isCorrect: true },
                { text: "Keduanya sama, hanya istilah berbeda", isCorrect: false },
                { text: "Prototype dibuat sebelum wireframe", isCorrect: false },
              ],
            },
          },
          {
            text: "Prinsip desain 'Gestalt' yang menyatakan bahwa elemen yang berdekatan dianggap satu kelompok disebut?",
            order: 4,
            explanation: "Prinsip Proximity (kedekatan) menyatakan bahwa objek yang berdekatan secara spasial cenderung dipersepsikan sebagai satu grup.",
            options: {
              create: [
                { text: "Similarity (Kesamaan)", isCorrect: false },
                { text: "Proximity (Kedekatan)", isCorrect: true },
                { text: "Continuity (Keberlanjutan)", isCorrect: false },
                { text: "Closure (Penutupan)", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // Quiz Kursus 3: Python
  const quiz3 = await prisma.quiz.create({
    data: {
      title: "Kuis: Python & Data Science Fundamentals",
      description: "Uji kemampuan Python dan analisis data Anda.",
      passingScore: 70,
      courseId: course3.id,
      questions: {
        create: [
          {
            text: "Apa perbedaan antara list dan tuple di Python?",
            order: 1,
            explanation: "List bersifat mutable (bisa diubah), sedangkan tuple bersifat immutable (tidak bisa diubah setelah dibuat).",
            options: {
              create: [
                { text: "List menggunakan [] dan tuple menggunakan {}", isCorrect: false },
                { text: "List bersifat mutable (bisa diubah), tuple immutable (tidak bisa diubah)", isCorrect: true },
                { text: "Tuple lebih lambat dari list", isCorrect: false },
                { text: "List hanya bisa menyimpan angka, tuple bisa menyimpan string", isCorrect: false },
              ],
            },
          },
          {
            text: "Fungsi Pandas yang digunakan untuk melihat statistik deskriptif dataframe adalah?",
            order: 2,
            explanation: "df.describe() menampilkan statistik ringkasan seperti count, mean, std, min, max untuk kolom numerik.",
            options: {
              create: [
                { text: "df.info()", isCorrect: false },
                { text: "df.describe()", isCorrect: true },
                { text: "df.summary()", isCorrect: false },
                { text: "df.stats()", isCorrect: false },
              ],
            },
          },
          {
            text: "Apa itu 'overfitting' dalam machine learning?",
            order: 3,
            explanation: "Overfitting terjadi ketika model terlalu 'hafal' data training sehingga performanya buruk di data baru/testing.",
            options: {
              create: [
                { text: "Model yang terlalu sederhana dan tidak bisa belajar pola data", isCorrect: false },
                { text: "Model yang terlalu kompleks dan 'menghafal' data training sehingga buruk di data baru", isCorrect: true },
                { text: "Model yang membutuhkan terlalu banyak memori", isCorrect: false },
                { text: "Proses training yang memakan waktu terlalu lama", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // Quiz Kursus 4: DevOps
  const quiz4 = await prisma.quiz.create({
    data: {
      title: "Kuis: Docker & CI/CD Pipeline",
      description: "Evaluasi pemahaman DevOps, Docker, dan GitHub Actions.",
      passingScore: 70,
      courseId: course4.id,
      questions: {
        create: [
          {
            text: "Apa perbedaan antara Docker Image dan Docker Container?",
            order: 1,
            explanation: "Image adalah template read-only berisi instruksi pembuatan container. Container adalah instance yang sedang berjalan dari sebuah image.",
            options: {
              create: [
                { text: "Image lebih besar dari Container", isCorrect: false },
                { text: "Image adalah template read-only, Container adalah instance yang berjalan dari image tersebut", isCorrect: true },
                { text: "Container digunakan di production, Image untuk development", isCorrect: false },
                { text: "Keduanya sama, hanya namanya berbeda", isCorrect: false },
              ],
            },
          },
          {
            text: "Perintah Docker Compose untuk menjalankan semua service dalam mode background adalah?",
            order: 2,
            explanation: "Flag -d (detached) membuat container berjalan di background tanpa mengikat terminal.",
            options: {
              create: [
                { text: "docker-compose start --background", isCorrect: false },
                { text: "docker-compose up -d", isCorrect: true },
                { text: "docker-compose run -bg", isCorrect: false },
                { text: "docker-compose deploy --detach", isCorrect: false },
              ],
            },
          },
          {
            text: "Dalam GitHub Actions, apa itu 'secret' dan mengapa penting?",
            order: 3,
            explanation: "Secrets adalah variabel terenkripsi untuk menyimpan kredensial sensitif agar tidak terekspos di kode repository.",
            options: {
              create: [
                { text: "File konfigurasi private yang tidak di-commit ke repository", isCorrect: false },
                { text: "Variabel terenkripsi di repository untuk menyimpan kredensial sensitif agar aman dalam workflow", isCorrect: true },
                { text: "Branch khusus yang hanya bisa diakses admin", isCorrect: false },
                { text: "Token GitHub untuk autentikasi 2 faktor", isCorrect: false },
              ],
            },
          },
          {
            text: "Apa fungsi 'multi-stage build' dalam Dockerfile?",
            order: 4,
            explanation: "Multi-stage build memungkinkan penggunaan beberapa FROM dalam satu Dockerfile untuk menghasilkan image final yang lebih kecil dan bersih.",
            options: {
              create: [
                { text: "Membangun image di beberapa server secara paralel", isCorrect: false },
                { text: "Menggunakan beberapa tahap build untuk menghasilkan image production yang lebih kecil dan bersih", isCorrect: true },
                { text: "Membuat versi berbeda dari satu image", isCorrect: false },
                { text: "Proses deployment ke beberapa environment sekaligus", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // Quiz Kursus 5: React Native
  const quiz5 = await prisma.quiz.create({
    data: {
      title: "Kuis: React Native & Mobile Development",
      description: "Uji pemahaman React Native dan pengembangan aplikasi mobile.",
      passingScore: 65,
      courseId: course5.id,
      questions: {
        create: [
          {
            text: "Apa keunggulan utama React Native dibandingkan native development (Swift/Kotlin)?",
            order: 1,
            explanation: "React Native memungkinkan satu codebase JavaScript untuk menghasilkan aplikasi iOS dan Android, menghemat waktu dan biaya development.",
            options: {
              create: [
                { text: "React Native menghasilkan aplikasi yang lebih cepat dari native", isCorrect: false },
                { text: "Satu codebase JavaScript untuk iOS dan Android, menghemat waktu dan biaya", isCorrect: true },
                { text: "React Native memiliki lebih banyak library dari native", isCorrect: false },
                { text: "Aplikasi React Native bisa dijalankan di web browser", isCorrect: false },
              ],
            },
          },
          {
            text: "Komponen React Native yang setara dengan div di HTML adalah?",
            order: 2,
            explanation: "View adalah komponen container fundamental di React Native yang setara dengan div di HTML web.",
            options: {
              create: [
                { text: "Container", isCorrect: false },
                { text: "View", isCorrect: true },
                { text: "Box", isCorrect: false },
                { text: "Section", isCorrect: false },
              ],
            },
          },
          {
            text: "Library navigasi yang paling umum digunakan di React Native adalah?",
            order: 3,
            explanation: "React Navigation adalah library navigasi komunitas yang paling populer dan direkomendasikan untuk React Native.",
            options: {
              create: [
                { text: "React Router Native", isCorrect: false },
                { text: "React Navigation", isCorrect: true },
                { text: "Native Router", isCorrect: false },
                { text: "Expo Router (selalu lebih baik)", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ 5 Kuis berhasil dibuat (masing-masing untuk tiap kursus)");

  // === ENROLLMENTS: 5 murid ke berbagai kursus ===
  // Murid 1 (Budi): Course 1 (75% progress) + Course 3 (50%)
  const enr1 = await prisma.enrollment.create({ data: { userId: murid1.id, courseId: course1.id, progress: 75, isCompleted: false } });
  const enr2 = await prisma.enrollment.create({ data: { userId: murid1.id, courseId: course3.id, progress: 50, isCompleted: false } });

  // Murid 2 (Dewi): Course 2 (100% selesai) + Course 3 (25%)
  const enr3 = await prisma.enrollment.create({ data: { userId: murid2.id, courseId: course2.id, progress: 100, isCompleted: true, completedAt: new Date() } });
  const enr4 = await prisma.enrollment.create({ data: { userId: murid2.id, courseId: course3.id, progress: 25, isCompleted: false } });

  // Murid 3 (Reza): Course 2 (60%) + Course 5 (30%)
  const enr5 = await prisma.enrollment.create({ data: { userId: murid3.id, courseId: course2.id, progress: 60, isCompleted: false } });
  const enr6 = await prisma.enrollment.create({ data: { userId: murid3.id, courseId: course5.id, progress: 30, isCompleted: false } });

  // Murid 4 (Anisa): Course 1 (100% selesai) + Course 4 (80%)
  const enr7 = await prisma.enrollment.create({ data: { userId: murid4.id, courseId: course1.id, progress: 100, isCompleted: true, completedAt: new Date() } });
  const enr8 = await prisma.enrollment.create({ data: { userId: murid4.id, courseId: course4.id, progress: 80, isCompleted: false } });

  // Murid 5 (Fajar): Course 4 (100% selesai) + Course 1 (40%)
  const enr9 = await prisma.enrollment.create({ data: { userId: murid5.id, courseId: course4.id, progress: 100, isCompleted: true, completedAt: new Date() } });
  const enr10 = await prisma.enrollment.create({ data: { userId: murid5.id, courseId: course1.id, progress: 40, isCompleted: false } });

  // Suppress unused warnings
  void enr1; void enr2; void enr4; void enr5; void enr6; void enr8; void enr10;

  console.log("✅ 10 Enrollment berhasil dibuat");

  // === SERTIFIKAT untuk enrollment yang selesai ===
  await prisma.certificate.createMany({
    data: [
      { certificateCode: "CERT-DEWI-UIUX-2025", userId: murid2.id, courseId: course2.id, issuedAt: new Date("2025-10-15") },
      { certificateCode: "CERT-ANISA-NEXTJS-2025", userId: murid4.id, courseId: course1.id, issuedAt: new Date("2025-11-01") },
      { certificateCode: "CERT-FAJAR-DEVOPS-2025", userId: murid5.id, courseId: course4.id, issuedAt: new Date("2025-11-05") },
    ],
  });

  console.log("✅ 3 Sertifikat kelulusan berhasil dibuat");

  // === QUIZ ATTEMPTS (hasil kuis murid) ===
  // Ambil options dari quiz1 untuk simulasi jawaban
  const q1WithOpts = await prisma.quiz.findUnique({
    where: { id: quiz1.id },
    include: { questions: { include: { options: true }, orderBy: { order: "asc" } } },
  });

  const q2WithOpts = await prisma.quiz.findUnique({
    where: { id: quiz2.id },
    include: { questions: { include: { options: true }, orderBy: { order: "asc" } } },
  });

  const q3WithOpts = await prisma.quiz.findUnique({
    where: { id: quiz3.id },
    include: { questions: { include: { options: true }, orderBy: { order: "asc" } } },
  });

  const q4WithOpts = await prisma.quiz.findUnique({
    where: { id: quiz4.id },
    include: { questions: { include: { options: true }, orderBy: { order: "asc" } } },
  });

  // Helper untuk mendapatkan option (benar atau salah)
  function getOpt(questions, qIdx, isCorrect) {
    if (!questions || !questions[qIdx]) return null;
    const opts = questions[qIdx].options;
    if (isCorrect) return opts.find(o => o.isCorrect);
    return opts.find(o => !o.isCorrect) || opts[0];
  }

  // Murid 1 (Budi): Kuis Next.js — 80% (lulus)
  if (q1WithOpts && q1WithOpts.questions.length >= 5) {
    const qs = q1WithOpts.questions;
    await prisma.quizAttempt.create({
      data: {
        userId: murid1.id,
        quizId: quiz1.id,
        score: 80,
        isPassed: true,
        createdAt: new Date("2025-11-08T10:00:00"),
        answers: {
          create: [
            { questionId: qs[0].id, selectedOptionId: getOpt(qs, 0, true).id },
            { questionId: qs[1].id, selectedOptionId: getOpt(qs, 1, true).id },
            { questionId: qs[2].id, selectedOptionId: getOpt(qs, 2, true).id },
            { questionId: qs[3].id, selectedOptionId: getOpt(qs, 3, true).id },
            { questionId: qs[4].id, selectedOptionId: getOpt(qs, 4, false).id }, // salah
          ],
        },
      },
    });
  }

  // Murid 2 (Dewi): Kuis UI/UX — 100% (lulus sempurna)
  if (q2WithOpts && q2WithOpts.questions.length >= 4) {
    const qs = q2WithOpts.questions;
    await prisma.quizAttempt.create({
      data: {
        userId: murid2.id,
        quizId: quiz2.id,
        score: 100,
        isPassed: true,
        createdAt: new Date("2025-10-16T14:30:00"),
        answers: {
          create: qs.map(q => ({
            questionId: q.id,
            selectedOptionId: getOpt(qs, qs.indexOf(q), true).id,
          })),
        },
      },
    });
  }

  // Murid 3 (Reza): Kuis UI/UX — 50% (belum lulus)
  if (q2WithOpts && q2WithOpts.questions.length >= 4) {
    const qs = q2WithOpts.questions;
    await prisma.quizAttempt.create({
      data: {
        userId: murid3.id,
        quizId: quiz2.id,
        score: 50,
        isPassed: false,
        createdAt: new Date("2025-11-09T09:15:00"),
        answers: {
          create: qs.map((q, i) => ({
            questionId: q.id,
            selectedOptionId: getOpt(qs, i, i < 2).id, // 2 benar, 2 salah
          })),
        },
      },
    });
  }

  // Murid 4 (Anisa): Kuis Next.js — 100% (lulus sempurna)
  if (q1WithOpts && q1WithOpts.questions.length >= 5) {
    const qs = q1WithOpts.questions;
    await prisma.quizAttempt.create({
      data: {
        userId: murid4.id,
        quizId: quiz1.id,
        score: 100,
        isPassed: true,
        createdAt: new Date("2025-11-02T11:20:00"),
        answers: {
          create: qs.map(q => ({
            questionId: q.id,
            selectedOptionId: getOpt(qs, qs.indexOf(q), true).id,
          })),
        },
      },
    });
  }

  // Murid 5 (Fajar): Kuis DevOps — 75% (lulus)
  if (q4WithOpts && q4WithOpts.questions.length >= 4) {
    const qs = q4WithOpts.questions;
    await prisma.quizAttempt.create({
      data: {
        userId: murid5.id,
        quizId: quiz4.id,
        score: 75,
        isPassed: true,
        createdAt: new Date("2025-11-06T16:45:00"),
        answers: {
          create: qs.map((q, i) => ({
            questionId: q.id,
            selectedOptionId: getOpt(qs, i, i < 3).id, // 3 benar, 1 salah
          })),
        },
      },
    });
  }

  // Murid 1 (Budi): Kuis Python — 66% (belum lulus, min 70%)
  if (q3WithOpts && q3WithOpts.questions.length >= 3) {
    const qs = q3WithOpts.questions;
    await prisma.quizAttempt.create({
      data: {
        userId: murid1.id,
        quizId: quiz3.id,
        score: 66.67,
        isPassed: false,
        createdAt: new Date("2025-11-10T08:00:00"),
        answers: {
          create: qs.map((q, i) => ({
            questionId: q.id,
            selectedOptionId: getOpt(qs, i, i < 2).id, // 2 benar, 1 salah
          })),
        },
      },
    });
  }

  console.log("✅ 6 Quiz Attempts (hasil kuis murid) berhasil dibuat");

  // === REVIEWS ===
  await prisma.review.createMany({
    data: [
      { userId: murid1.id, courseId: course1.id, rating: 5, comment: "Materinya sangat komprehensif dan langsung ke praktik industri! Next.js + Supabase + R2 sangat scalable." },
      { userId: murid4.id, courseId: course1.id, rating: 5, comment: "Instruktur menjelaskan dengan sangat jelas. Saya berhasil deploy aplikasi pertama saya ke Vercel!" },
      { userId: murid2.id, courseId: course2.id, rating: 5, comment: "Figma course terbaik yang pernah saya ikuti. Design system yang diajarkan sangat applicable di dunia kerja." },
      { userId: murid3.id, courseId: course2.id, rating: 4, comment: "Konten bagus! Mungkin bisa ditambah lebih banyak latihan praktis." },
      { userId: murid5.id, courseId: course4.id, rating: 5, comment: "DevOps sekarang tidak lagi menakutkan setelah ikut kursus ini. CI/CD pipeline-nya langsung bisa saya terapkan." },
    ],
  });

  console.log("✅ 5 Review berhasil dibuat");

  // === LESSON PROGRESS untuk murid yang sudah selesai ===
  // Ambil semua lessons dari course1 untuk murid4 (100% complete)
  const course1Lessons = await prisma.lesson.findMany({
    where: { section: { courseId: course1.id } },
  });
  for (const lesson of course1Lessons) {
    await prisma.lessonProgress.create({
      data: { userId: murid4.id, lessonId: lesson.id, isCompleted: true },
    });
  }

  // Course4 untuk murid5 (100% complete)
  const course4Lessons = await prisma.lesson.findMany({
    where: { section: { courseId: course4.id } },
  });
  for (const lesson of course4Lessons) {
    await prisma.lessonProgress.create({
      data: { userId: murid5.id, lessonId: lesson.id, isCompleted: true },
    });
  }

  // Course2 untuk murid2 (100% complete)
  const course2Lessons = await prisma.lesson.findMany({
    where: { section: { courseId: course2.id } },
  });
  for (const lesson of course2Lessons) {
    await prisma.lessonProgress.create({
      data: { userId: murid2.id, lessonId: lesson.id, isCompleted: true },
    });
  }

  console.log("✅ Lesson progress untuk murid yang selesai berhasil dibuat");

  console.log("\n🎉 ===== SEEDING SELESAI DENGAN SEMPURNA! =====");
  console.log("\n📧 Akun Login:");
  console.log("   👑 ADMIN    : admin@edunexus.id / admin123");
  console.log("   👨‍🏫 PENGAJAR : pengajar@edunexus.id / pengajar123");
  console.log("   👩‍🏫 PENGAJAR2: pengajar2@edunexus.id / pengajar123");
  console.log("   👨‍🎓 MURID    : murid@edunexus.id / murid123 (Budi Santoso)");
  console.log("   👩‍🎓 MURID2   : murid2@edunexus.id / murid123 (Dewi Anggraini)");
  console.log("   👨‍🎓 MURID3   : murid3@edunexus.id / murid123 (Reza Fahlevi)");
  console.log("   👩‍🎓 MURID4   : murid4@edunexus.id / murid123 (Anisa Rahma)");
  console.log("   👨‍🎓 MURID5   : murid5@edunexus.id / murid123 (Fajar Nugroho)");
  console.log("\n📚 Data yang dibuat:");
  console.log("   - 5 Kursus (3 oleh Dr. Ahmad, 2 oleh Siti Rahmawati)");
  console.log("   - 5 Kategori (Web Dev, Data Science, UI/UX, Cloud/DevOps, Mobile)");
  console.log("   - 5 Kuis dengan total 21 soal pilihan ganda");
  console.log("   - 10 Enrollment (5 murid × 2 kursus masing-masing)");
  console.log("   - 6 Quiz Attempts dengan nilai bervariasi (lulus & belum lulus)");
  console.log("   - 3 Sertifikat kelulusan");
  console.log("   - 5 Review kursus");

  const demoAccounts = [
    [admin, "admin123"], [pengajar1, "pengajar123"], [pengajar2, "pengajar123"],
    [murid1, "murid123"], [murid2, "murid123"], [murid3, "murid123"],
    [murid4, "murid123"], [murid5, "murid123"],
  ];
  const listedAuthUsers = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listedAuthUsers.error) throw listedAuthUsers.error;
  for (const [profile, password] of demoAccounts) {
    let authUser = listedAuthUsers.data.users.find((candidate) => candidate.email?.toLowerCase() === profile.email.toLowerCase());
    if (!authUser) {
      const created = await supabaseAdmin.auth.admin.createUser({
        email: profile.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: profile.name, role: profile.role },
      });
      if (created.error) throw created.error;
      authUser = created.data.user;
    }
    await prisma.user.update({ where: { id: profile.id }, data: { authUserId: authUser.id } });
  }
  console.log("Supabase Auth identities linked to all 8 demo profiles.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
