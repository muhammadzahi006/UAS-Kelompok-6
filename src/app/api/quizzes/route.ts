import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const CreateQuizSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(200),
  description: z.string().optional(),
  passingScore: z.number().min(0).max(100).default(70),
  courseId: z.string().min(1, "courseId wajib diisi"),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "PENGAJAR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateQuizSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, passingScore, courseId } = parsed.data;

    // Pastikan course milik instructor ini
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    });

    if (!course && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Kursus tidak ditemukan atau bukan milik Anda" }, { status: 404 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        passingScore: passingScore ?? 70,
        courseId,
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("POST /api/quizzes error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
