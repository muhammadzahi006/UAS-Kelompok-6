import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import PushNotificationButton from "@/components/notifications/PushNotificationButton";
import {
  BookOpen,
  Award,
  Clock,
  PlayCircle,
  CheckCircle,
  ArrowRight,
  ClipboardList,
  Trophy,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MuridDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/murid/dashboard");
  }

  // Fetch enrollments + certificates + quiz attempts
  const [enrollments, certificates, quizAttempts] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            category: { select: { name: true } },
            _count: { select: { sections: true } },
            quizzes: {
              select: {
                id: true,
                title: true,
                passingScore: true,
                _count: { select: { questions: true } },
              },
            },
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
    prisma.quizAttempt.findMany({
      where: { userId: user.id },
      include: {
        quiz: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.isCompleted || e.progress >= 100).length;
  const inProgressCourses = totalEnrolled - completedCourses;
  const passedQuizzes = quizAttempts.filter((a) => a.isPassed).length;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                user.avatar ||
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

          <div className="flex flex-col items-start md:items-end gap-3">
            <PushNotificationButton />
            <Link
              href="/courses"
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Jelajahi Kursus Lainnya</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Kuis Lulus</p>
              <p className="text-2xl font-black text-slate-900">{passedQuizzes}</p>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <span>Kursus Saya</span>
          </h2>

          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => {
                const progressInt = Math.round(enr.progress);
                const isFinished = enr.isCompleted || enr.progress >= 100;
                const userCert = certificates.find(
                  (c) => c.courseId === enr.courseId
                );

                return (
                  <div
                    key={enr.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-brand-200 transition-all"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        enr.course.thumbnail ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80"
                      }
                      alt={enr.course.title}
                      className="w-full h-36 object-cover"
                    />

                    <div className="p-5 flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isFinished
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {isFinished ? "Selesai" : "Dalam Proses"}
                        </span>
                        {enr.course.category && (
                          <span className="text-xs text-slate-400">
                            {enr.course.category.name}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {enr.course.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        oleh {enr.course.instructor?.name || "Instruktur"}
                      </p>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500">Progres</span>
                          <span className="font-bold text-slate-700">{progressInt}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isFinished ? "bg-emerald-500" : "bg-brand-500"
                            }`}
                            style={{ width: `${progressInt}%` }}
                          />
                        </div>
                      </div>

                      {/* Quiz links */}
                      {enr.course.quizzes && enr.course.quizzes.length > 0 && (
                        <div className="pt-1">
                          <p className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                            <ClipboardList className="w-3.5 h-3.5" />
                            Kuis Tersedia
                          </p>
                          <div className="space-y-1">
                            {enr.course.quizzes.map((quiz) => {
                              const attempt = quizAttempts.find((a) => a.quizId === quiz.id);
                              return (
                                <Link
                                  key={quiz.id}
                                  href={`/murid/courses/${enr.courseId}/quiz/${quiz.id}`}
                                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    attempt?.isPassed
                                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                      : attempt
                                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                                      : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                  }`}
                                >
                                  <span className="truncate">{quiz.title}</span>
                                  <span className="flex-shrink-0 ml-2">
                                    {attempt?.isPassed ? (
                                      <span className="font-bold text-emerald-600">
                                        ✓ {Math.round(attempt.score)}%
                                      </span>
                                    ) : attempt ? (
                                      <span className="font-bold text-red-500">
                                        ✗ {Math.round(attempt.score)}%
                                      </span>
                                    ) : (
                                      <span>→ Kerjakan</span>
                                    )}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
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

        {/* Riwayat Kuis Section */}
        {quizAttempts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-purple-500" />
              <span>Riwayat Kuis & Nilai Saya</span>
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Nama Kuis
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Kursus
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Nilai
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizAttempts.map((attempt) => (
                      <tr
                        key={attempt.id}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <p className="font-semibold text-slate-900 text-xs">
                            {attempt.quiz.title}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">
                            {attempt.quiz.course.title}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-black text-lg text-slate-900">
                            {Math.round(attempt.score)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 justify-center ${
                              attempt.isPassed
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {attempt.isPassed ? (
                              <>
                                <CheckCircle className="w-3 h-3" /> Lulus
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" /> Belum Lulus
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-xs text-slate-400">
                          {new Date(attempt.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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
