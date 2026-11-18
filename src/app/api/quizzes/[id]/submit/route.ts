import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const SubmitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, "questionId wajib diisi"),
        selectedOptionId: z.string().min(1, "selectedOptionId wajib diisi"),
      })
    )
    .min(1, "Harus menjawab minimal 1 soal"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = SubmitQuizSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { answers } = parsed.data;

    // Ambil quiz dengan questions dan options
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: { options: true },
        },
        course: {
          select: { id: true, title: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Kuis tidak ditemukan" }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: quiz.courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Anda belum terdaftar di kursus ini" }, { status: 403 });
    }

    const expectedIds = new Set(quiz.questions.map((question) => question.id));
    if (
      answers.length !== expectedIds.size ||
      new Set(answers.map((answer) => answer.questionId)).size !== answers.length ||
      answers.some((answer) => !expectedIds.has(answer.questionId))
    ) {
      return NextResponse.json({ error: "Jawab setiap soal tepat satu kali" }, { status: 400 });
    }
    if (quiz.questions.length === 0) {
      return NextResponse.json({ error: "Kuis belum memiliki soal" }, { status: 400 });
    }

    let correctCount = 0;
    let earnedWeight = 0;
    const totalWeight = quiz.questions.reduce((sum, question) => sum + question.weight, 0);

    for (const answer of answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      const selectedOption = question.options.find(
        (o) => o.id === answer.selectedOptionId
      );
      if (selectedOption?.isCorrect) {
        correctCount++;
        earnedWeight += question.weight;
      }
    }

    const score = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;
    // Passing grade minimal 75%
    const isPassed = score >= Math.max(quiz.passingScore, 75);

    // Simpan QuizAttempt + QuizAnswer
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: params.id,
        score,
        isPassed,
        answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            selectedOptionId: a.selectedOptionId,
          })),
        },
      },
      include: {
        answers: true,
        quiz: {
          select: {
            title: true,
            passingScore: true,
            courseId: true,
          },
        },
      },
    });

    // Syarat kelulusan: Jika nilai >= 75%, terbitkan sertifikat resmi!
    let certificate = null;
    if (isPassed) {
      const existingCert = await prisma.certificate.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: quiz.courseId,
          },
        },
      });

      if (!existingCert) {
        const certCode = `EDUVIBE-${Date.now().toString(36).toUpperCase()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`;
        certificate = await prisma.certificate.create({
          data: {
            userId: user.id,
            courseId: quiz.courseId,
            certificateCode: certCode,
          },
        });
      } else {
        certificate = existingCert;
      }

      // Tandai juga enrollment selesai jika belum
      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: quiz.courseId,
          },
        },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    }

    // Enqueue notification
    try {
      await prisma.notificationQueue.create({
        data: {
          title: isPassed
            ? "🎉 Selamat! Anda Lulus Kuis & Meraih Sertifikat!"
            : "📝 Hasil Kuis Tersedia",
          body: `Nilai Anda: ${Math.round(score)}% pada kuis "${quiz.title}". ${
            isPassed
              ? "Lulus dengan predikat memuaskan! Sertifikat telah diterbitkan."
              : "Nilai minimum kelulusan adalah 75%. Pelajari kembali materi dan coba lagi!"
          }`,
          url: isPassed && certificate ? `/certificate/${certificate.certificateCode}` : `/murid/dashboard`,
          targetUserId: user.id,
          status: "PENDING",
        },
      });
    } catch {
      // notifikasi gagal tidak blocker
    }

    return NextResponse.json({
      score: Math.round(score),
      isPassed,
      correctCount,
      totalQuestions: quiz.questions.length,
      passingScore: Math.max(quiz.passingScore, 75),
      attemptId: attempt.id,
      certificateCode: certificate?.certificateCode || null,
    });
  } catch (error) {
    console.error("POST /api/quizzes/[id]/submit error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
