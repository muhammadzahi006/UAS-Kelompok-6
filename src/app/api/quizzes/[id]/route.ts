import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: "asc" },
        },
        course: { select: { title: true, slug: true, instructorId: true } },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Kuis tidak ditemukan" }, { status: 404 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
    const instructor = user.role === "ADMIN" || (user.role === "PENGAJAR" && quiz.course.instructorId === user.id);
    if (!instructor) {
      const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId: quiz.courseId } } });
      if (!enrollment) {
        return NextResponse.json({ error: "Daftar kursus untuk mengakses kuis" }, { status: 403 });
      }
    }
    return NextResponse.json({
      ...quiz,
      questions: quiz.questions.map((question) => ({
        ...question,
        options: question.options.map(({ id, text, isCorrect }) => ({ id, text, ...(instructor ? { isCorrect } : {}) })),
      })),
    });
  } catch (error) {
    console.error("GET /api/quizzes/[id] error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "PENGAJAR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const quiz = await prisma.quiz.findUnique({ where: { id: params.id }, include: { course: true } });
    if (!quiz || (user.role !== "ADMIN" && quiz.course.instructorId !== user.id)) {
      return NextResponse.json({ error: "Kuis tidak ditemukan atau bukan milik Anda" }, { status: 404 });
    }
    await prisma.quiz.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Kuis berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/quizzes/[id] error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
