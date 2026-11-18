"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  Trophy,
  RefreshCw,
  Clock,
  Award,
} from "lucide-react";

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  text: string;
  explanation?: string;
  order: number;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  questions: Question[];
  course: { title: string; slug: string };
}

interface QuizResult {
  score: number;
  isPassed: boolean;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
  attemptId: string;
  certificateCode?: string | null;
}

export default function QuizPage({
  params,
}: {
  params: { courseId: string; quizId: string };
}) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => {
    fetch(`/api/quizzes/${params.quizId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setQuiz(data);
        }
      })
      .catch(() => setError("Gagal memuat kuis"))
      .finally(() => setLoading(false));
  }, [params.quizId]);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const unanswered = quiz.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setError(`Masih ada ${unanswered.length} soal yang belum dijawab.`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id],
      }));

      const res = await fetch(`/api/quizzes/${params.quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengirim jawaban");
        return;
      }

      setResult(data);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">Memuat soal kuis evaluasi...</p>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <p className="text-slate-800 font-bold">{error}</p>
          <Link
            href="/murid/dashboard"
            className="inline-block px-5 py-2.5 bg-brand-500 text-white font-bold rounded-xl text-xs hover:bg-brand-600 transition-all hover:scale-[1.02] active:scale-95"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  // Tampilan Hasil
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div
            className={`rounded-3xl p-8 sm:p-10 text-center shadow-xl border ${
              result.isPassed
                ? "bg-emerald-50/90 border-emerald-300"
                : "bg-red-50/90 border-red-300"
            }`}
          >
            <div className="flex justify-center mb-4">
              {result.isPassed ? (
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-md">
                  <Trophy className="w-10 h-10 text-amber-500" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-md">
                  <XCircle className="w-10 h-10" />
                </div>
              )}
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {result.isPassed ? "🎉 Selamat! Anda Lulus Kuis" : "Belum Memenuhi Passing Grade"}
            </h2>
            <p className="text-slate-600 text-sm mb-6 max-w-lg mx-auto">
              {result.isPassed
                ? `Luar biasa! Anda mencapai nilai ${result.score}% (di atas batas minimum 75%). Sertifikat resmi kelulusan telah diterbitkan!`
                : `Anda memperoleh nilai ${result.score}%. Syarat kelulusan sertifikat adalah minimal 75%. Pelajari kembali materi modul dan ulangi kuis.`}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                <p className="text-3xl font-black text-slate-900">{result.score}%</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Nilai Anda</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                <p className="text-3xl font-black text-emerald-600">{result.correctCount} / {result.totalQuestions}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Jawaban Benar</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                <p className="text-3xl font-black text-slate-700">75%</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Passing Grade</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center flex-wrap pt-2">
              {result.isPassed && result.certificateCode && (
                <Link
                  href={`/certificate/${result.certificateCode}`}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm shadow-md transition-all duration-200 hover:scale-[1.03] active:scale-95 flex items-center gap-2"
                >
                  <Award className="w-5 h-5 text-amber-950" />
                  <span>Buka Sertifikat Kelulusan</span>
                </Link>
              )}

              <Link
                href="/murid/dashboard"
                className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                Dashboard Siswa
              </Link>

              {!result.isPassed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                    setCurrentQ(0);
                  }}
                  className="px-5 py-3 bg-white text-slate-700 font-bold rounded-xl text-sm border border-slate-300 hover:bg-slate-50 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Coba Kuis Lagi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const totalQ = quiz.questions.length;
  const answered = Object.keys(answers).length;
  const progress = (answered / totalQ) * 100;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/murid/courses/${params.courseId}/learn`}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-600 transition-all hover:scale-[1.05] active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900">{quiz.title}</h1>
            <p className="text-xs text-slate-500">
              {quiz.course.title} · Passing Grade Kelulusan: <strong className="text-slate-800">75%</strong>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-semibold">
            <span>
              Soal {currentQ + 1} dari {totalQ}
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              {answered} dari {totalQ} terjawab
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        {question && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3.5">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-500 text-white text-sm font-black flex items-center justify-center shadow-sm">
                {currentQ + 1}
              </span>
              <p className="text-base font-semibold text-slate-900 leading-relaxed pt-0.5">
                {question.text}
              </p>
            </div>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = answers[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(question.id, option.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 hover:scale-[1.01] active:scale-95 ${
                      isSelected
                        ? "border-brand-500 bg-brand-50/80 text-brand-800 shadow-sm"
                        : "border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-500 text-white shadow-sm"
                          : "border-slate-300 text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-medium text-sm leading-snug">{option.text}</span>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 ml-auto text-brand-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {currentQ > 0 && (
            <button
              onClick={() => setCurrentQ((p) => p - 1)}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-95"
            >
              ← Soal Sebelumnya
            </button>
          )}

          {currentQ < totalQ - 1 ? (
            <button
              onClick={() => setCurrentQ((p) => p + 1)}
              className="px-6 py-2.5 bg-brand-500 text-white font-bold rounded-xl text-sm hover:bg-brand-600 transition-all duration-200 hover:scale-[1.02] active:scale-95 ml-auto shadow-md"
            >
              Soal Berikutnya →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-7 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-500 transition-all duration-200 hover:scale-[1.02] active:scale-95 ml-auto shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengoreksi...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Kirim & Selesaikan Kuis
                </>
              )}
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
            Lembar Jawaban ({answered}/{totalQ} Terisi)
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-15 gap-2">
            {quiz.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQ(idx)}
                className={`h-9 rounded-lg text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 ${
                  idx === currentQ
                    ? "bg-brand-500 text-white shadow-md ring-2 ring-brand-300"
                    : answers[q.id]
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
