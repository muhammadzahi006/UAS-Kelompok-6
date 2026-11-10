import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import CurriculumBuilder from "@/components/curriculum/CurriculumBuilder";

interface CurriculumPageProps {
  params: {
    courseId: string;
  };
}

export const dynamic = "force-dynamic";

export default async function CurriculumPage({ params }: CurriculumPageProps) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "PENGAJAR" && user.role !== "ADMIN")) {
    redirect("/login");
  }

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Check ownership unless admin
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    redirect("/pengajar/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <CurriculumBuilder course={course} />
      </div>
    </div>
  );
}

