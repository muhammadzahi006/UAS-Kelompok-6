import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CoursePlayer from "@/components/player/CoursePlayer";

interface LearnPageProps {
  params: {
    courseId: string;
  };
}

export const dynamic = "force-dynamic";

export default async function LearnPage({ params }: LearnPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=/murid/courses/${params.courseId}/learn`);
  }

  // Get course with sections and lessons
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      instructor: {
        select: { name: true },
      },
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

  // Get or create enrollment
  let enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (!enrollment) {
    // Auto enroll if user opened directly
    enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        progress: 0,
      },
    });
  }

  // Fetch all completed lessons for this user
  const lessonProgressRecords = await prisma.lessonProgress.findMany({
    where: {
      userId: user.id,
      lesson: {
        section: {
          courseId: course.id,
        },
      },
    },
  });

  const progressMap: Record<string, boolean> = {};
  lessonProgressRecords.forEach((rec) => {
    progressMap[rec.lessonId] = rec.isCompleted;
  });

  // Certificate if exists
  const cert = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  return (
    <CoursePlayer
      course={course}
      initialProgressMap={progressMap}
      initialCourseProgress={Math.round(enrollment.progress)}
      initialCertCode={cert?.certificateCode}
    />
  );
}

