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

    const sectionId = params.id;
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    if (section.course.instructorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, description, videoUrl, duration, isPreview, attachments } =
      await req.json();

    if (!title) {
      return NextResponse.json({ error: "Judul pelajaran wajib diisi" }, { status: 400 });
    }

    // Get last lesson order
    const lastLesson = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { order: "desc" },
    });

    const newOrder = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || null,
        videoUrl: videoUrl || null,
        duration: parseInt(duration) || 300,
        isPreview: Boolean(isPreview),
        attachments: attachments || null,
        order: newOrder,
        sectionId,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    console.error("Create lesson error:", error);
    return NextResponse.json({ error: "Gagal membuat pelajaran baru" }, { status: 500 });
  }
}

