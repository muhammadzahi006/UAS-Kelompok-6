"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  Trophy,
  RefreshCw,
  Clock,
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
}

export default function QuizPage({
  params,
}: {
  params: { courseId: string; quizId: string };
}) {
  const router = useRouter();
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
      setError(`Masih ada ${unanswered.length} soal yang belum dijawab`);
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
          <p className="text-slate-600 font-medium">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <p className="text-slate-700 font-semibold">{error}</p>
          <Link href={`/murid/dashboard`} className="text-brand-500 hover:underline text-sm">
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
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div
            className={`rounded-3xl p-8 text-center shadow-lg border ${
              result.isPassed
                ? "bg-emerald-50 border-emerald-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex justify-center mb-4">
              {result.isPassed ? (
                <Trophy className="w-20 h-20 text-amber-400" />
              ) : (
                <XCircle className="w-20 h-20 text-red-400" />
              )}
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {result.isPassed ? "🎉 Selamat, Lulus!" : "Belum Lulus"}
            </h2>
            <p className="text-slate-600 mb-6">{quiz.title}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-4 border border-slate-100">
                <p className="text-3xl font-black text-slate-900">{result.score}%</p>
                <p className="text-xs text-slate-500 mt-1">Nilai Anda</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-100">
                <p className="text-3xl font-black text-emerald-600">{result.correctCount}</p>
                <p className="text-xs text-slate-500 mt-1">Jawaban Benar</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-100">
                <p className="text-3xl font-black text-slate-700">{result.passingScore}%</p>
                <p className="text-xs text-slate-500 mt-1">Nilai Minimum</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/murid/dashboard"
                className="px-5 py-2.5 bg-brand-500 text-white font-bold rounded-xl text-sm hover:bg-brand-600 transition-colors"
              >
                Lihat Dashboard Saya
              </Link>
              {!result.isPassed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                    setCurrentQ(0);
                  }}
                  className="px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl text-sm border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Coba Lagi
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
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900">{quiz.title}</h1>
            <p className="text-xs text-slate-500">
              {quiz.course.title} · Nilai minimal lulus: {quiz.passingScore}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-semibold">
              Soal {currentQ + 1} dari {totalQ}
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {answered} dari {totalQ} dijawab
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-500 text-white text-sm font-black flex items-center justify-center">
                {currentQ + 1}
              </span>
              <p className="text-base font-semibold text-slate-900 leading-relaxed">
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
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      isSelected
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-slate-300 text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-medium text-sm">{option.text}</span>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 ml-auto text-brand-500 flex-shrink-0" />
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
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
            >
              ← Sebelumnya
            </button>
          )}

          {currentQ < totalQ - 1 ? (
            <button
              onClick={() => setCurrentQ((p) => p + 1)}
              className="px-5 py-2.5 bg-brand-500 text-white font-bold rounded-xl text-sm hover:bg-brand-600 transition-colors ml-auto"
            >
              Berikutnya →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-colors ml-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Kumpulkan Jawaban
                </>
              )}
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-600 mb-3">Navigasi Soal</p>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQ(idx)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  idx === currentQ
                    ? "bg-brand-500 text-white"
                    : answers[q.id]
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
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
