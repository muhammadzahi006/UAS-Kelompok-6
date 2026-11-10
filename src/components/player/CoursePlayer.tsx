"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Award,
  BookOpen,
  FileText,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  duration: number;
  order: number;
  isPreview: boolean;
  attachments?: string | null;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CoursePlayerProps {
  course: {
    id: string;
    title: string;
    slug: string;
    sections: Section[];
    instructor: {
      name: string;
    };
  };
  initialProgressMap: Record<string, boolean>;
  initialCourseProgress: number;
  initialCertCode?: string | null;
}

export default function CoursePlayer({
  course,
  initialProgressMap,
  initialCourseProgress,
  initialCertCode,
}: CoursePlayerProps) {
  // Flatten all lessons
  const allLessons = course.sections.flatMap((s) => s.lessons);

  // Find first uncompleted lesson or first lesson
  const firstPendingLesson =
    allLessons.find((l) => !initialProgressMap[l.id]) || allLessons[0];

  const [activeLesson, setActiveLesson] = useState<Lesson>(
    firstPendingLesson || allLessons[0]
  );
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>(
    initialProgressMap
  );
  const [courseProgress, setCourseProgress] = useState(initialCourseProgress);
  const [certCode, setCertCode] = useState<string | null>(initialCertCode || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "resources">("overview");

  const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  const isCurrentCompleted = progressMap[activeLesson?.id] || false;

  const toggleLessonCompletion = async () => {
    if (!activeLesson || isUpdating) return;

    setIsUpdating(true);
    const newStatus = !isCurrentCompleted;

    try {
      const res = await fetch(`/api/lessons/${activeLesson.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setProgressMap((prev) => ({
          ...prev,
          [activeLesson.id]: newStatus,
        }));
        setCourseProgress(data.courseProgress);

        if (data.certificateCode) {
          setCertCode(data.certificateCode);
        }

        // Auto advance to next lesson if marked complete
        if (newStatus && hasNext) {
          setTimeout(() => {
            setActiveLesson(allLessons[currentLessonIndex + 1]);
          }, 600);
        }
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900 text-white">
      {/* Top Learning Bar */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/murid/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <span className="text-slate-700">|</span>
          <h1 className="text-sm font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
            {course.title}
          </h1>
        </div>

        {/* Course Progress & Certificate Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${courseProgress}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {courseProgress}%
            </span>
          </div>

          {courseProgress >= 100 && certCode && (
            <Link
              href={`/certificate/${certCode}`}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all animate-pulse"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Lihat Sertifikat</span>
            </Link>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center: Video Player & Lesson Notes */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
          {/* Video Player Box */}
          <div className="relative aspect-video w-full max-h-[65vh] bg-black flex items-center justify-center">
            {activeLesson?.videoUrl ? (
              <video
                key={activeLesson.id}
                controls
                autoPlay
                className="w-full h-full object-contain"
                src={activeLesson.videoUrl}
              >
                Browser Anda tidak mendukung tag video HTML5.
              </video>
            ) : (
              <div className="text-center p-6 space-y-3">
                <PlayCircle className="w-16 h-16 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">
                  Video pelajaran sedang disiapkan oleh pengajar di Cloudflare R2.
                </p>
              </div>
            )}
          </div>

          {/* Player Controls Bar */}
          <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-400">
                  Pelajaran {currentLessonIndex + 1} dari {allLessons.length}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(activeLesson?.duration || 0)}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {activeLesson?.title}
              </h2>
            </div>

            {/* Actions: Mark Completed & Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLessonCompletion}
                disabled={isUpdating}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isCurrentCompleted
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                {isCurrentCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Selesai Dipelajari</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-slate-400" />
                    <span>Tandai Selesai</span>
                  </>
                )}
              </button>

              <button
                disabled={!hasPrevious}
                onClick={() => setActiveLesson(allLessons[currentLessonIndex - 1])}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="Pelajaran Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                disabled={!hasNext}
                onClick={() => setActiveLesson(allLessons[currentLessonIndex + 1])}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold disabled:opacity-40 transition-colors shadow-sm"
                title="Pelajaran Selanjutnya"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lesson Details & Resources Tabs */}
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-6 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab("overview")}
                className={`text-sm font-bold pb-2 transition-colors border-b-2 -mb-3.5 ${
                  activeTab === "overview"
                    ? "border-brand-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Ringkasan Pelajaran
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`text-sm font-bold pb-2 transition-colors border-b-2 -mb-3.5 ${
                  activeTab === "resources"
                    ? "border-brand-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Materi Unduhan & Catatan
              </button>
            </div>

            {activeTab === "overview" && (
              <div className="space-y-4 max-w-3xl">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeLesson?.description ||
                    "Tidak ada deskripsi khusus untuk video pelajaran ini. Ikuti instruksi pada video streaming di atas."}
                </p>
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
                  💡 Tips Belajar: Praktikkan kode secara langsung di editor Anda sembari mengikuti tutorial video untuk hasil maksimal.
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-3 max-w-3xl">
                {activeLesson?.attachments ? (
                  <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-brand-400" />
                      <div>
                        <p className="text-sm font-bold text-white">
                          Sumber Daya Pembelajaran / Source Code
                        </p>
                        <p className="text-xs text-slate-400">
                          Tersimpan di Cloudflare R2
                        </p>
                      </div>
                    </div>
                    <a
                      href={activeLesson.attachments}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Buka Materi
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Tidak ada lampiran berkas khusus untuk modul pelajaran ini.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Syllabus Tree */}
        <aside
          className={`${
            isSidebarOpen ? "w-80 sm:w-96" : "w-0 hidden"
          } transition-all duration-300 shrink-0 border-l border-slate-800 bg-slate-950 flex flex-col`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-500" />
              <span>Daftar Modul & Materi</span>
            </h3>
            <span className="text-xs text-slate-500">
              {allLessons.length} Pelajaran
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {course.sections.map((section) => (
              <div key={section.id} className="p-3">
                <div className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
                <div className="space-y-1 mt-1">
                  {section.lessons.map((lesson) => {
                    const isLessonActive = lesson.id === activeLesson?.id;
                    const isDone = progressMap[lesson.id];

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                          isLessonActive
                            ? "bg-brand-600 text-white font-bold shadow-md"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {isDone ? (
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 ${
                                isLessonActive ? "text-white" : "text-emerald-400"
                              }`}
                            />
                          ) : (
                            <Circle
                              className={`w-4 h-4 shrink-0 ${
                                isLessonActive ? "text-white" : "text-slate-500"
                              }`}
                            />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="font-mono text-[10px] shrink-0 opacity-80">
                          {formatDuration(lesson.duration)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

