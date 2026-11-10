"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
    >
      <Printer className="w-4 h-4" />
      <span>Cetak / Simpan PDF</span>
    </button>
  );
}

