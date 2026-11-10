import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import AdminManager from "@/components/admin/AdminManager";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin/dashboard");
  }

  // Fetch metrics & lists in parallel
  const [
    totalUsers,
    totalPengajar,
    totalMurid,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalCertificates,
    users,
    courses,
    categories,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.PENGAJAR } }),
    prisma.user.count({ where: { role: Role.MURID } }),
    prisma.course.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.enrollment.count(),
    prisma.certificate.count(),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            createdCourses: true,
            enrollments: true,
            certificates: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      include: {
        instructor: { select: { name: true, email: true } },
        category: { select: { name: true } },
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { courses: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const stats = {
    totalUsers,
    totalPengajar,
    totalMurid,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalCertificates,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase">
              Administrator Panel
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Pusat Kendali Platform CourseraID
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola seluruh data pengguna, tinjau penerbitan kursus, dan kelola kategori platform.
          </p>
        </div>

        <AdminManager
          stats={stats}
          users={users}
          courses={courses}
          categories={categories}
        />
      </div>
    </div>
  );
}

