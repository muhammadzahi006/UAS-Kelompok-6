import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lessonId = params.id;
    const body = await req.json().catch(() => ({}));
    const isCompleted = body.isCompleted !== undefined ? body.isCompleted : true;

    // Get lesson and section to find courseId
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: { courseId: true },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const courseId = lesson.section.courseId;

    // Upsert lesson progress
    const progressRecord = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lesson.id,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId: user.id,
        lessonId: lesson.id,
        isCompleted,
      },
    });

    // Count all lessons in course
    const totalLessons = await prisma.lesson.count({
      where: {
        section: { courseId },
      },
    });

    // Count completed lessons by this user for this course
    const completedCount = await prisma.lessonProgress.count({
      where: {
        userId: user.id,
        isCompleted: true,
        lesson: {
          section: { courseId },
        },
      },
    });

    const progressPercentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const isCourseCompleted = progressPercentage >= 100;

    // Update enrollment progress
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      update: {
        progress: progressPercentage,
        isCompleted: isCourseCompleted,
        completedAt: isCourseCompleted ? new Date() : null,
      },
      create: {
        userId: user.id,
        courseId,
        progress: progressPercentage,
        isCompleted: isCourseCompleted,
        completedAt: isCourseCompleted ? new Date() : null,
      },
    });

    // Peraturan Baru: Sertifikat HANYA dikeluarkan melalui Kuis dengan nilai >= 75%
    // Di sini hanya mengembalikan sertifikat jika sudah pernah didapatkan dari kuis sebelumnya.
    const existingCert = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      lessonProgress: progressRecord,
      courseProgress: progressPercentage,
      isCourseCompleted,
      certificateCode: existingCert?.certificateCode || null,
      quizRequiredForCertificate: true,
    });
  } catch (error: any) {
    console.error("Lesson progress error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status pelajaran." },
      { status: 500 }
    );
  }
}
