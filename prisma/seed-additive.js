const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();

const studentFixtures = [
  { name: "Budi Santoso", email: "murid@coursera-clone.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi" },
  { name: "Dewi Anggraini", email: "murid2@coursera-clone.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dewi" },
  { name: "Reza Fahlevi", email: "murid3@coursera-clone.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza" },
  { name: "Anisa Rahma", email: "murid4@coursera-clone.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anisa" },
  { name: "Fajar Nugroho", email: "murid5@coursera-clone.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fajar" },
];

const newCourseFixtures = [
  {
    title: "Python Data Science: Analisis Data dari Nol",
    slug: "python-data-science-analisis-data",
    description: "Belajar mengolah data dengan Python, Pandas, visualisasi, dan dasar machine learning melalui latihan bertahap.",
    categorySlug: "data-science",
    level: "BEGINNER",
    sections: [
      { title: "Dasar Python untuk Data", lessons: ["Variabel dan struktur data", "Membaca data CSV dengan Pandas"] },
      { title: "Analisis dan Visualisasi", lessons: ["Membersihkan data", "Membuat visualisasi sederhana"] },
    ],
  },
  {
    title: "Cloud & DevOps Praktis dengan Docker dan CI/CD",
    slug: "cloud-devops-docker-cicd-praktis",
    description: "Pahami container, pipeline CI/CD, deployment, dan praktik operasional aplikasi modern.",
    categorySlug: "cloud-devops",
    level: "INTERMEDIATE",
    sections: [
      { title: "Container dan Docker", lessons: ["Konsep image dan container", "Menyusun Dockerfile"] },
      { title: "Otomasi Deployment", lessons: ["Membuat pipeline CI", "Deploy aplikasi dan memantau log"] },
    ],
  },
  {
    title: "Full-Stack Web Development dengan React dan API",
    slug: "fullstack-react-api-praktis",
    description: "Bangun aplikasi full-stack dengan komponen React, API yang tervalidasi, dan database relasional.",
    categorySlug: "web-development",
    level: "BEGINNER",
    sections: [
      { title: "Antarmuka React", lessons: ["Komponen dan props", "State dan formulir"] },
      { title: "API dan Database", lessons: ["Membuat endpoint REST", "Validasi dan relasi data"] },
    ],
  },
];

const questionFixtures = [
  {
    text: "Apa tujuan utama memvalidasi data pada aplikasi web?",
    explanation: "Validasi memastikan data sesuai format dan aturan sebelum diproses.",
    correct: 1,
    options: ["Memperbesar ukuran database", "Menolak data yang tidak sesuai aturan", "Mengganti autentikasi", "Menghapus seluruh cache"],
  },
  {
    text: "Manakah praktik yang baik untuk menjaga akses data pengguna?",
    explanation: "Akses perlu diperiksa di server dan dibatasi dengan kebijakan kepemilikan.",
    correct: 2,
    options: ["Memercayai ID dari browser", "Menyembunyikan tombol saja", "Memeriksa kepemilikan di server dan database", "Menyimpan password sebagai teks biasa"],
  },
];

async function ensureOptions(question, fixture) {
  const existing = await prisma.option.findMany({ where: { questionId: question.id } });
  for (let index = 0; index < fixture.options.length; index++) {
    const text = fixture.options[index];
    if (!existing.some((option) => option.text === text)) {
      await prisma.option.create({ data: { questionId: question.id, text, isCorrect: index === fixture.correct } });
    }
  }
}

