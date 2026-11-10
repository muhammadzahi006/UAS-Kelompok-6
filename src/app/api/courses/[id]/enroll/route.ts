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
      return NextResponse.json(
        { error: "Silakan masuk terlebih dahulu untuk mendaftar kursus." },
        { status: 401 }
      );
    }

    const courseId = params.id;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: { lessons: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Kursus tidak ditemukan." },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({
        message: "Anda sudah terdaftar di kursus ini.",
        enrollment: existingEnrollment,
      });
    }

    // Create new enrollment
    const newEnrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        progress: 0,
        isCompleted: false,
      },
    });

    return NextResponse.json(
      {
        message: "Selamat! Anda berhasil terdaftar di kursus ini.",
        enrollment: newEnrollment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pendaftaran kursus." },
      { status: 500 }
    );
  }
}

