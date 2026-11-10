"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Lock, Mail, User, BookOpen, Presentation, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "PENGAJAR" ? "PENGAJAR" : "MURID";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"MURID" | "PENGAJAR">(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal membuat akun.");
      } else {
        setSuccessMessage("Pendaftaran berhasil! Mengalihkan ke halaman masuk...");
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan pada server. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
      <div className="text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Mulai Belajar di CourseraID
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Daftar gratis dan raih keahlian masa depan Anda.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div>
        <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
          Pilih Peran Anda
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("MURID")}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              role === "MURID"
                ? "bg-white text-brand-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sebagai Murid</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("PENGAJAR")}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              role === "PENGAJAR"
                ? "bg-white text-amber-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>Sebagai Pengajar</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
            Nama Lengkap
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth: Ahmad Pratama"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
            Kata Sandi (Minimal 6 karakter)
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-md transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <span>Membuat Akun...</span>
          ) : (
            <>
              <span>Buat Akun {role === "PENGAJAR" ? "Pengajar" : "Murid"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-slate-600">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-600 hover:text-brand-700 underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/40 via-white to-slate-50">
      <Suspense fallback={<div className="text-slate-500 text-sm">Memuat form pendaftaran...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
