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
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const courseId = params.id;
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { error: "Rating bintang dan komentar ulasan wajib diisi." },
        { status: 400 }
      );
    }

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Anda harus terdaftar di kursus ini untuk memberikan ulasan." },
        { status: 403 }
      );
    }

    // Upsert review (update if already reviewed, or create new)
    const review = await prisma.review.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      update: {
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment: comment.trim(),
      },
      create: {
        userId: user.id,
        courseId,
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment: comment.trim(),
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan ulasan kursus." },
      { status: 500 }
    );
  }
}

