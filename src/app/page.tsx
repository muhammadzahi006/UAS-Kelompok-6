import Link from "next/link";
import prisma from "@/lib/prisma";
import CourseCard from "@/components/courses/CourseCard";
import {
  PlayCircle,
  Award,
  Sparkles,
  Users,
  Database,
  Cloud,
  CheckCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";

async function getFeaturedCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      take: 6,
      include: {
        instructor: {
          select: { name: true, avatar: true },
        },
        category: {
          select: { name: true, slug: true },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return courses;
  } catch (error) {
    console.warn("Database not seeded yet, returning fallback mock courses:", error);
    return [];
  }
}


export const dynamic = "force-dynamic";

export default async function HomePage() {
  const courses = await getFeaturedCourses();

  // Fallback courses if DB empty/before seed
  const displayCourses = courses.length > 0 ? courses : [
    {
      id: "demo-1",
      title: "Mastering Full-Stack Next.js 14, Supabase & Cloudflare R2",
      slug: "mastering-fullstack-nextjs-supabase-r2",
      subtitle: "Panduan lengkap membangun aplikasi web modern skalabel siap produksi dari nol hingga deploy di Vercel.",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
      price: 249000,
      level: "INTERMEDIATE",
      instructor: {
        name: "Dr. Ahmad Hidayat, M.Kom",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      },
      category: { name: "Web Development", slug: "web-development" },
      _count: { enrollments: 120, reviews: 34 },
      avgRating: 4.9,
    },
    {
      id: "demo-2",
      title: "UI/UX Design Masterclass: Desain Web & Mobile di Figma",
      slug: "ui-ux-design-masterclass-figma",
      subtitle: "Pelajari riset pengguna, wireframing, design system, auto-layout, hingga prototipe interaktif.",
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80",
      price: 0,
      level: "BEGINNER",
      instructor: {
        name: "Dr. Ahmad Hidayat, M.Kom",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      },
      category: { name: "UI/UX & Desain", slug: "ui-ux-design" },
      _count: { enrollments: 340, reviews: 52 },
      avgRating: 4.8,
    },
    {
      id: "demo-3",
      title: "Data Science & Machine Learning Dasar dengan Python",
      slug: "data-science-machine-learning-python",
      subtitle: "Analisis dataset dunia nyata dengan Pandas, NumPy, Scikit-Learn dan visualisasi data interaktif.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
      price: 199000,
      level: "BEGINNER",
      instructor: {
        name: "Siti Rahmawati, M.Sc",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      },
      category: { name: "Data Science & AI", slug: "data-science-ai" },
      _count: { enrollments: 89, reviews: 18 },
      avgRating: 4.9,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/70 border border-brand-200 text-brand-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Platform E-Learning Modern Siap Vercel & Supabase</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Kembangkan Potensi Anda Bersama{" "}
                <span className="text-brand-500 underline decoration-brand-200">
                  CourseraID
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Akses ribuan materi praktis dengan streaming video resolusi tinggi dari{" "}
                <strong className="text-slate-800">Cloudflare R2</strong>, tersimpan aman di{" "}
                <strong className="text-slate-800">Supabase PostgreSQL</strong>, dan raih sertifikat resmi terverifikasi.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/courses"
                  className="px-6 py-3.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 group"
                >
                  <span>Mulai Belajar Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/register?role=PENGAJAR"
                  className="px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-sm transition-all"
                >
                  Daftar Jadi Pengajar
                </Link>
              </div>

              {/* Micro stats / Trust badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg">
                <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Cloud Native</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">3 Roles</div>
                  <div className="text-xs text-slate-500 font-medium">Admin, Guru, Murid</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">Digital</div>
                  <div className="text-xs text-slate-500 font-medium">Sertifikat Kelulusan</div>
                </div>
              </div>
            </div>

            {/* Right Col: Graphic Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-4 shadow-2xl border border-slate-200/80">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
                    alt="Course Preview"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-brand-500/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                      <PlayCircle className="w-10 h-10" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs flex items-center justify-between">
                    <span className="font-semibold">Next.js 14 Masterclass</span>
                    <span className="text-emerald-400 font-medium">Cloudflare R2 HD</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-brand-500" />
                      Progres Pembelajaran
                    </span>
                    <span className="text-brand-600">80% Selesai</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full w-4/5"></div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200 items-center gap-3 animate-bounce duration-1000">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Supabase PostgreSQL</p>
                  <p className="text-[11px] text-slate-500">Koneksi Pooler 6543</p>
                </div>
              </div>

              <div className="hidden sm:flex absolute -top-5 -right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200 items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Cloudflare R2</p>
                  <p className="text-[11px] text-slate-500">Presigned Fast Stream</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Didukung Oleh Arsitektur Cloud Siap Produksi
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
              ▲ Next.js 14 (Vercel)
            </span>
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-2">
              ⚡ Supabase PostgreSQL
            </span>
            <span className="text-sm font-bold text-amber-600 flex items-center gap-2">
              ☁️ Cloudflare R2 Storage
            </span>
            <span className="text-sm font-bold text-blue-600 flex items-center gap-2">
              🔒 NextAuth Multi-Role
            </span>
            <span className="text-sm font-bold text-indigo-600 flex items-center gap-2">
              💎 Prisma ORM
            </span>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
                Katalog Unggulan
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Kursus Terpopuler & Paling Diminati
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Materi langsung aplikatif dengan proyek nyata dan silabus terstruktur.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <span>Lihat Semua Kursus</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 3 Roles Showcase */}
      <section className="py-20 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Satu Platform, 3 Peran Berbeda
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Sistem peran lengkap yang dirancang khusus untuk memfasilitasi seluruh alur pembelajaran.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Role 1: Murid */}
            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mb-6 shadow-md">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">1. Murid (Pelajar)</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Jelajahi kursus favorit, tonton video streaming dari Cloudflare R2, tandai progres belajar, dan klaim sertifikat kelulusan digital.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500" />
                    <span>Learning Player Imersif</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500" />
                    <span>Tracking Progres Otomatis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500" />
                    <span>Sertifikat Digital Terverifikasi</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/murid/dashboard"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-brand-600 bg-white border border-brand-200 hover:bg-brand-50 transition-colors"
              >
                Buka Dashboard Murid →
              </Link>
            </div>

            {/* Role 2: Pengajar */}
            <div className="p-8 rounded-3xl bg-amber-50/50 border border-amber-200/80 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-6 shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">2. Pengajar (Instruktur)</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Buat kurikulum modular, upload video pembelajaran langsung ke Cloudflare R2 dengan Presigned URL, dan pantau jumlah murid terdaftar.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500" />
                    <span>Course & Curriculum Builder</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500" />
                    <span>Cloudflare R2 Direct Upload</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500" />
                    <span>Statistik Siswa & Pendapatan</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/pengajar/dashboard"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-amber-800 bg-white border border-amber-200 hover:bg-amber-50 transition-colors"
              >
                Buka Studio Pengajar →
              </Link>
            </div>

            {/* Role 3: Admin */}
            <div className="p-8 rounded-3xl bg-purple-50/50 border border-purple-100 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-6 shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">3. Administrator</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Kendali penuh platform: kelola data pengguna (Admin, Pengajar, Murid), moderasi penerbitan kursus, dan kelola kategori platform.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Manajemen Semua Pengguna & Role</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Moderasi & Publikasi Kursus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Manajemen Kategori Database</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/admin/dashboard"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-purple-700 bg-white border border-purple-200 hover:bg-purple-50 transition-colors"
              >
                Buka Panel Admin →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-brand-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Siap Memulai Perjalanan Belajar Anda?
          </h2>
          <p className="text-brand-100 text-base max-w-xl mx-auto">
            Bergabunglah dengan platform kursus modern hari ini. Masuk menggunakan akun demo cepat atau daftarkan akun baru Anda.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl font-bold text-brand-600 bg-white hover:bg-brand-50 shadow-lg transition-all"
            >
              Daftar Akun Gratis
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl font-bold text-white border border-white/40 hover:bg-white/10 transition-all"
            >
              Masuk Akun Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
