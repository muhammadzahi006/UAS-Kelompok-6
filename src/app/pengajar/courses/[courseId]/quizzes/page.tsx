"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";

interface Option {
  id?: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  explanation?: string;
  weight: number;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  _count?: { questions: number; attempts: number };
  questions?: Question[];
}

interface AttemptStudent {
  id: string;
  score: number;
  isPassed: boolean;
  createdAt: string;
  user: { id: string; name: string; email: string; avatar?: string };
}

interface QuizWithAttempts {
  id: string;
  title: string;
  attempts: AttemptStudent[];
  _count: { questions: number };
}

export default function PengajarQuizPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizWithAttempts[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"kelola" | "hasil">("kelola");
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: "", description: "", passingScore: 70 });
  const [savingQuiz, setSavingQuiz] = useState(false);

  const [addingQTo, setAddingQTo] = useState<string | null>(null);
  const [qForm, setQForm] = useState({
    text: "",
    explanation: "",
    weight: 1,
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });
  const [savingQ, setSavingQ] = useState(false);

  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/quizzes`);
      const data = await res.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch {
      setError("Gagal memuat daftar kuis");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/quiz-results`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setError("Gagal memuat hasil kuis");
    }
  }, [courseId]);

  useEffect(() => {
    fetchQuizzes();
    fetchResults();
  }, [fetchQuizzes, fetchResults]);

  const fetchQuizDetail = async (quizId: string) => {
    const res = await fetch(`/api/quizzes/${quizId}`);
    const data = await res.json();
    setQuizzes((prev) =>
      prev.map((q) => (q.id === quizId ? { ...q, questions: data.questions } : q))
    );
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingQuiz(true);
    setError("");
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quizForm, courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat kuis");
        return;
      }
      setSuccess("Kuis berhasil dibuat!");
      setShowQuizForm(false);
      setQuizForm({ title: "", description: "", passingScore: 70 });
      await fetchQuizzes();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSavingQuiz(false);
    }
  };

  const handleAddQuestion = async (quizId: string) => {
    setSavingQ(true);
    setError("");
    const correctCount = qForm.options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      setError("Tandai tepat 1 pilihan sebagai jawaban benar");
      setSavingQ(false);
      return;
    }
    const filledOptions = qForm.options.filter((o) => o.text.trim());
    if (filledOptions.length !== 4) {
      setError("Isi semua 4 pilihan jawaban");
      setSavingQ(false);
      return;
    }

    try {
      const res = await fetch(`/api/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: qForm.text,
          explanation: qForm.explanation,
          weight: qForm.weight,
          options: filledOptions,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menambah pertanyaan");
        return;
      }
      setSuccess("Pertanyaan berhasil ditambahkan!");
      setAddingQTo(null);
      setQForm({
        text: "",
        explanation: "",
        weight: 1,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      });
      await fetchQuizDetail(quizId);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSavingQ(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Yakin hapus kuis ini? Semua soal dan hasil akan ikut terhapus.")) return;
    try {
      const res = await fetch(`/api/quizzes/${quizId}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Kuis berhasil dihapus");
        await fetchQuizzes();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch {
      setError("Gagal menghapus kuis");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-brand-500" />
              Manajemen Kuis
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Buat kuis pilihan ganda dan lihat hasil belajar peserta
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("kelola")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeTab === "kelola"
                  ? "bg-brand-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-1.5" />
              Kelola Kuis
            </button>
            <button
              onClick={() => setActiveTab("hasil")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeTab === "hasil"
                  ? "bg-brand-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Users className="w-4 h-4 inline mr-1.5" />
              Hasil Peserta
            </button>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-2 text-emerald-700 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700">✕</button>
          </div>
        )}

        {/* TAB: Kelola Kuis */}
        {activeTab === "kelola" && (
          <div className="space-y-6">
            {/* Create Quiz Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowQuizForm(!showQuizForm)}
                className="px-4 py-2.5 bg-brand-500 text-white font-bold rounded-xl text-sm hover:bg-brand-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Buat Kuis Baru
              </button>
            </div>

            {/* Quiz Form */}
            {showQuizForm && (
              <div className="bg-white rounded-2xl border border-brand-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Buat Kuis Baru</h3>
                <form onSubmit={handleCreateQuiz} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Judul Kuis *
                    </label>
                    <input
                      type="text"
                      value={quizForm.title}
                      onChange={(e) => setQuizForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Contoh: Kuis Akhir Modul 1"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      value={quizForm.description}
                      onChange={(e) => setQuizForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Deskripsi singkat tentang kuis ini"
                      rows={2}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nilai Minimum Lulus (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={quizForm.passingScore}
                      onChange={(e) =>
                        setQuizForm((p) => ({ ...p, passingScore: Number(e.target.value) }))
                      }
                      className="w-32 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingQuiz}
                      className="px-5 py-2 bg-brand-500 text-white font-bold rounded-xl text-sm hover:bg-brand-600 transition-colors disabled:opacity-70"
                    >
                      {savingQuiz ? "Menyimpan..." : "Simpan Kuis"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQuizForm(false)}
                      className="px-5 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Quiz List */}
            {quizzes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-semibold">Belum Ada Kuis</p>
                <p className="text-slate-400 text-sm mt-1">Buat kuis pertama untuk kursus ini</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">{quiz.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {quiz._count?.questions || 0} soal · Minimum lulus:{" "}
                          {quiz.passingScore}% · {quiz._count?.attempts || 0} percobaan
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (expandedQuiz === quiz.id) {
                              setExpandedQuiz(null);
                            } else {
                              setExpandedQuiz(quiz.id);
                              fetchQuizDetail(quiz.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-200 transition-colors flex items-center gap-1"
                        >
                          {expandedQuiz === quiz.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          {expandedQuiz === quiz.id ? "Tutup" : "Kelola Soal"}
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus kuis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {expandedQuiz === quiz.id && (
                      <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50">
                        {/* Questions */}
                        {quiz.questions && quiz.questions.length > 0 ? (
                          <div className="space-y-3">
                            {quiz.questions.map((q, idx) => (
                              <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4">
                                <p className="font-semibold text-slate-900 text-sm mb-2">
                                  {idx + 1}. {q.text}
                                </p>
                                <div className="space-y-1.5">
                                  {q.options.map((opt, oi) => (
                                    <div
                                      key={opt.id}
                                      className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                                        opt.isCorrect
                                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                                          : "text-slate-600"
                                      }`}
                                    >
                                      <span className="font-bold">
                                        {String.fromCharCode(65 + oi)}.
                                      </span>
                                      {opt.text}
                                      {opt.isCorrect && (
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {q.explanation && (
                                  <p className="text-xs text-blue-600 mt-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                                    💡 {q.explanation}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 text-center py-4">
                            Belum ada soal. Tambahkan soal pertama!
                          </p>
                        )}

                        {/* Add Question Form */}
                        {addingQTo === quiz.id ? (
                          <div className="bg-white rounded-xl border border-brand-200 p-4 space-y-4">
                            <h4 className="font-bold text-slate-900 text-sm">Tambah Soal Baru</h4>
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Teks Pertanyaan *
                              </label>
                              <textarea
                                value={qForm.text}
                                onChange={(e) => setQForm((p) => ({ ...p, text: e.target.value }))}
                                placeholder="Tulis pertanyaan di sini..."
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-700">
                                Pilihan Jawaban (centang yang benar) *
                              </label>
                              {qForm.options.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={opt.isCorrect}
                                    onChange={(e) =>
                                      setQForm((p) => ({
                                        ...p,
                                        options: p.options.map((o, i) =>
                                          i === idx ? { ...o, isCorrect: e.target.checked } : o
                                        ),
                                      }))
                                    }
                                    className="w-4 h-4 accent-brand-500 cursor-pointer"
                                  />
                                  <span className="text-xs font-bold text-slate-500 w-5">
                                    {String.fromCharCode(65 + idx)}.
                                  </span>
                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) =>
                                      setQForm((p) => ({
                                        ...p,
                                        options: p.options.map((o, i) =>
                                          i === idx ? { ...o, text: e.target.value } : o
                                        ),
                                      }))
                                    }
                                    placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                                  />
                                </div>
                              ))}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Penjelasan (opsional)
                              </label>
                              <input
                                type="text"
                                value={qForm.explanation}
                                onChange={(e) => setQForm((p) => ({ ...p, explanation: e.target.value }))}
                                placeholder="Jelaskan mengapa jawaban tersebut benar"
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">Bobot soal</label>
                              <input type="number" min={1} max={100} value={qForm.weight} onChange={(e) => setQForm((p) => ({ ...p, weight: Number(e.target.value) }))} className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm" />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddQuestion(quiz.id)}
                                disabled={savingQ}
                                className="px-4 py-1.5 bg-brand-500 text-white font-bold rounded-lg text-xs hover:bg-brand-600 transition-colors disabled:opacity-70"
                              >
                                {savingQ ? "Menyimpan..." : "Simpan Soal"}
                              </button>
                              <button
                                onClick={() => setAddingQTo(null)}
                                className="px-4 py-1.5 border border-slate-200 text-slate-600 font-bold rounded-lg text-xs hover:bg-slate-50 transition-colors"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAddingQTo(quiz.id)}
                            className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-brand-300 hover:text-brand-500 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Tambah Soal Baru
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Hasil Peserta */}
        {activeTab === "hasil" && (
          <div className="space-y-6">
            {results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-semibold">Belum Ada Hasil Kuis</p>
                <p className="text-slate-400 text-sm mt-1">
                  Hasil akan muncul setelah peserta mengerjakan kuis
                </p>
              </div>
            ) : (
              results.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 bg-slate-50 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">{quiz.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {quiz._count.questions} soal · {quiz.attempts.length} percobaan
                    </p>
                  </div>

                  {quiz.attempts.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-400">
                      Belum ada peserta yang mengerjakan kuis ini
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              Peserta
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
                          {quiz.attempts.map((attempt) => (
                            <tr key={attempt.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={
                                      attempt.user.avatar ||
                                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${attempt.user.name}`
                                    }
                                    alt={attempt.user.name}
                                    className="w-7 h-7 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-semibold text-slate-900 text-xs">
                                      {attempt.user.name}
                                    </p>
                                    <p className="text-slate-400 text-xs">{attempt.user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="font-black text-lg text-slate-900">
                                  {Math.round(attempt.score)}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    attempt.isPassed
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {attempt.isPassed ? "✓ Lulus" : "✗ Belum Lulus"}
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
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
