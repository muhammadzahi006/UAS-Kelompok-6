import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "PENGAJAR" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Hanya Pengajar atau Admin yang dapat membuat kursus." },
        { status: 403 }
      );
    }

    const {
      title,
      subtitle,
      description,
      categoryId,
      level,
      price,
      thumbnail,
      requirements,
      objectives,
    } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Judul dan deskripsi kursus wajib diisi." },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.course.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const course = await prisma.course.create({
      data: {
        title,
        slug: uniqueSlug,
        subtitle,
        description,
        categoryId: categoryId || null,
        level: level || "BEGINNER",
        price: parseFloat(price) || 0,
        thumbnail:
          thumbnail ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80",
        requirements,
        objectives,
        instructorId: user.id,
        isPublished: false,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Gagal membuat kursus baru." },
      { status: 500 }
    );
  }
}

