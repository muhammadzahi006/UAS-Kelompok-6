import Link from "next/link";
import EduvibeLogo from "@/components/layout/EduvibeLogo";
import { CheckCircle2, BookOpen, Award, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02] active:scale-95 inline-flex"
            >
              <EduvibeLogo size={36} />
              <span className="text-xl font-black tracking-tight text-white">
                Edu<span className="text-brand-400">vibe</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform bimbingan dan kursus daring matematika SMA terpadu. Belajar konsep mendalam lewat modul tertulis interaktif, latihan soal komprehensif, dan kuis terstandar.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kurikulum Matematika SMA Kelas 10, 11, & 12</span>
            </div>
          </div>

          {/* Kolom 1: Topik Matematika */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Topik Matematika
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/courses?category=aljabar"
                  className="hover:text-white transition-colors duration-150 inline-block hover:translate-x-1"
                >
                  Aljabar & Fungsi
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=trigonometri"
                  className="hover:text-white transition-colors duration-150 inline-block hover:translate-x-1"
                >
                  Geometri & Trigonometri
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=kalkulus"
                  className="hover:text-white transition-colors duration-150 inline-block hover:translate-x-1"
                >
                  Kalkulus Dasar
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=statistika"
                  className="hover:text-white transition-colors duration-150 inline-block hover:translate-x-1"
                >
                  Statistika & Peluang
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=matriks"
                  className="hover:text-white transition-colors duration-150 inline-block hover:translate-x-1"
                >
                  Matriks & Transformasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Fitur Belajar */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Fitur Pembelajaran
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Modul Teori & Rumus Lengkap</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>15 Soal Kuis Pilihan Ganda</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sertifikat Kelulusan (Min 75%)</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Bimbingan Guru Matematika</span>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Akses Portal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Portal Akses
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/murid/dashboard"
                  className="hover:text-white transition-colors duration-150 inline-block hover:translate-x-1"
                >
                  Dashboard Siswa
                </Link>
              </li>
              <li>
                <Link
                  href="/pengajar/dashboard"
                  className="hover:text-white transition-colors duration-150 inline-block hover:translate-x-1"
                >
                  Studio Guru / Pengajar
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dashboard"
                  className="hover:text-white transition-colors duration-150 inline-block hover:translate-x-1"
                >
                  Panel Administrator
                </Link>
              </li>
              <li>
                <Link
                  href="/register?role=PENGAJAR"
                  className="hover:text-white transition-colors duration-150 inline-block hover:translate-x-1"
                >
                  Daftar Sebagai Pengajar
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Eduvibe. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-6 items-center">
            <span className="text-slate-400">Platform Matematika SMA Interaktif</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Aktif
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
