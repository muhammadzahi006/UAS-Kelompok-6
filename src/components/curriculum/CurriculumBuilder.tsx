"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PlusCircle,
  PlayCircle,
  Clock,
  CheckCircle2,
  Eye,
  Loader2,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import R2FileUploader from "@/components/upload/R2FileUploader";

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

interface CurriculumBuilderProps {
  course: {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
    sections: Section[];
  };
}

export default function CurriculumBuilder({ course }: CurriculumBuilderProps) {
  const router = useRouter();

  const [sections, setSections] = useState<Section[]>(course.sections);
  const [isPublished, setIsPublished] = useState(course.isPublished);
  const [isPublishing, setIsPublishing] = useState(false);

  // New section state
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);

  // New lesson modal state
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonDuration, setLessonDuration] = useState(300);
  const [lessonIsPreview, setLessonIsPreview] = useState(false);
  const [lessonAttachments, setLessonAttachments] = useState("");
  const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);

  // Toggle publish
  const handleTogglePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (res.ok) {
        setIsPublished(!isPublished);
        router.refresh();
      }
    } catch (err) {
      alert("Gagal mengubah status publikasi.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Add Section
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;

    setIsSubmittingSection(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: sectionTitle.trim() }),
      });

      if (res.ok) {
        const newSec = await res.json();
        setSections([...sections, { ...newSec, lessons: [] }]);
        setSectionTitle("");
        setIsAddingSection(false);
        router.refresh();
      }
    } catch (err) {
      alert("Gagal menambah modul.");
    } finally {
      setIsSubmittingSection(false);
    }
  };

  // Add Lesson
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSectionId || !lessonTitle.trim()) return;

    setIsSubmittingLesson(true);
    try {
      const res = await fetch(`/api/sections/${activeSectionId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lessonTitle.trim(),
          description: lessonDesc.trim(),
          videoUrl: lessonVideoUrl.trim(),
          duration: lessonDuration,
          isPreview: lessonIsPreview,
          attachments: lessonAttachments.trim(),
        }),
      });

      if (res.ok) {
        const newLesson = await res.json();
        setSections((prev) =>
          prev.map((sec) =>
            sec.id === activeSectionId
              ? { ...sec, lessons: [...sec.lessons, newLesson] }
              : sec
          )
        );
        // Reset modal form
        setLessonTitle("");
        setLessonDesc("");
        setLessonVideoUrl("");
        setLessonDuration(300);
        setLessonIsPreview(false);
        setLessonAttachments("");
        setActiveSectionId(null);
        router.refresh();
      }
    } catch (err) {
      alert("Gagal menambah pelajaran.");
    } finally {
      setIsSubmittingLesson(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                isPublished
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPublished ? "Status: Terbit (Aktif)" : "Status: Draf (Belum Terbit)"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Kurikulum Kursus: {course.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Susun modul materi dan upload video pembelajaran Anda ke Cloudflare R2 storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            target="_blank"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Lihat Publik</span>
          </Link>

          <button
            onClick={handleTogglePublish}
            disabled={isPublishing}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 ${
              isPublished
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{isPublished ? "Tarik Jadi Draf" : "Terbitkan Kursus"}</span>
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  {section.title}
                </h3>
                <span className="text-xs text-slate-500">
                  ({section.lessons.length} Pelajaran)
                </span>
              </div>

              <button
                onClick={() => setActiveSectionId(section.id)}
                className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Tambah Pelajaran</span>
              </button>
            </div>

            {/* Lessons List inside Section */}
            <div className="p-5 divide-y divide-slate-100">
              {section.lessons.length > 0 ? (
                section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayCircle className="w-5 h-5 text-brand-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
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
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                          Pratinjau Gratis
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(lesson.duration)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-3 italic">
                  Belum ada pelajaran di modul ini. Klik tombol Tambah Pelajaran di atas.
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Add Section Box */}
        {isAddingSection ? (
          <form
            onSubmit={handleAddSection}
            className="bg-white p-6 rounded-3xl border border-brand-300 shadow-sm space-y-4"
          >
            <h4 className="font-bold text-sm text-slate-900">
              Tambah Modul / Bagian Baru
            </h4>
            <input
              type="text"
              required
              autoFocus
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="cth: Modul 2: Autentikasi & Database Prisma"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmittingSection}
                className="px-4 py-2 bg-brand-500 text-white font-bold text-xs rounded-xl hover:bg-brand-600 transition-colors"
              >
                {isSubmittingSection ? "Menyimpan..." : "Simpan Modul"}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSection(false)}
                className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingSection(true)}
            className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/50 rounded-3xl text-sm font-bold text-slate-600 hover:text-brand-600 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Tambah Modul / Bagian Baru</span>
          </button>
        )}
      </div>

      {/* Add Lesson Modal */}
      {activeSectionId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Tambah Pelajaran Video Baru
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Video materi akan di-streaming dengan latensi rendah melalui Cloudflare R2.
              </p>
            </div>

            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Judul Pelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="cth: Pengenalan Server Actions di Next.js"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Deskripsi / Catatan Singkat
                </label>
                <textarea
                  rows={2}
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  placeholder="Ringkasan poin yang dibahas pada video ini..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              {/* Cloudflare R2 Video Upload */}
              <R2FileUploader
                label="Unggah Video Pelajaran (Cloudflare R2)"
                accept="video/*"
                currentValue={lessonVideoUrl}
                onUploadSuccess={(url) => setLessonVideoUrl(url)}
                helperText="Format didukung: MP4, WebM. Disimpan langsung di Cloudflare R2 Bucket."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Durasi (Detik)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    ≈ {formatDuration(lessonDuration)}
                  </span>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={lessonIsPreview}
                      onChange={(e) => setLessonIsPreview(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                    />
                    <span>Gratis Pratinjau (Preview)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Tautan Lampiran Materi / Source Code (Opsional)
                </label>
                <input
                  type="text"
                  value={lessonAttachments}
                  onChange={(e) => setLessonAttachments(e.target.value)}
                  placeholder="https://github.com/... atau tautan materi R2"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSectionId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLesson}
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  {isSubmittingLesson ? "Menyimpan Pelajaran..." : "Simpan Pelajaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

