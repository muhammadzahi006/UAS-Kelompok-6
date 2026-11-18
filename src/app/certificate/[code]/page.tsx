import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Award, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import PrintButton from "@/components/certificate/PrintButton";
import EduvibeLogo from "@/components/layout/EduvibeLogo";

interface CertificatePageProps {
  params: {
    code: string;
  };
}

export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }: CertificatePageProps) {
  const certificate = await prisma.certificate.findUnique({
    where: { certificateCode: params.code },
    include: {
      user: {
        select: { name: true, email: true },
      },
      course: {
        include: {
          instructor: {
            select: { name: true, headline: true },
          },
        },
      },
    },
  });

  if (!certificate) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation / Action bar */}
        <div className="flex items-center justify-between no-print">
          <Link
            href="/murid/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all hover:scale-[1.02] active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Siswa</span>
          </Link>

          <PrintButton />
        </div>

        {/* Certificate Card (Paper Style) */}
        <div className="relative bg-white p-10 sm:p-16 rounded-3xl border-8 border-slate-200/90 shadow-2xl overflow-hidden print:border-none print:shadow-none print:m-0 print:p-8">
          {/* Decorative Corner Borders */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-brand-500 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-brand-500 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-brand-500 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-brand-500 rounded-br-lg"></div>

          {/* Certificate Content */}
          <div className="text-center space-y-8 relative z-10">
            {/* Header / Logo */}
            <div className="flex items-center justify-center gap-2.5">
              <EduvibeLogo size={42} />
              <span className="text-3xl font-black tracking-tight text-slate-900">
                Edu<span className="text-brand-500">vibe</span>
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] font-extrabold text-brand-600 mb-2">
                Sertifikat Kelulusan & Kompetensi Matematika SMA
              </p>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
                Certificate of Academic Excellence
              </h1>
            </div>

            {/* Recipient */}
            <div className="space-y-2 py-4">
              <p className="text-xs text-slate-500 font-medium">
                Diberikan dengan hormat dan bangga kepada:
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-700 underline decoration-brand-200 decoration-4 underline-offset-8">
                {certificate.user.name}
              </h2>
            </div>

            {/* Course Details */}
            <div className="max-w-xl mx-auto space-y-2">
              <p className="text-xs text-slate-500">
                Telah berhasil mempelajari seluruh materi dan lulus Ujian Evaluasi Kuis Matematika dengan capaian nilai di atas ambang batas kelulusan (passing grade minimal 75%) pada kursus:
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {certificate.course.title}
              </h3>
            </div>

            {/* Signatures & Verification */}
            <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end border-t border-slate-200">
              {/* Instructor signature */}
              <div className="text-center space-y-1">
                <div className="h-10 flex items-center justify-center text-slate-400 font-serif italic text-lg border-b border-slate-300 pb-1">
                  {certificate.course.instructor.name}
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {certificate.course.instructor.name}
                </p>
                <p className="text-[10px] text-slate-500">Guru / Pengampu Materi</p>
              </div>

              {/* Gold Seal */}
              <div className="hidden sm:flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-900 flex items-center justify-center shadow-lg border-4 border-amber-200">
                  <Award className="w-8 h-8 text-amber-950" />
                </div>
                <span className="text-[10px] font-bold text-amber-700 mt-2 uppercase tracking-wider">
                  Terverifikasi Lulus Kuis
                </span>
              </div>

              {/* Platform Verification */}
              <div className="text-center space-y-1">
                <div className="h-10 flex items-center justify-center text-xs font-mono text-slate-600 border-b border-slate-300 pb-1">
                  {new Date(certificate.issuedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <p className="text-xs font-bold text-slate-800">Tanggal Kelulusan</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  No. Sertifikat: {certificate.certificateCode}
                </p>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                Sertifikat ini sah dan tercatat resmi dalam sistem basis data Eduvibe.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
