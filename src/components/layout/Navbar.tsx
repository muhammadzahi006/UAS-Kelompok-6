"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useState } from "react";
import {
  GraduationCap,
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
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md group-hover:bg-brand-600 transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
                  Coursera<span className="text-brand-500">ID</span>
                </span>
                <span className="text-[10px] text-slate-500 block -mt-1 font-medium">
                  Online Learning Cloud
                </span>
              </div>
            </Link>

            {/* Catalog Button */}
            <Link
              href="/courses"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/courses")
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Compass className="w-4 h-4 text-brand-500" />
              <span>Jelajahi</span>
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
                placeholder="Mau belajar apa hari ini? (cth: Next.js, Python, UI/UX)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
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
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-500" />
                      <span>Studio Pengajar</span>
                    </Link>
                    <Link
                      href="/pengajar/courses/create"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors"
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-brand-200 transition-all"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        user.image ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                      }
                      alt={user.name || "User"}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                        <span
                          className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
                            userRole === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : userRole === "PENGAJAR"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          Role: {userRole}
                        </span>
                      </div>

                      <div className="py-1">
                        {userRole === "MURID" && (
                          <Link
                            href="/murid/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <BookOpen className="w-4 h-4 text-slate-400" />
                            Kursus Saya
                          </Link>
                        )}
                        {userRole === "PENGAJAR" && (
                          <Link
                            href="/pengajar/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            Dashboard Pengajar
                          </Link>
                        )}
                        {userRole === "ADMIN" && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Shield className="w-4 h-4 text-slate-400" />
                            Panel Administrasi
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            void signOut().then(() => router.push("/"));
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar (Sign Out)
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
                  className="px-4 py-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm transition-all"
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
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                placeholder="Cari kursus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </form>

          <Link
            href="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
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
                  className="block py-2 text-sm text-slate-700"
                >
                  Pembelajaran Saya
                </Link>
              )}
              {userRole === "PENGAJAR" && (
                <>
                  <Link
                    href="/pengajar/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-slate-700"
                  >
                    Dashboard Pengajar
                  </Link>
                  <Link
                    href="/pengajar/courses/create"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-brand-600 font-medium"
                  >
                    + Buat Kursus Baru
                  </Link>
                </>
              )}
              {userRole === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-sm text-purple-700 font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  void signOut().then(() => router.push("/"));
                }}
                className="block w-full text-left py-2 text-sm text-red-600 font-medium"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 text-center text-sm font-semibold text-brand-600 border border-brand-500 rounded-lg"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 text-center text-sm font-semibold text-white bg-brand-500 rounded-lg"
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

