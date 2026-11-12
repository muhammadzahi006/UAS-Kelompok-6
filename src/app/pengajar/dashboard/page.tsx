import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import PushNotificationButton from "@/components/notifications/PushNotificationButton";
import { formatRupiah } from "@/lib/utils";
import {
  BookOpen,
  Users,
  DollarSign,
  PlusCircle,
  Layers,
  Eye,
  ClipboardList,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PengajarDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/pengajar/dashboard");
  }

  if (user.role !== "PENGAJAR" && user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch courses owned by this instructor
  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: {
      category: { select: { name: true } },
      sections: {
        include: { lessons: true },
      },
      _count: {
        select: { enrollments: true, reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalCourses = courses.length;
  const totalStudents = courses.reduce(
    (acc, cur) => acc + (cur._count?.enrollments || 0),
    0
  );
  const totalRevenue = courses.reduce(
    (acc, cur) => acc + (cur.price || 0) * (cur._count?.enrollments || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
              }
              alt={user.name || "Pengajar"}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  Studio Pengajar: {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                  Pengajar
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Kelola kurikulum kursus Anda, upload materi ke Cloudflare R2, dan pantau perkembangan murid.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <PushNotificationButton />
            <Link
              href="/pengajar/courses/create"
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Kursus Baru</span>
            </Link>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Kursus Dibuat</p>
              <p className="text-2xl font-black text-slate-900">{totalCourses}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Murid Terdaftar</p>
              <p className="text-2xl font-black text-slate-900">{totalStudents}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Estimasi Akumulasi Pendapatan</p>
              <p className="text-2xl font-black text-slate-900">{formatRupiah(totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Courses Table / Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Daftar Kursus Anda
            </h2>
          </div>

          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => {
                const totalLessons = course.sections.flatMap((s) => s.lessons).length;

                return (
                  <div
                    key={course.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-brand-200 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          course.thumbnail ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80"
                        }
                        alt={course.title}
                        className="w-24 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              course.isPublished
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {course.isPublished ? "Terbit (Aktif)" : "Draf (Belum Terbit)"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {course.category?.name || "Kategori"}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base truncate mt-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {course.sections.length} Modul • {totalLessons} Pelajaran •{" "}
                          <strong className="text-slate-700">
                            {course._count.enrollments} murid
                          </strong>{" "}
                          • {formatRupiah(course.price)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                      <Link
                        href={`/courses/${course.slug}`}
                        target="_blank"
                        className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        title="Pratinjau Halaman Kursus"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Pratinjau</span>
                      </Link>

                      <Link
                        href={`/pengajar/courses/${course.id}/curriculum`}
                        className="px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Kurikulum</span>
                      </Link>

                      <Link
                        href={`/pengajar/courses/${course.id}/quizzes`}
                        className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <ClipboardList className="w-4 h-4" />
                        <span>Kuis</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Belum Ada Kursus Dibuat
              </h3>
              <p className="text-sm text-slate-500 mt-1 mb-6">
                Bagikan keahlian Anda ke ribuan siswa dengan membuat kursus pertama Anda.
              </p>
              <Link
                href="/pengajar/courses/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-bold text-xs rounded-xl hover:bg-brand-600 shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Kursus Sekarang</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

