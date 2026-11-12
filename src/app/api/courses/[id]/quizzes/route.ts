import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { courseId: params.id },
      include: {
        _count: { select: { questions: true, attempts: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("GET /api/courses/[id]/quizzes error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
