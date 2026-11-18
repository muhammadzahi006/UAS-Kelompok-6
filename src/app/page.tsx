import Link from "next/link";
import prisma from "@/lib/prisma";
import CourseCard from "@/components/courses/CourseCard";
import {
  Sparkles,
  Users,
  CheckCircle,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle2,
  FileText,
  Calculator,
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
    console.warn("Database error or not seeded:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const courses = await getFeaturedCourses();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-700 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Bimbingan Belajar Matematika SMA Terpadu</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Kuasai Matematika SMA Lebih Mudah Bersama{" "}
                <span className="text-brand-500 underline decoration-brand-200 decoration-4 underline-offset-4">
                  Eduvibe
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Akses ribuan kursus MTK berkualitas, pelajari konsep matematika SMA secara terstruktur melalui modul bacaan komprehensif, uji pemahaman lewat kuis interaktif, dan raih sertifikat kelulusan resmi.
              </p>

              {/* CTAs with Micro-Interactions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/courses"
                  className="px-7 py-3.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Jelajahi Kursus MTK</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/register"
                  className="px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                  <span>Daftar Akun Siswa</span>
                </Link>
              </div>

              {/* Educational Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Modul Tertulis & Rumus</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">15 Soal</div>
                  <div className="text-xs text-slate-500 font-medium">Kuis Evaluasi Tiap Topik</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">Min 75%</div>
                  <div className="text-xs text-slate-500 font-medium">Syarat Sertifikat Resmi</div>
                </div>
              </div>
            </div>

            {/* Right Col: Educational Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/90 space-y-5">
                {/* Visual Header */}
                <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-2xl p-6 text-white space-y-3 relative overflow-hidden shadow-lg">
                  <div className="absolute right-3 top-3 opacity-15">
                    <Calculator className="w-24 h-24" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                    Kurikulum SMA Nasional
                  </span>
                  <h3 className="text-xl font-bold leading-snug">
                    Pusat Pembelajaran Matematika Kelas 10, 11, & 12
                  </h3>
                  <p className="text-xs text-white/80">
                    Aljabar, Trigonometri, Geometri, Kalkulus, Statistika & Matriks
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-brand-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Modul Teori Mandiri</p>
                      <p className="text-[11px] text-slate-500">Definisi konsep & penurunan rumus lengkap</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ujian & Kuis Interaktif</p>
                      <p className="text-[11px] text-slate-500">15 soal latihan terstandar dengan penilaian otomatis</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Sertifikat Terverifikasi</p>
                      <p className="text-[11px] text-slate-500">Diterbitkan otomatis saat nilai kuis ≥ 75%</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/courses"
                  className="block text-center w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  Mulai Belajar Sekarang →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-1">
                Katalog Pilihan
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Kursus Matematika Unggulan
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Pelajari materi terstruktur dari guru dan praktisi matematika terbaik.
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Lihat Semua Kursus</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid Kursus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 3 Roles Educational Ecosystem Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              Ekosistem Pembelajaran
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Satu Platform untuk Siswa, Pendidik, dan Pengelola
            </h2>
            <p className="text-slate-600 text-base">
              Eduvibe menghadirkan pengalaman belajar dan mengajar terintegrasi yang mudah digunakan di perangkat desktop maupun ponsel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Role 1: Murid */}
            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mb-6 shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">1. Siswa / Peserta</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Daftar kursus, baca modul materi terstruktur, pantau progres belajar harian, dan ikuti kuis evaluasi untuk mengklaim sertifikat kelulusan.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Akses Modul Teori & Contoh Soal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Kuis Evaluasi 15 Soal dengan Nilai Instan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Sertifikat Kelulusan Resmi Digital</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/murid/dashboard"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-brand-700 bg-white border border-brand-200 hover:bg-brand-50 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                Buka Dashboard Siswa →
              </Link>
            </div>

            {/* Role 2: Pengajar */}
            <div className="p-8 rounded-3xl bg-amber-50/50 border border-amber-200/80 hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-6 shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">2. Guru / Pengajar</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Susun kurikulum modular, buat naskah materi matematika, kelola bank soal kuis, serta pantau hasil belajar dan rekap nilai seluruh siswa.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500" />
                    <span>Penyusunan Kurikulum & Modul Moduler</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500" />
                    <span>Manajemen Soal Kuis Pilihan Ganda</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500" />
                    <span>Rekap Hasil Belajar & Skor Siswa</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/pengajar/dashboard"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-amber-800 bg-white border border-amber-200 hover:bg-amber-50 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                Buka Studio Pengajar →
              </Link>
            </div>

            {/* Role 3: Admin */}
            <div className="p-8 rounded-3xl bg-purple-50/50 border border-purple-100 hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-6 shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">3. Administrator</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Kelola hak akses pengguna, moderasi penerbitan kursus matematika baru, atur kategori topik, serta jaga kualitas ekosistem pembelajaran.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Manajemen Akun Siswa & Guru</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Moderasi & Publikasi Kursus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Manajemen Kategori Kurikulum</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/admin/dashboard"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-purple-700 bg-white border border-purple-200 hover:bg-purple-50 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                Buka Panel Admin →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-gradient-to-r from-brand-600 to-indigo-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Tingkatkan Nilai & Pemahaman Matematika SMA Anda Hari Ini
          </h2>
          <p className="text-brand-100 text-base max-w-xl mx-auto leading-relaxed">
            Bergabunglah bersama ribuan siswa SMA lainnya di Eduvibe. Mulai belajar gratis atau masuk dengan akun simulasi uji kami.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-7 py-3.5 rounded-xl font-bold text-brand-700 bg-white hover:bg-brand-50 shadow-xl transition-all duration-200 hover:scale-[1.03] active:scale-95"
            >
              Daftar Akun Siswa Gratis
            </Link>
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-xl font-bold text-white border border-white/40 hover:bg-white/10 transition-all duration-200 hover:scale-[1.03] active:scale-95"
            >
              Masuk Akun Pengujian
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
