import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { name, description, icon } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || "BookOpen",
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Gagal membuat kategori. Mungkin nama sudah ada." },
      { status: 500 }
    );
  }
}

