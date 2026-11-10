"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan saat masuk. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMessage("");
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
      <div className="text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Selamat Datang Kembali
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Masuk ke akun CourseraID Anda untuk melanjutkan belajar atau mengajar.
        </p>
      </div>

      {/* Quick Demo Role Selector */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-brand-500" />
          <span>Akun Demo Cepat (Klik untuk Mengisi):</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillQuickDemo("admin@coursera-clone.com", "admin123")}
            className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 transition-colors flex items-center justify-center gap-1"
          >
            👑 Admin
          </button>
          <button
            type="button"
            onClick={() => fillQuickDemo("pengajar@coursera-clone.com", "pengajar123")}
            className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 transition-colors flex items-center justify-center gap-1"
          >
            🎓 Pengajar
          </button>
          <button
            type="button"
            onClick={() => fillQuickDemo("murid@coursera-clone.com", "murid123")}
            className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1"
          >
            🎒 Murid
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
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
            <span>Memproses masuk...</span>
          ) : (
            <>
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-600 hover:text-brand-700 underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/40 via-white to-slate-50">
      <Suspense fallback={<div className="text-slate-500 text-sm">Memuat form login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
