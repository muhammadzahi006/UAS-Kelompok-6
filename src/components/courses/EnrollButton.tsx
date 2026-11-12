"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { PlayCircle, ArrowRight, Loader2 } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled: boolean;
  price: number;
}

export default function EnrollButton({
  courseId,
  isEnrolled,
  price,
}: EnrollButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?callbackUrl=/courses`);
      return;
    }

    if (isEnrolled) {
      router.push(`/murid/courses/${courseId}/learn`);
      return;
    }

    setIsLoading(true);
    setStatusText("Mendaftarkan kursus...");

    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Gagal mendaftar");
        setIsLoading(false);
        return;
      }

      setStatusText("Pendaftaran berhasil! Mengalihkan ke kelas...");
      setTimeout(() => {
        router.push(`/murid/courses/${courseId}/learn`);
        router.refresh();
      }, 800);
    } catch (err) {
      alert("Terjadi kesalahan saat pendaftaran.");
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <button
        onClick={handleEnroll}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all group"
      >
        <PlayCircle className="w-5 h-5" />
        <span>Lanjutkan Pembelajaran</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50 group"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{statusText || "Memproses..."}</span>
        </>
      ) : (
        <>
          <span>
            {price === 0 ? "Daftar Kursus Gratis Sekarang" : "Beli & Daftar Kursus"}
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}

