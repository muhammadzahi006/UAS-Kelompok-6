import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  BookOpen,
  Award,
  Clock,
  PlayCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MuridDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/murid/dashboard");
  }

  // Fetch enrollments with course details and certificates
  const [enrollments, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            category: { select: { name: true } },
            _count: { select: { sections: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: { select: { title: true } },
      },
      orderBy: { issuedAt: "desc" },
    }),
  ]);

  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.isCompleted || e.progress >= 100).length;
  const inProgressCourses = totalEnrolled - completedCourses;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                user.image ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
              }
              alt={user.name || "Murid"}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  Halo, {user.name}! 👋
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                  Murid
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Lanjutkan pembelajaran Anda untuk meningkatkan kompetensi dan karir.
              </p>
            </div>
          </div>

          <Link
            href="/courses"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Jelajahi Kursus Lainnya</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Kursus Terdaftar</p>
              <p className="text-2xl font-black text-slate-900">{totalEnrolled}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Sedang Dipelajari</p>
              <p className="text-2xl font-black text-slate-900">{inProgressCourses}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Kursus Selesai</p>
              <p className="text-2xl font-black text-slate-900">{completedCourses}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Sertifikat Diperoleh</p>
              <p className="text-2xl font-black text-slate-900">{certificates.length}</p>
            </div>
          </div>
        </div>

        {/* My Enrolled Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Kursus yang Sedang Anda Ikuti
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Total {enrollments.length} Kursus
            </span>
          </div>

          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => {
                const progressInt = Math.round(enr.progress);
                const isFinished = enr.isCompleted || progressInt >= 100;
                const userCert = certificates.find((c) => c.courseId === enr.courseId);

                return (
                  <div
                    key={enr.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            enr.course.thumbnail ||
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
                          }
                          alt={enr.course.title}
                          className="w-full h-full object-cover"
                        />
                        {isFinished && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-md shadow-sm flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Lulus</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="text-[11px] font-bold uppercase text-brand-600 tracking-wider mb-1">
                          {enr.course.category?.name || "Online Course"}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-2">
                          {enr.course.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Instruktur: {enr.course.instructor.name}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-4 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                            <span>Kemajuan Belajar</span>
                            <span className="font-mono">{progressInt}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isFinished ? "bg-emerald-500" : "bg-brand-500"
                              }`}
                              style={{ width: `${progressInt}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 flex flex-col gap-2 mt-2">
                      <Link
                        href={`/murid/courses/${enr.courseId}/learn`}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-center text-white bg-brand-500 hover:bg-brand-600 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>{isFinished ? "Pelajari Ulang" : "Lanjutkan Belajar"}</span>
                      </Link>

                      {isFinished && userCert && (
                        <Link
                          href={`/certificate/${userCert.certificateCode}`}
                          className="w-full py-2 px-4 rounded-xl font-bold text-xs text-center text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>Unduh Sertifikat</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-brand-500 mx-auto flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Belum Ada Kursus yang Diikuti
              </h3>
              <p className="text-sm text-slate-500 mt-1 mb-6">
                Mulai perjalanan karir Anda hari ini dengan memilih kursus dari katalog kami.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-bold text-xs rounded-xl hover:bg-brand-600 shadow-sm transition-all"
              >
                <span>Jelajahi Kursus Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Sertifikat Kelulusan Terverifikasi Anda</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-sm space-y-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {cert.certificateCode}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {cert.course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Diterbitkan pada:{" "}
                      {new Date(cert.issuedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <Link
                    href={`/certificate/${cert.certificateCode}`}
                    className="block text-center py-2 px-4 rounded-xl text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
                  >
                    Buka Sertifikat Resmi →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

