import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Riwayat quiz attempts untuk kursus tertentu (pengajar)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "PENGAJAR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    // Ambil semua quiz attempt untuk kursus ini
    const course = await prisma.course.findUnique({ where: { id: params.id }, select: { instructorId: true } });
    if (!course || (user.role !== "ADMIN" && course.instructorId !== user.id)) {
      return NextResponse.json({ error: "Kursus tidak ditemukan atau bukan milik Anda" }, { status: 404 });
    }
    const quizzes = await prisma.quiz.findMany({
      where: { courseId: params.id },
      include: {
        attempts: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { questions: true } },
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("GET /api/courses/[id]/quiz-results error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
