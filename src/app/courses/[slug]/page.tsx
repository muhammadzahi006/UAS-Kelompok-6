import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import EnrollButton from "@/components/courses/EnrollButton";
import { formatRupiah, formatDuration } from "@/lib/utils";
import {
  Star,
  Award,
  CheckCircle,
  Video,
  FileText,
  UserCheck,
  ShieldCheck,
  PlayCircle,
} from "lucide-react";

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          headline: true,
          bio: true,
          avatar: true,
        },
      },
      category: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
      reviews: {
        include: {
          user: {
            select: { name: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Check enrollment
  let isEnrolled = false;
  if (user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });
    isEnrolled = !!enrollment;
  }

  // Calculate total lessons and duration
  const allLessons = course.sections.flatMap((s) => s.lessons);
  const totalLessons = allLessons.length;
  const totalDurationSeconds = allLessons.reduce(
    (acc, cur) => acc + (cur.duration || 0),
    0
  );

  const objectivesList = course.objectives
    ? course.objectives.split(";").map((o) => o.trim()).filter(Boolean)
    : [
        "Membangun aplikasi full-stack siap produksi",
        "Implementasi arsitektur cloud skalabel",
        "Best practices & optimasi performa tinggi",
      ];

  const levelLabels: Record<string, string> = {
    BEGINNER: "Pemula (Beginner)",
    INTERMEDIATE: "Menengah (Intermediate)",
    ADVANCED: "Mahir (Advanced)",
    ALL_LEVELS: "Semua Tingkat",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Banner (Coursera Header Style) */}
      <section className="bg-slate-900 text-white py-12 md:py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              {/* Category & Level Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {course.category && (
                  <span className="px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold rounded-md">
                    {course.category.name}
                  </span>
                )}
                <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-md">
                  Tingkat: {levelLabels[course.level] || course.level}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              {/* Subtitle */}
              {course.subtitle && (
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  {course.subtitle}
                </p>
              )}

              {/* Instructor and Rating Info */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      course.instructor.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`
                    }
                    alt={course.instructor.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <span>
                    Dibuat oleh{" "}
                    <strong className="text-white">{course.instructor.name}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-white">4.9</span>
                  <span className="text-slate-400">
                    ({course.reviews.length || 24} ulasan)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>{course._count.enrollments} murid terdaftar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Syllabus, Details, Instructor */}
          <div className="lg:col-span-8 space-y-10">
            {/* Learning Objectives Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-500" />
                <span>Yang Akan Anda Pelajari di Kursus Ini</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {objectivesList.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="text-brand-500 font-bold shrink-0">✓</span>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content / Curriculum Accordion */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Kurikulum & Materi Kursus
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {course.sections.length} Modul • {totalLessons} Video Pelajaran •{" "}
                    {formatDuration(totalDurationSeconds)} Total Durasi
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {course.sections.map((section) => (
                  <div
                    key={section.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50"
                  >
                    <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-800">
                        {section.title}
                      </h3>
                      <span className="text-xs text-slate-500">
                        {section.lessons.length} Pelajaran
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {section.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-3.5 sm:px-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-brand-500 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {lesson.title}
                              </p>
                              {lesson.description && (
                                <p className="text-xs text-slate-400 line-clamp-1">
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {lesson.isPreview && (
                              <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-[10px] font-bold rounded">
                                Pratinjau Gratis
                              </span>
                            )}
                            <span className="text-xs text-slate-500 font-mono">
                              {formatDuration(lesson.duration)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Deskripsi Kursus</h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </div>

              {course.requirements && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">Persyaratan</h3>
                  <p className="text-sm text-slate-600">{course.requirements}</p>
                </div>
              )}
            </div>

            {/* Instructor Profile Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Profil Instruktur</h2>
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    course.instructor.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`
                  }
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {course.instructor.name}
                  </h3>
                  <p className="text-xs text-brand-600 font-semibold">
                    {course.instructor.headline || "Instruktur Ahli di CourseraID"}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed pt-2">
                    {course.instructor.bio ||
                      "Praktisi industri berpengalaman yang berfokus pada pengajaran materi teknologi terkini."}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Ulasan & Rating Siswa</h2>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span className="text-lg font-black text-slate-900">4.9</span>
                  <span className="text-xs text-slate-400">
                    ({course.reviews.length || 24} ulasan)
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 space-y-4">
                {course.reviews.length > 0 ? (
                  course.reviews.map((rev) => (
                    <div key={rev.id} className="pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              rev.user.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user.name}`
                            }
                            alt={rev.user.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-sm font-bold text-slate-800">
                            {rev.user.name}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-4">
                    Belum ada ulasan untuk kursus ini. Jadilah yang pertama memberikan ulasan!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Enrollment Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-6">
              {/* Media Thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    course.thumbnail ||
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-brand-600 flex items-center justify-center shadow-lg">
                    <PlayCircle className="w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Biaya Investasi Belajar:
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {formatRupiah(course.price)}
                </div>
              </div>

              {/* Action Button */}
              <EnrollButton
                courseId={course.id}
                isEnrolled={isEnrolled}
                price={course.price}
              />

              {/* Course includes */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Fasilitas Yang Anda Dapatkan:
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-brand-500" />
                    <span>{formatDuration(totalDurationSeconds)} video pembelajaran on-demand</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-500" />
                    <span>Materi & sumber daya kode dapat diunduh</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Sertifikat Kelulusan Terverifikasi Digital</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Akses seumur hidup ke materi kursus</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

