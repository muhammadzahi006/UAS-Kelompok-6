import Link from "next/link";
import prisma from "@/lib/prisma";
import CourseCard from "@/components/courses/CourseCard";
import { Search, Filter, Compass, BookOpen } from "lucide-react";

interface CoursesPageProps {
  searchParams: {
    q?: string;
    category?: string;
    level?: string;
    price?: string;
  };
}

async function getCourses(searchParams: CoursesPageProps["searchParams"]) {
  try {
    const where: any = { isPublished: true };

    if (searchParams.q) {
      where.OR = [
        { title: { contains: searchParams.q, mode: "insensitive" } },
        { subtitle: { contains: searchParams.q, mode: "insensitive" } },
        { description: { contains: searchParams.q, mode: "insensitive" } },
      ];
    }

    if (searchParams.category) {
      where.category = { slug: searchParams.category };
    }

    if (searchParams.level && searchParams.level !== "ALL") {
      where.level = searchParams.level;
    }

    if (searchParams.price === "free") {
      where.price = 0;
    } else if (searchParams.price === "paid") {
      where.price = { gt: 0 };
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: { select: { name: true, avatar: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { sections: true, enrollments: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { courses: true } } },
    });
  } catch (error) {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function CoursesCatalogPage({ searchParams }: CoursesPageProps) {
  const [courses, categories] = await Promise.all([
    getCourses(searchParams),
    getCategories(),
  ]);

  const activeCategory = searchParams.category || "";
  const activeLevel = searchParams.level || "ALL";
  const activePrice = searchParams.price || "all";
  const query = searchParams.q || "";

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <Compass className="w-4 h-4" />
            <span>Katalog Kursus CourseraID</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Eksplorasi Semua Kursus Online
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Temukan kursus yang sesuai dengan minat dan target karir impian Anda.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <form className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Cari berdasarkan judul, teknologi, atau topik..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            {/* Hidden fields to preserve filters when searching text */}
            {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
            {activeLevel !== "ALL" && <input type="hidden" name="level" value={activeLevel} />}
            {activePrice !== "all" && <input type="hidden" name="price" value={activePrice} />}

            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-500 text-white font-semibold text-sm rounded-xl hover:bg-brand-600 transition-colors shadow-sm"
            >
              Cari Kursus
            </button>
          </form>

          {/* Quick Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Kategori:
            </span>
            <Link
              href={`/courses?${new URLSearchParams({
                ...(query ? { q: query } : {}),
                ...(activeLevel !== "ALL" ? { level: activeLevel } : {}),
                ...(activePrice !== "all" ? { price: activePrice } : {}),
              }).toString()}`}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                !activeCategory
                  ? "bg-brand-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/courses?${new URLSearchParams({
                  category: cat.slug,
                  ...(query ? { q: query } : {}),
                  ...(activeLevel !== "ALL" ? { level: activeLevel } : {}),
                  ...(activePrice !== "all" ? { price: activePrice } : {}),
                }).toString()}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-brand-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name} ({cat._count?.courses || 0})
              </Link>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-600">
            Menampilkan <strong className="text-slate-900">{courses.length}</strong> kursus yang tersedia
          </p>
        </div>

        {/* Course Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Tidak ada kursus ditemukan
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Coba ubah kata kunci pencarian atau reset filter kategori Anda.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center px-4 py-2 bg-brand-50 text-brand-600 font-bold text-xs rounded-xl hover:bg-brand-100 transition-colors"
            >
              Reset Semua Filter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
