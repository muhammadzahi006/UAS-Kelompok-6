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

    const courseId = params.id;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Get current max order
    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });

    const newOrder = lastSection ? lastSection.order + 1 : 1;

    const section = await prisma.section.create({
      data: {
        title,
        order: newOrder,
        courseId,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error: any) {
    console.error("Create section error:", error);
    return NextResponse.json(
      { error: "Gagal membuat modul section" },
      { status: 500 }
    );
  }
}

