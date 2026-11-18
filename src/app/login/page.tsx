"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import EduvibeLogo from "@/components/layout/EduvibeLogo";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Shield,
  Presentation,
  GraduationCap,
  Sparkles,
} from "lucide-react";

// Akun Demo Pengujian yang Terhubung Langsung ke Database Supabase
const DEMO_ACCOUNTS = [
  {
    role: "ADMIN",
    label: "Super Admin",
    email: "admin@eduvibe.id",
    password: "admin123",
    desc: "Akses penuh manajemen pengguna & kurikulum",
    icon: Shield,
    color: "purple",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
    btnClass: "hover:border-purple-300 hover:bg-purple-50/50",
  },
  {
    role: "PENGAJAR",
    label: "Guru / Pengajar",
    email: "pengajar@eduvibe.id",
    password: "pengajar123",
    desc: "Studio pengajar, buat modul & kelola kuis",
    icon: Presentation,
    color: "amber",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    btnClass: "hover:border-amber-300 hover:bg-amber-50/50",
  },
  {
    role: "MURID",
    label: "Siswa (Murid)",
    email: "murid@eduvibe.id",
    password: "murid123",
    desc: "Akses modul, kuis 15 soal & sertifikat",
    icon: GraduationCap,
    color: "blue",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    btnClass: "hover:border-blue-300 hover:bg-blue-50/50",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeQuickRole, setActiveQuickRole] = useState<string | null>(null);

  const supabase = createClient();

  const handleQuickLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setActiveQuickRole(acc.role);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      await fetch("/api/auth/profile", { cache: "no-store" });
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Gagal masuk. Periksa email dan password akun Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl">
      {/* Brand & Title */}
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <EduvibeLogo size={46} className="shadow-md" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Masuk ke Eduvibe
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Platform Bimbingan & Kursus Matematika SMA Terpadu
        </p>
      </div>

      {/* Quick Demo Script Role Box (Sesuai Permintaan Dosen) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Login Cepat Pengujian (3 Roles):</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Klik salah satu tombol peran di bawah untuk mengisi kredensial database otomatis:
        </p>

        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((acc) => {
            const IconComponent = acc.icon;
            const isSelected = activeQuickRole === acc.role;

            return (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className={`p-2.5 rounded-xl border text-center transition-all duration-200 hover:scale-[1.03] active:scale-95 flex flex-col items-center gap-1.5 shadow-sm ${
                  isSelected
                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-300"
                    : `bg-white border-slate-200 ${acc.btnClass}`
                }`}
                title={acc.desc}
              >
                <div className={`p-1.5 rounded-lg ${acc.badgeClass}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-slate-800 leading-tight">
                  {acc.label}
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase">
                  {acc.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 tracking-wider">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setActiveQuickRole(null);
              }}
              placeholder="nama@eduvibe.id"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 tracking-wider">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setActiveQuickRole(null);
              }}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Memverifikasi Akun...
            </span>
          ) : (
            <>
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Info */}
      <div className="text-center pt-1 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Belum memiliki akun siswa?{" "}
          <Link
            href="/register"
            className="font-bold text-brand-600 hover:text-brand-700 underline"
          >
            Daftar gratis di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/40 via-white to-slate-50">
      <Suspense
        fallback={
          <div className="text-slate-500 text-sm font-semibold flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></span>
            Memuat portal login...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
