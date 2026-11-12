import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// LAPIS 1: Validasi Zod Schema
const CreateCourseSchema = z.object({
  title: z
    .string()
    .min(5, "Judul minimal 5 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  subtitle: z.string().max(300).optional(),
  description: z
    .string()
    .min(20, "Deskripsi minimal 20 karakter"),
  categoryId: z.string().optional().nullable(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]).default("BEGINNER"),
  price: z.number().min(0, "Harga tidak boleh negatif").default(0),
  thumbnail: z.string().url("URL thumbnail tidak valid").optional().nullable(),
  requirements: z.string().optional().nullable(),
  objectives: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    // LAPIS 2: Validasi otorisasi (role)
    const user = await getCurrentUser();
    if (!user || (user.role !== "PENGAJAR" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Hanya Pengajar atau Admin yang dapat membuat kursus." },
        { status: 403 }
      );
    }

    const body = await req.json();

    // LAPIS 1: Validasi Zod
    const parsed = CreateCourseSchema.safeParse({
      ...body,
      price: typeof body.price === "string" ? parseFloat(body.price) : body.price,
    });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, subtitle, description, categoryId, level, price, thumbnail, requirements, objectives } =
      parsed.data;

    // LAPIS 3: Validasi bisnis — generate slug unik
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
        price: price ?? 0,
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
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Gagal membuat kursus baru." },
      { status: 500 }
    );
  }
}
