const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database Coursera Clone...");

  // 1. Bersihkan data lama jika ada
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.review.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Buat Pengguna untuk 3 Role
  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
  const hashedPasswordPengajar = await bcrypt.hash("pengajar123", 10);
  const hashedPasswordMurid = await bcrypt.hash("murid123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Super Administrator",
      email: "admin@coursera-clone.com",
      password: hashedPasswordAdmin,
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      headline: "Platform Administrator & Operations Lead",
      bio: "Mengelola seluruh ekosistem pembelajaran daring dan kurikulum platform.",
    },
  });

  const pengajar = await prisma.user.create({
    data: {
      name: "Dr. Ahmad Hidayat, M.Kom",
      email: "pengajar@coursera-clone.com",
      password: hashedPasswordPengajar,
      role: "PENGAJAR",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      headline: "Senior Cloud & Software Architect @ TechCorp",
      bio: "Praktisi teknologi lebih dari 12 tahun dengan spesialisasi Next.js, Cloud Architectures (AWS/Cloudflare), dan Distributed Systems.",
    },
  });

  const murid = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "murid@coursera-clone.com",
      password: hashedPasswordMurid,
      role: "MURID",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
      headline: "Mahasiswa Ilmu Komputer & Aspiring Web Developer",
      bio: "Senang belajar teknologi web modern dan ingin berkarir sebagai Full-Stack Engineer.",
    },
  });

  console.log("✅ Berhasil membuat 3 akun role:");
  console.log("   - ADMIN: admin@coursera-clone.com / admin123");
  console.log("   - PENGAJAR: pengajar@coursera-clone.com / pengajar123");
  console.log("   - MURID: murid@coursera-clone.com / murid123");

  // 3. Kategori Kursus
  const catWeb = await prisma.category.create({
    data: {
      name: "Web Development",
      slug: "web-development",
      description: "Belajar Next.js, React, Node.js, TypeScript, dan arsitektur web modern.",
      icon: "Code",
    },
  });

  const catData = await prisma.category.create({
    data: {
      name: "Data Science & AI",
      slug: "data-science-ai",
      description: "Kuasai Python, analisis data, machine learning, dan generative AI.",
      icon: "Cpu",
    },
  });

  const catDesign = await prisma.category.create({
    data: {
      name: "UI/UX & Desain Produk",
      slug: "ui-ux-design",
      description: "Desain antarmuka aplikasi interaktif, wireframing, dan riset pengguna.",
      icon: "Palette",
    },
  });

  const catCloud = await prisma.category.create({
    data: {
      name: "Cloud & DevOps",
      slug: "cloud-devops",
      description: "Deployment Vercel, Supabase, Cloudflare R2, Docker, dan CI/CD.",
      icon: "Cloud",
    },
  });

  // 4. Kursus Utama (Web Development)
  const course1 = await prisma.course.create({
    data: {
      title: "Mastering Full-Stack Next.js 14, Supabase & Cloudflare R2",
      slug: "mastering-fullstack-nextjs-supabase-r2",
      subtitle: "Panduan lengkap membangun aplikasi web modern skalabel siap produksi dari nol hingga deploy di Vercel.",
      description: `Kursus ini dirancang khusus untuk Anda yang ingin menguasai ekosistem web modern paling diminati di industri teknologi. 
      
Anda akan belajar cara:
1. Merancang aplikasi full-stack dengan Next.js App Router dan Server Components.
2. Mengintegrasikan database PostgreSQL di Supabase menggunakan Prisma ORM.
3. Menyimpan file, video materi, dan dokumen secara aman dan hemat biaya di Cloudflare R2.
4. Menerapkan autentikasi multi-role (Admin, Pengajar, Murid) menggunakan NextAuth.
5. Men-deploy aplikasi secara otomatis ke platform cloud Vercel dengan performa tinggi.`,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
      price: 249000,
      level: "INTERMEDIATE",
      isPublished: true,
      requirements: "Pemahaman dasar tentang HTML, CSS, dan dasar JavaScript (ES6+).",
      objectives: "Membangun web SaaS lengkap; Mengintegrasikan Supabase PostgreSQL; Upload aset ke Cloudflare R2; Deploy di Vercel; Multi-role Auth.",
      instructorId: pengajar.id,
      categoryId: catWeb.id,
      sections: {
        create: [
          {
            title: "Modul 1: Fondasi & Arsitektur Modern Next.js",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Pengenalan Kursus & Demo Hasil Akhir",
                  description: "Gambaran umum materi, struktur arsitektur sistem, serta demo aplikasi yang akan kita bangun bersama.",
                  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                  duration: 480,
                  order: 1,
                  isPreview: true,
                },
                {
                  title: "2. Next.js App Router: Server Components vs Client Components",
                  description: "Memahami paradigma baru React Server Components dan kapan harus menggunakan 'use client'.",
                  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                  duration: 720,
                  order: 2,
                  isPreview: false,
                },
              ],
            },
          },
          {
            title: "Modul 2: Database Supabase PostgreSQL & Prisma ORM",
            order: 2,
            lessons: {
              create: [
                {
                  title: "3. Konfigurasi Supabase & Connection Pooling",
                  description: "Setup project Supabase, konfigurasi Transaction Pooler (port 6543) dan Direct URL.",
                  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                  duration: 650,
                  order: 1,
                  isPreview: false,
                },
                {
                  title: "4. Modeling Relasi Data Kursus, Enrollment, & Multi-Role",
                  description: "Menulis schema Prisma yang kuat dengan relasi 1-to-many, cascading delete, dan indexing.",
                  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                  duration: 890,
                  order: 2,
                  isPreview: false,
                },
              ],
            },
          },
          {
            title: "Modul 3: Storage Aset Skalabel dengan Cloudflare R2",
            order: 3,
            lessons: {
              create: [
                {
                  title: "5. Mengapa Cloudflare R2 & Integrasi S3 SDK",
                  description: "Menghemat biaya bandwidth dengan zero egress fee Cloudflare R2 dan implementasi Presigned URL.",
                  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                  duration: 600,
                  order: 1,
                  isPreview: false,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 5. Kursus Tambahan
  const course2 = await prisma.course.create({
    data: {
      title: "UI/UX Design Masterclass: Desain Web & Mobile di Figma",
      slug: "ui-ux-design-masterclass-figma",
      subtitle: "Pelajari riset pengguna, wireframing, design system, auto-layout, hingga prototipe interaktif.",
      description: "Kuasai seni mendesain produk digital modern yang disukai pengguna dan siap diserahkan ke tim developer.",
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80",
      price: 0, // Kursus Gratis
      level: "BEGINNER",
      isPublished: true,
      requirements: "Tidak memerlukan pengalaman desain sebelumnya. Hanya perlu laptop dan akun Figma gratis.",
      objectives: "Mendesain antarmuka modern; Menguasai Figma Component & Auto-layout; Membuat interactive prototype.",
      instructorId: pengajar.id,
      categoryId: catDesign.id,
      sections: {
        create: [
          {
            title: "Modul 1: Dasar Desain & Pengenalan Figma",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1. Prinsip Desain UI/UX & Antarmuka Coursera",
                  description: "Mempelajari hirarki visual, typography scale, dan color palette.",
                  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
                  duration: 520,
                  order: 1,
                  isPreview: true,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 6. Buat Enrollment awal untuk murid ke course1
  await prisma.enrollment.create({
    data: {
      userId: murid.id,
      courseId: course1.id,
      progress: 33.3,
      isCompleted: false,
    },
  });

  // Review
  await prisma.review.create({
    data: {
      userId: murid.id,
      courseId: course1.id,
      rating: 5,
      comment: "Materinya sangat komprehensif dan langsung ke praktik industri! Arsitektur Next.js + Supabase + R2 sangat hemat biaya dan scalable.",
    },
  });

  console.log("🎉 Seeding database selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

