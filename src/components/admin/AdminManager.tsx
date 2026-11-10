"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  BookOpen,
  FolderTree,
  Award,
  Eye,
  Trash2,
  PlusCircle,
  Search,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface AdminManagerProps {
  stats: {
    totalUsers: number;
    totalPengajar: number;
    totalMurid: number;
    totalCourses: number;
    publishedCourses: number;
    totalEnrollments: number;
    totalCertificates: number;
  };
  users: any[];
  courses: any[];
  categories: any[];
}

export default function AdminManager({
  stats,
  users: initialUsers,
  courses: initialCourses,
  categories: initialCategories,
}: AdminManagerProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"users" | "courses" | "categories">("users");
  const [usersList, setUsersList] = useState(initialUsers);
  const [coursesList, setCoursesList] = useState(initialCourses);
  const [categoriesList, setCategoriesList] = useState(initialCategories);

  // User search & filter
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Category modal
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        router.refresh();
      }
    } catch (err) {
      alert("Gagal mengubah role pengguna.");
    }
  };

  // Handle course publish toggle
  const handleToggleCoursePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (res.ok) {
        setCoursesList((prev) =>
          prev.map((c) =>
            c.id === courseId ? { ...c, isPublished: !currentStatus } : c
          )
        );
        router.refresh();
      }
    } catch (err) {
      alert("Gagal memperbarui status kursus.");
    }
  };

  // Handle course delete
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kursus ini beserta seluruh modulnya?")) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCoursesList((prev) => prev.filter((c) => c.id !== courseId));
        router.refresh();
      }
    } catch (err) {
      alert("Gagal menghapus kursus.");
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmittingCat(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          description: newCategoryDesc.trim(),
        }),
      });

      if (res.ok) {
        const newCat = await res.json();
        setCategoriesList([...categoriesList, { ...newCat, _count: { courses: 0 } }]);
        setNewCategoryName("");
        setNewCategoryDesc("");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Gagal menambah kategori");
      }
    } catch (err) {
      alert("Gagal menambah kategori.");
    } finally {
      setIsSubmittingCat(false);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchQuery =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchQuery && matchRole;
  });

  return (
    <div className="space-y-8">
      {/* Platform Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Pengguna</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalUsers}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {stats.totalPengajar} Guru • {stats.totalMurid} Murid
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Kursus</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalCourses}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {stats.publishedCourses} Terbit aktif
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Pendaftaran Murid</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalEnrollments}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
              Akses Aktif di Kelas
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Sertifikat Terbit</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalCertificates}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verifikasi Digital Resmi
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "users"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manajemen Pengguna ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "courses"
              ? "bg-brand-500 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Moderasi Kursus ({coursesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "categories"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Kategori ({categoriesList.length})</span>
        </button>
      </div>

      {/* Tab 1: Users Table */}
      {activeTab === "users" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-bold text-base text-slate-900">
              Daftar Seluruh Pengguna
            </h3>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">Semua Role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="PENGAJAR">PENGAJAR</option>
                <option value="MURID">MURID</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role Saat Ini</th>
                  <th className="py-3 px-4">Aktivitas</th>
                  <th className="py-3 px-4">Terdaftar</th>
                  <th className="py-3 px-4 text-right">Ubah Peran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          u.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`
                        }
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : u.role === "PENGAJAR"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {u._count.createdCourses > 0 && (
                        <span>{u._count.createdCourses} Kursus • </span>
                      )}
                      <span>{u._count.enrollments} Terdaftar</span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(u.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="py-1 px-2 text-[11px] font-semibold bg-white border border-slate-300 rounded-lg hover:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="MURID">Jadikan Murid</option>
                        <option value="PENGAJAR">Jadikan Pengajar</option>
                        <option value="ADMIN">Jadikan Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Courses Moderation */}
      {activeTab === "courses" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
          <h3 className="font-bold text-base text-slate-900">
            Moderasi dan Publikasi Kursus
          </h3>

          <div className="divide-y divide-slate-100">
            {coursesList.map((course) => (
              <div
                key={course.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      course.thumbnail ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80"
                    }
                    alt={course.title}
                    className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          course.isPublished
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {course.isPublished ? "Terbit" : "Draf"}
                      </span>
                      <span className="text-xs text-slate-500">
                        Oleh: <strong>{course.instructor.name}</strong>
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 truncate mt-0.5">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {formatRupiah(course.price)} • {course._count.enrollments} Murid
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg text-xs"
                    title="Buka Halaman Kursus"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() =>
                      handleToggleCoursePublish(course.id, course.isPublished)
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      course.isPublished
                        ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {course.isPublished ? "Cabut Publikasi" : "Setujui & Terbitkan"}
                  </button>

                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs"
                    title="Hapus Kursus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Categories Management */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Add Category Form */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Tambah Kategori Baru</span>
            </h3>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="cth: Cybersecurity & Networking"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={3}
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Penjelasan ringkas materi dalam kategori ini..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingCat}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                {isSubmittingCat ? "Menyimpan..." : "Tambah Kategori"}
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Daftar Kategori Tersedia
            </h3>

            <div className="divide-y divide-slate-100">
              {categoriesList.map((cat) => (
                <div
                  key={cat.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{cat.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">
                      Slug: /{cat.slug} • {cat._count?.courses || 0} Kursus
                    </p>
                    {cat.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

