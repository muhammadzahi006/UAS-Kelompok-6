"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";

interface ReviewFormProps {
  courseId: string;
  isEnrolled: boolean;
  userReview?: {
    rating: number;
    comment: string;
  } | null;
}

export default function ReviewForm({
  courseId,
  isEnrolled,
  userReview,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(userReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(userReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isEnrolled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/courses/${courseId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengirim ulasan.");
      }

      setIsSubmitted(true);
      router.refresh();
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-6">
      <h4 className="font-bold text-sm text-slate-800 mb-2">
        {userReview ? "Perbarui Ulasan Anda" : "Beri Ulasan & Rating Anda"}
      </h4>

      {isSubmitted && (
        <div className="mb-3 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Terima kasih! Ulasan Anda berhasil disimpan.</span>
        </div>
      )}

      {errorMsg && (
        <p className="mb-2 text-xs text-red-600 font-medium">{errorMsg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Star Rating Picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-600 font-medium mr-1">Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-5 h-5 ${
                  (hoverRating || rating) >= star
                    ? "fill-amber-400 stroke-amber-500"
                    : "stroke-slate-300 fill-transparent"
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-amber-600 ml-2">
            {rating} / 5
          </span>
        </div>

        {/* Comment textarea */}
        <textarea
          rows={3}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan pengalaman belajar Anda, materi yang paling membantu, dan saran..."
          className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Ulasan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
