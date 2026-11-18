"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Award,
  BookOpen,
  Clock,
  Menu,
  X,
  FileQuestion,
  HelpCircle,
  Lightbulb,
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
    quizzes?: { id: string; title: string; passingScore: number }[];
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
  const allLessons = course.sections.flatMap((s) => s.lessons);
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

        if (newStatus && hasNext) {
          setTimeout(() => {
            setActiveLesson(allLessons[currentLessonIndex + 1]);
          }, 400);
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
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-all hover:scale-[1.02] active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <span className="text-slate-700">|</span>
          <h1 className="text-sm font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
            {course.title}
          </h1>
        </div>

        {/* Progress & Quiz / Certificate Action */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400">Progres Bacaan:</span>
            <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${courseProgress}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-brand-400 font-mono">
              {courseProgress}%
            </span>
          </div>

          {certCode ? (
            <Link
              href={`/certificate/${certCode}`}
              className="px-3.5 py-1.5 bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.03] active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Sertifikat Anda</span>
            </Link>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-amber-400/90 font-medium bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-lg">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Lulus kuis min 75% untuk sertifikat</span>
            </span>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Daftar Materi"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Study Arena */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Interactive Written Material Viewer */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-8">
            {/* Header Pelajaran */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
                  Modul Teori & Pembahasan
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  Estimasi Baca: {formatDuration(activeLesson?.duration || 420)}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {activeLesson?.title || "Pilih Pelajaran"}
              </h2>

              <p className="text-xs text-slate-400">
                Pendidik: <span className="text-slate-200 font-semibold">{course.instructor.name}</span>
              </p>
            </div>

            {/* Konten Tertulis Modul Pelajaran */}
            <article className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-slate-200 leading-relaxed text-sm sm:text-base">
              {activeLesson?.description ? (
                <div className="space-y-4 whitespace-pre-line font-normal text-slate-300">
                  {activeLesson.description}
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  Konten bacaan modul sedang diperbarui oleh pengajar.
                </p>
              )}

              {/* Study Tip Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-brand-950/40 border border-brand-800/50 flex items-start gap-3 text-xs sm:text-sm text-brand-200">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Tips Belajar Matematika:</strong>
                  Pahami konsep dasarnya terlebih dahulu, catat rumus penting, dan coba selesaikan contoh soal secara mandiri sebelum melangkah ke Kuis Evaluasi.
                </div>
              </div>
            </article>

            {/* Bottom Actions Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={toggleLessonCompletion}
                disabled={isUpdating}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md ${
                  isCurrentCompleted
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-brand-500 hover:bg-brand-600 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isCurrentCompleted ? "Sudah Dipelajari (Tandai Belum)" : "Tandai Selesai Dipelajari"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  disabled={!hasPrevious}
                  onClick={() => setActiveLesson(allLessons[currentLessonIndex - 1])}
                  className="px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Sebelumnya
                </button>

                <button
                  disabled={!hasNext}
                  onClick={() => setActiveLesson(allLessons[currentLessonIndex + 1])}
                  className="px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-95"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>

            {/* Direct CTA to Quiz */}
            <div className="bg-gradient-to-r from-purple-950/60 via-slate-950 to-brand-950/60 border border-purple-800/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Sudah Menguasai Seluruh Materi?</h4>
                  <p className="text-xs text-slate-400">
                    Kerjakan 15 soal kuis evaluasi untuk menguji pemahaman dan raih sertifikat (min. 75%).
                  </p>
                </div>
              </div>
              <Link
                href={`/murid/dashboard`}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 shrink-0"
              >
                Buka Kuis di Dashboard
              </Link>
            </div>
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
            <span className="text-xs text-slate-500 font-mono">
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
                        className={`w-full text-left p-3 rounded-xl text-xs flex items-center justify-between transition-all duration-150 hover:scale-[1.01] active:scale-95 ${
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
