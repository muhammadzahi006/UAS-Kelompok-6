import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
          },
        },
        category: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Kursus tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json({ error: "Kursus tidak ditemukan" }, { status: 404 });
    }

    if (course.instructorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    const updated = await prisma.course.update({
      where: { id: params.id },
      data: {
        title: data.title ?? course.title,
        subtitle: data.subtitle ?? course.subtitle,
        description: data.description ?? course.description,
        categoryId: data.categoryId ?? course.categoryId,
        level: data.level ?? course.level,
        price: data.price !== undefined ? parseFloat(data.price) : course.price,
        thumbnail: data.thumbnail ?? course.thumbnail,
        requirements: data.requirements ?? course.requirements,
        objectives: data.objectives ?? course.objectives,
        isPublished:
          data.isPublished !== undefined ? data.isPublished : course.isPublished,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update course error:", error);
    return NextResponse.json({ error: "Gagal memperbarui kursus" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json({ error: "Kursus tidak ditemukan" }, { status: 404 });
    }

    if (course.instructorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Kursus berhasil dihapus" });
  } catch (error: any) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Gagal menghapus kursus" }, { status: 500 });
  }
}

