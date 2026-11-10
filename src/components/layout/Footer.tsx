import Link from "next/link";
import { GraduationCap, ShieldCheck, Database, Cloud } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Coursera<span className="text-brand-400">ID</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform kursus daring modern berstandar industri dengan teknologi Next.js, Supabase PostgreSQL, dan Cloudflare R2 storage.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Role: Admin, Pengajar & Murid</span>
            </div>
          </div>

          {/* Kolom 1: Kategori Populer */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Kategori Teratas
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/courses?category=web-development" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/courses?category=data-science-ai" className="hover:text-white transition-colors">
                  Data Science & AI
                </Link>
              </li>
              <li>
                <Link href="/courses?category=ui-ux-design" className="hover:text-white transition-colors">
                  UI/UX & Desain Produk
                </Link>
              </li>
              <li>
                <Link href="/courses?category=cloud-devops" className="hover:text-white transition-colors">
                  Cloud & DevOps
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Peran & Akses */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Portal Akses
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/murid/dashboard" className="hover:text-white transition-colors">
                  Dashboard Murid
                </Link>
              </li>
              <li>
                <Link href="/pengajar/dashboard" className="hover:text-white transition-colors">
                  Studio Pengajar
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                  Panel Administrator
                </Link>
              </li>
              <li>
                <Link href="/register?role=PENGAJAR" className="hover:text-white transition-colors">
                  Menjadi Instruktur
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Stack Teknologi */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Arsitektur Cloud
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-black border border-white"></span>
                <span>Next.js 14 App Router (Vercel)</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>PostgreSQL DB (Supabase)</span>
              </li>
              <li className="flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-amber-400" />
                <span>Asset & Video Storage (Cloudflare R2)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CourseraID. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-6">
            <span className="text-slate-400">UAS Pemrograman Web</span>
            <span className="text-emerald-400 font-medium">Ready for Production Deploy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

