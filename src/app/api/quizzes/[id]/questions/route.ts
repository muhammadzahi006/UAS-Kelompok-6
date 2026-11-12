import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const AddQuestionSchema = z.object({
  text: z.string().min(5, "Teks pertanyaan minimal 5 karakter"),
  explanation: z.string().optional(),
  order: z.number().optional(),
  weight: z.number().int().min(1).max(100).default(1),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "Teks pilihan wajib diisi"),
        isCorrect: z.boolean(),
      })
    )
    .length(4, "Kuis pilihan ganda harus memiliki 4 pilihan"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "PENGAJAR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = AddQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { text, explanation, order, options, weight } = parsed.data;

    const quiz = await prisma.quiz.findUnique({ where: { id: params.id }, include: { course: true } });
    if (!quiz || (user.role !== "ADMIN" && quiz.course.instructorId !== user.id)) {
      return NextResponse.json({ error: "Kuis tidak ditemukan atau bukan milik Anda" }, { status: 404 });
    }

    // Pastikan ada tepat satu jawaban benar
    const correctCount = options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      return NextResponse.json(
        { error: "Harus ada tepat satu jawaban yang benar" },
        { status: 400 }
      );
    }

    const existingCount = await prisma.question.count({ where: { quizId: params.id } });

    const question = await prisma.question.create({
      data: {
        quizId: params.id,
        text,
        explanation,
        order: order ?? existingCount + 1,
        weight,
        options: {
          create: options.map((o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        },
      },
      include: { options: true },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("POST /api/quizzes/[id]/questions error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
    const quiz = await prisma.quiz.findUnique({ where: { id: params.id }, include: { course: true } });
    if (!quiz) return NextResponse.json({ error: "Kuis tidak ditemukan" }, { status: 404 });
    const instructor = user.role === "ADMIN" || (user.role === "PENGAJAR" && quiz.course.instructorId === user.id);
    if (!instructor) {
      const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId: quiz.courseId } } });
      if (!enrollment) return NextResponse.json({ error: "Anda belum terdaftar di kursus ini" }, { status: 403 });
    }
    const questions = await prisma.question.findMany({
      where: { quizId: params.id },
      include: { options: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(questions.map((question) => ({
      ...question,
      options: question.options.map(({ id, text, isCorrect }) => ({ id, text, ...(instructor ? { isCorrect } : {}) })),
    })));
  } catch (error) {
    console.error("GET /api/quizzes/[id]/questions error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
