import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CourseForm from "@/components/courses/CourseForm";

export const dynamic = "force-dynamic";

export default async function CreateCoursePage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "PENGAJAR" && user.role !== "ADMIN")) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Buat Kursus Baru
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Langkah 1: Lengkapi informasi umum kursus. Setelah ini, Anda dapat menyusun modul dan materi video di Langkah 2.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <CourseForm categories={categories} />
        </div>
      </div>
    </div>
  );
}

