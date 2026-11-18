"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useState } from "react";
import EduvibeLogo from "@/components/layout/EduvibeLogo";
import {
  Search,
  BookOpen,
  LogOut,
  Shield,
  LayoutDashboard,
  PlusCircle,
  Menu,
  X,
  Compass,
} from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const userRole = user?.role;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            >
              <EduvibeLogo size={38} className="shadow-sm group-hover:shadow transition-shadow" />
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center">
                  Edu<span className="text-brand-500">vibe</span>
                </span>
                <span className="text-[10px] text-slate-500 block -mt-1 font-semibold uppercase tracking-wider">
                  Matematika SMA
                </span>
              </div>
            </Link>

            {/* Catalog Button */}
            <Link
              href="/courses"
              className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                pathname.startsWith("/courses")
                  ? "bg-brand-50 text-brand-600 shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Compass className="w-4 h-4 text-brand-500" />
              <span>Katalog Kursus</span>
            </Link>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari materi matematika... (cth: Aljabar, Trigonometri, Kalkulus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:shadow-md transition-all placeholder:text-slate-400"
              />
            </div>
          </form>

          {/* Navigation Links based on Role */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Murid links */}
                {userRole === "MURID" && (
                  <Link
                    href="/murid/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    <BookOpen className="w-4 h-4 text-brand-500" />
                    <span>Pembelajaran Saya</span>
                  </Link>
                )}

                {/* Pengajar links */}
                {userRole === "PENGAJAR" && (
                  <>
                    <Link
                      href="/pengajar/dashboard"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-500" />
                      <span>Studio Pengajar</span>
                    </Link>
                    <Link
                      href="/pengajar/courses/create"
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-50 text-brand-600 rounded-xl text-sm font-semibold hover:bg-brand-100 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Buat Kursus</span>
                    </Link>
                  </>
                )}

                {/* Admin links */}
                {userRole === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
                  >
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>Panel Admin</span>
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        user.image ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                      }
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover bg-slate-100"
                    />
                    <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {userRole}
                        </span>
                      </div>

                      {userRole === "MURID" && (
                        <Link
                          href="/murid/dashboard"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-slate-400" />
                          Dashboard Belajar
                        </Link>
                      )}

                      {userRole === "PENGAJAR" && (
                        <Link
                          href="/pengajar/dashboard"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Studio Pengajar
                        </Link>
                      )}

                      {userRole === "ADMIN" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                        >
                          <Shield className="w-4 h-4 text-slate-400" />
                          Panel Administrator
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            void signOut().then(() => router.push("/"));
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar Akun
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold text-brand-600 hover:text-brand-700 rounded-xl hover:bg-brand-50 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari materi matematika..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </form>

          <Link
            href="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-brand-600"
          >
            Jelajahi Katalog Kursus
          </Link>

          {user ? (
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <div className="text-xs text-slate-500 font-medium">
                Masuk sebagai {user.name} ({userRole})
              </div>
              {userRole === "MURID" && (
                <Link
                  href="/murid/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-sm text-slate-700 font-medium"
                >
                  Pembelajaran Saya
                </Link>
              )}
              {userRole === "PENGAJAR" && (
                <>
                  <Link
                    href="/pengajar/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-slate-700 font-medium"
                  >
                    Studio Pengajar
                  </Link>
                  <Link
                    href="/pengajar/courses/create"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-brand-600 font-semibold"
                  >
                    + Buat Kursus Baru
                  </Link>
                </>
              )}
              {userRole === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-sm text-purple-700 font-semibold"
                >
                  Panel Admin
                </Link>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  void signOut().then(() => router.push("/"));
                }}
                className="block w-full text-left py-2 text-sm text-red-600 font-semibold"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-brand-600 border border-brand-500 rounded-xl"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-brand-500 rounded-xl"
              >
                Daftar Gratis
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
