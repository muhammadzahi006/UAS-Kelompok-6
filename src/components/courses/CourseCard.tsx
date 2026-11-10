import Link from "next/link";
import { Star } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    subtitle?: string | null;
    thumbnail?: string | null;
    price: number;
    level: string;
    instructor?: {
      name: string;
      avatar?: string | null;
    };
    category?: {
      name: string;
      slug: string;
    } | null;
    _count?: {
      sections?: number;
      enrollments?: number;
      reviews?: number;
    };
    avgRating?: number;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const rating = course.avgRating || 4.8;
  const reviewCount = course._count?.reviews || 24;

  const levelLabels: Record<string, string> = {
    BEGINNER: "Pemula",
    INTERMEDIATE: "Menengah",
    ADVANCED: "Mahir",
    ALL_LEVELS: "Semua Tingkat",
  };

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            course.thumbnail ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
          }
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {course.category && (
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[11px] font-semibold text-brand-600 rounded-md shadow-sm">
              {course.category.name}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-[11px] font-medium text-white rounded-md shadow-sm">
            {levelLabels[course.level] || course.level}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {course.subtitle}
            </p>
          )}

          {/* Instructor info */}
          {course.instructor && (
            <div className="mt-3 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  course.instructor.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name}`
                }
                alt={course.instructor.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs text-slate-600 font-medium truncate">
                {course.instructor.name}
              </span>
            </div>
          )}
        </div>

        {/* Rating and Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
            </div>
            <span className="text-sm font-bold text-slate-800">{rating}</span>
            <span className="text-xs text-slate-400">({reviewCount})</span>
          </div>

          <div className="text-right">
            <span
              className={`text-base font-extrabold ${
                course.price === 0 ? "text-emerald-600" : "text-brand-600"
              }`}
            >
              {formatRupiah(course.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