async function main() {
  let authAdmin = null;
  let authUsers = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL wajib diisi untuk seeding Auth.");
    authAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const listed = await authAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) throw new Error(`Supabase Auth admin preflight failed: ${listed.error.message}`);
    authUsers = listed.data.users;
  }

  const instructor = await prisma.user.findUnique({ where: { email: "pengajar@coursera-clone.com" } });
  if (!instructor || (instructor.role !== "PENGAJAR" && instructor.role !== "ADMIN")) {
    throw new Error("Profil pengajar demo tidak ditemukan. Seed dihentikan tanpa mengubah data.");
  }
  const adminProfile = await prisma.user.findUnique({ where: { email: "admin@coursera-clone.com" } });

  const categories = {};
  for (const [slug, name] of [
    ["web-development", "Web Development"],
    ["data-science", "Data Science"],
    ["cloud-devops", "Cloud & DevOps"],
  ]) {
    categories[slug] = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { slug, name, description: `Materi ${name}`, icon: "BookOpen" },
    });
  }

  const students = [];
  for (const [index, fixture] of studentFixtures.entries()) {
    const existing = await prisma.user.findUnique({ where: { email: fixture.email } });
    students.push(existing || await prisma.user.create({
      data: {
        name: fixture.name,
        email: fixture.email,
        role: "MURID",
        password: null,
        avatar: fixture.avatar,
        headline: "Peserta demo CourseraID",
        bio: `Profil peserta demo ${index + 1}.`,
      },
    }));
  }

  let linkedAuthUsers = 0;
  if (authAdmin) {
    const authFixtures = [
      ...(adminProfile ? [{ profile: adminProfile, password: "admin123" }] : []),
      { profile: instructor, password: "pengajar123" },
      ...students.map((profile) => ({ profile, password: "murid123" })),
    ];
    for (const [index, fixture] of authFixtures.entries()) {
      const { profile, password } = fixture;
      let authUser = authUsers.find((candidate) => candidate.email?.toLowerCase() === profile.email.toLowerCase());
      if (!authUser) {
        const created = await authAdmin.auth.admin.createUser({
          email: profile.email,
          password,
          email_confirm: true,
          user_metadata: { full_name: profile.name, role: profile.role },
        });
        if (created.error) throw new Error(`Failed to create demo Auth account ${index + 1}: ${created.error.message}`);
        authUser = created.data.user;
        authUsers.push(authUser);
      }
      if (authUser.email_confirmed_at) {
        await prisma.user.update({ where: { id: profile.id }, data: { authUserId: authUser.id } });
        linkedAuthUsers++;
      }
    }
  }

  const courses = await prisma.course.findMany({ orderBy: { createdAt: "asc" }, take: 5 });
  for (const fixture of newCourseFixtures) {
    let course = await prisma.course.findUnique({ where: { slug: fixture.slug } });
    if (!course) {
      course = await prisma.course.create({
        data: {
          title: fixture.title,
          slug: fixture.slug,
          description: fixture.description,
          subtitle: "Kursus demo dengan materi, kuis, dan progres peserta.",
          categoryId: categories[fixture.categorySlug].id,
          instructorId: instructor.id,
          level: fixture.level,
          price: 0,
          isPublished: true,
          objectives: "Memahami konsep dan menerapkannya melalui latihan.",
          requirements: "Tidak ada persyaratan khusus.",
          sections: {
            create: fixture.sections.map((section, sectionIndex) => ({
              title: section.title,
              order: sectionIndex + 1,
              lessons: {
                create: section.lessons.map((title, lessonIndex) => ({
                  title,
                  description: `Materi demo: ${title}.`,
                  duration: 300 + lessonIndex * 60,
                  order: lessonIndex + 1,
                  isPreview: lessonIndex === 0,
                })),
              },
            })),
          },
        },
      });
    }
    if (!courses.some((item) => item.id === course.id)) courses.push(course);
  }

  const targetCourses = courses.slice(0, 5);
  for (const course of targetCourses) {
    let quiz = await prisma.quiz.findFirst({ where: { courseId: course.id, title: "Kuis Evaluasi Materi" } });
    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: { title: "Kuis Evaluasi Materi", description: "Kuis pilihan ganda untuk menguji pemahaman materi.", passingScore: 70, courseId: course.id },
      });
    }

    for (const [index, fixture] of questionFixtures.entries()) {
      let question = await prisma.question.findFirst({ where: { quizId: quiz.id, text: fixture.text } });
      if (!question) {
        question = await prisma.question.create({
          data: { quizId: quiz.id, text: fixture.text, explanation: fixture.explanation, order: index + 1, weight: index + 1 },
        });
      }
      await ensureOptions(question, fixture);
    }
  }

  for (const [studentIndex, student] of students.entries()) {
    for (const [courseIndex, course] of targetCourses.entries()) {
      let enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: student.id, courseId: course.id } } });
      if (!enrollment) {
        const lessons = await prisma.lesson.findMany({ where: { section: { courseId: course.id } }, orderBy: [{ section: { order: "asc" } }, { order: "asc" }] });
        const completed = (studentIndex + courseIndex) % (lessons.length + 1);
        const progress = lessons.length ? Math.round(completed * 100 / lessons.length) : 0;
        enrollment = await prisma.enrollment.create({
          data: { userId: student.id, courseId: course.id, progress, isCompleted: progress === 100, completedAt: progress === 100 ? new Date() : null },
        });
        for (const [lessonIndex, lesson] of lessons.entries()) {
          if (lessonIndex < completed) {
            await prisma.lessonProgress.upsert({
              where: { userId_lessonId: { userId: student.id, lessonId: lesson.id } },
              update: {},
              create: { userId: student.id, lessonId: lesson.id, isCompleted: true },
            });
          }
        }
      }

      const quiz = await prisma.quiz.findFirst({ where: { courseId: course.id, title: "Kuis Evaluasi Materi" }, include: { questions: { include: { options: true }, orderBy: { order: "asc" } } } });
      const attemptExists = quiz && await prisma.quizAttempt.findFirst({ where: { userId: student.id, quizId: quiz.id } });
      if (quiz && !attemptExists && quiz.questions.length) {
        const answers = quiz.questions.map((question, questionIndex) => {
          const correctOption = question.options.find((option) => option.isCorrect);
          const wrongOptions = question.options.filter((option) => !option.isCorrect);
          const selected = (studentIndex + courseIndex + questionIndex) % 2 === 0 ? correctOption : wrongOptions[0];
          return { questionId: question.id, selectedOptionId: selected.id, isCorrect: selected.isCorrect, weight: question.weight };
        });
        const weightTotal = answers.reduce((sum, answer) => sum + answer.weight, 0);
        const score = weightTotal ? answers.reduce((sum, answer) => sum + (answer.isCorrect ? answer.weight : 0), 0) * 100 / weightTotal : 0;
        await prisma.quizAttempt.create({
          data: {
            userId: student.id,
            quizId: quiz.id,
            score,
            isPassed: score >= quiz.passingScore,
            answers: { create: answers.map(({ questionId, selectedOptionId }) => ({ questionId, selectedOptionId })) },
          },
        });
      }
    }
  }

  const counts = await Promise.all([
    prisma.user.count({ where: { role: "MURID" } }),
    prisma.course.count(),
    prisma.quiz.count(),
    prisma.enrollment.count(),
    prisma.quizAttempt.count(),
  ]);
  console.log(JSON.stringify({ students: counts[0], courses: counts[1], quizzes: counts[2], enrollments: counts[3], quizAttempts: counts[4], linkedAuthUsers, authProvisioning: authAdmin ? "enabled" : "skipped; set SUPABASE_SERVICE_ROLE_KEY to create login-ready demo accounts" }));
}

main().catch((error) => {
  console.error("Additive demo seed failed:", error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
