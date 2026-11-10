"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import R2FileUploader from "@/components/upload/R2FileUploader";

interface Category {
  id: string;
  name: string;
}

interface CourseFormProps {
  categories: Category[];
  initialData?: any;
}

export default function CourseForm({ categories, initialData }: CourseFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  const [level, setLevel] = useState(initialData?.level || "BEGINNER");
  const [price, setPrice] = useState(initialData?.price ?? 0);
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [objectives, setObjectives] = useState(
    initialData?.objectives ||
      "Membangun aplikasi web fullstack; Integrasi Supabase PostgreSQL; Cloudflare R2 video storage"
  );
  const [requirements, setRequirements] = useState(
    initialData?.requirements || "Pengetahuan dasar HTML, CSS, dan JavaScript."
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const url = initialData?.id
        ? `/api/courses/${initialData.id}`
        : `/api/courses`;
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          categoryId,
          level,
          price: Number(price),
          thumbnail,
          objectives,
          requirements,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan kursus");
      }

      router.push(`/pengajar/courses/${data.id}/curriculum`);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
          Judul Kursus *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="cth: Mastering Full-Stack Next.js 14 & Cloudflare R2"
          className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
          Subjudul / Ringkasan Singkat
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="cth: Pelajari cara membangun web app modern dari nol hingga deploy di Vercel."
          className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
        />
      </div>

      {/* Category, Level, Price in 3 Cols */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
            Kategori
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
            Tingkat Kesulitan
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          >
            <option value="BEGINNER">Pemula (Beginner)</option>
            <option value="INTERMEDIATE">Menengah (Intermediate)</option>
            <option value="ADVANCED">Mahir (Advanced)</option>
            <option value="ALL_LEVELS">Semua Tingkat</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
            Harga (IDR) — 0 untuk Gratis
          </label>
          <input
            type="number"
            min={0}
            step={10000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Cloudflare R2 Thumbnail Uploader */}
      <R2FileUploader
        label="Sampul / Thumbnail Kursus (Cloudflare R2)"
        accept="image/*"
        currentValue={thumbnail}
        onUploadSuccess={(url) => setThumbnail(url)}
        helperText="Gambar disimpan langsung di bucket Cloudflare R2 dan dioptimalkan untuk performa Vercel."
      />

      {/* Objectives */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
          Tujuan Belajar / Yang Akan Dipelajari (Pisahkan dengan tanda titik koma ;)
        </label>
        <textarea
          rows={3}
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          placeholder="Membangun web app; Menghubungkan Supabase; Mengunggah file ke Cloudflare R2"
          className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
          Persyaratan Kursus
        </label>
        <input
          type="text"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="cth: Laptop dengan koneksi internet dan pemahaman dasar JavaScript."
          className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
          Deskripsi Lengkap Kursus *
        </label>
        <textarea
          rows={6}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan secara mendalam tentang apa yang akan dipelajari siswa, keunggulan kursus ini, dan proyek yang akan dikerjakan..."
          className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
        />
      </div>

      {/* Submit */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan Kursus...</span>
            </>
          ) : (
            <>
              <span>Simpan & Lanjut ke Kurikulum</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

