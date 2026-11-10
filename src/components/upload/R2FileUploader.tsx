"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";

interface R2FileUploaderProps {
  label: string;
  accept: string;
  currentValue?: string;
  onUploadSuccess: (url: string) => void;
  helperText?: string;
}

export default function R2FileUploader({
  label,
  accept,
  currentValue,
  onUploadSuccess,
  helperText = "File akan disimpan secara aman di Cloudflare R2 bucket.",
}: R2FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentValue || "");
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Gagal mengupload file ke Cloudflare R2.");
      }

      const data = await res.json();
      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Upload gagal");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase text-slate-700">
        {label}
      </label>

      <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl p-4 transition-colors bg-slate-50/50 flex flex-col items-center justify-center text-center">
        {previewUrl ? (
          <div className="space-y-3 w-full flex flex-col items-center">
            {accept.includes("image") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-48 h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="w-48 h-28 object-cover rounded-xl border border-slate-200"
              />
            )}
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Aset tersimpan di Cloudflare R2</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 mx-auto flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Pilih file untuk diupload ke Cloudflare R2
            </p>
          </div>
        )}

        <div className="mt-3">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-sm transition-all">
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mengunggah ke R2...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{previewUrl ? "Ganti Berkas" : "Upload dari Komputer"}</span>
              </>
            )}
            <input
              type="file"
              accept={accept}
              disabled={isUploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {uploadError && (
          <p className="mt-2 text-xs text-red-600 font-medium">{uploadError}</p>
        )}

        <p className="mt-2 text-[10px] text-slate-400">{helperText}</p>
      </div>
    </div>
  );
}

