"use client";

import { ContentPagination } from "@/components/dashboard/common/content-pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { getStoredCourses } from "@/lib/courses-storage";
import { getStoredTeachers } from "@/lib/settings-storage";
import { getEnrolledCourseIds } from "@/lib/student-enrollment-storage";
import { Course } from "@/types/course";
import { BookOpen, Compass } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { StudentCourseFilters, StudentCourseSortOption } from "./StudentCourseFilters";
import { EnrolledCourseItem, StudentEnrolledCourseCard } from "./StudentEnrolledCourseCard";

export function StudentCoursesClient() {
  const locale = useLocale();
  const t = useTranslations("studentDashboard.coursesPage");
  const tEnrolled = useTranslations("studentDashboard.enrolledCourses");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state synchronization
  const searchQuery = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sort") as StudentCourseSortOption) || "date-newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10) || 1;
  const itemsPerPage = 4;

  const updateUrlParams = React.useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          (key === "sort" && value === "date-newest") ||
          (key === "page" && value === 1)
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Load courses, teachers & enrolled IDs
  const [storedCourses, setStoredCourses] = React.useState<Course[]>([]);
  const [teachers, setTeachers] = React.useState(getStoredTeachers());
  const [enrolledCourseIds, setEnrolledCourseIds] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = () => {
      setStoredCourses(getStoredCourses(locale));
      setTeachers(getStoredTeachers());
      setEnrolledCourseIds(getEnrolledCourseIds());
      setIsLoading(false);
    };

    loadData();
    window.addEventListener("rewaa_courses_updated", loadData);
    window.addEventListener("rewaa_settings_updated", loadData);
    window.addEventListener("rewaa_student_enrollment_updated", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("rewaa_courses_updated", loadData);
      window.removeEventListener("rewaa_settings_updated", loadData);
      window.removeEventListener("rewaa_student_enrollment_updated", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, [locale]);

  // Build full list of student's enrolled courses
  const allEnrolledCourses: EnrolledCourseItem[] = React.useMemo(() => {
    // Deterministic progress and end date mappings for mock enrolled courses
    const defaultProgress = [65, 40, 20, 0];
    const defaultEndDates = ["2026-12-31", "2026-11-15", "2026-10-30", "2026-12-01"];

    const enrolledSet = new Set(enrolledCourseIds);
    const available = storedCourses.filter((c) => !c.isDraft && enrolledSet.has(c.id));

    return available.map((course, idx) => {
      const matchedTeacher = teachers.find(
        (tch) =>
          tch.name.trim().toLowerCase() === course.teacherName?.trim().toLowerCase() ||
          (course.teacherName && tch.name.includes(course.teacherName)) ||
          (course.teacherName && course.teacherName.includes(tch.name)),
      );

      return {
        course,
        teacherImage: matchedTeacher?.image || "",
        accessEndDate: defaultEndDates[idx % defaultEndDates.length],
        progressPercentage: defaultProgress[idx % defaultProgress.length],
      };
    });
  }, [storedCourses, teachers, enrolledCourseIds]);

  // Filter Logic (Search by course title, subject, grade, teacher name)
  const filteredCourses = React.useMemo(() => {
    if (!searchQuery.trim()) return allEnrolledCourses;
    const query = searchQuery.toLowerCase().trim();

    return allEnrolledCourses.filter(({ course }) => {
      const matchesTitle = course.title.toLowerCase().includes(query);
      const matchesSubject = course.subject?.toLowerCase().includes(query);
      const matchesGrade = course.grade?.toLowerCase().includes(query);
      const matchesTeacher = course.teacherName?.toLowerCase().includes(query);
      return matchesTitle || matchesSubject || matchesGrade || matchesTeacher;
    });
  }, [allEnrolledCourses, searchQuery]);

  // Sort Logic
  const sortedCourses = React.useMemo(() => {
    return [...filteredCourses].sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.course.title.localeCompare(b.course.title, locale);
        case "title-desc":
          return b.course.title.localeCompare(a.course.title, locale);
        case "date-newest":
          return new Date(b.course.date).getTime() - new Date(a.course.date).getTime();
        case "date-oldest":
          return new Date(a.course.date).getTime() - new Date(b.course.date).getTime();
        case "progress-desc":
          return b.progressPercentage - a.progressPercentage;
        case "progress-asc":
          return a.progressPercentage - b.progressPercentage;
        default:
          return 0;
      }
    });
  }, [filteredCourses, sortBy, locale]);

  // Pagination Logic (4 items per page)
  const totalItems = sortedCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedCourses = sortedCourses.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUrlParams({ search: e.target.value, page: 1 });
  };

  const handleSortChange = (sort: StudentCourseSortOption) => {
    updateUrlParams({ sort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateUrlParams({ page });
  };

  const handleResetFilters = () => {
    updateUrlParams({ search: null, sort: null, page: 1 });
  };

  const showingText = t("pagination.showing", {
    start: totalItems > 0 ? startIndex + 1 : 0,
    end: Math.min(startIndex + itemsPerPage, totalItems),
    total: totalItems,
  });

  return (
    <div className="space-y-6 w-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("title")}
            </h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {t("totalEnrolled", { count: allEnrolledCourses.length })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button asChild size="default" className="gap-2 shadow-xs font-semibold">
            <Link href="/student-dashboard/courses/explore">
              <Compass className="size-4" />
              <span>{t("exploreAll")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters (Search & Sort) */}
      <StudentCourseFilters
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
      />

      {/* Courses List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 p-4 sm:p-5 rounded-2xl bg-card border border-border/60"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                <Skeleton className="aspect-video sm:aspect-4/3 w-full sm:w-36 md:w-44 h-auto sm:h-28 rounded-xl" />
                <div className="space-y-3 flex-1 w-full">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-full max-w-md" />
                </div>
              </div>
              <Skeleton className="h-10 w-28 rounded-xl self-end md:self-center" />
            </div>
          ))}
        </div>
      ) : allEnrolledCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-dashed border-border/80">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">{tEnrolled("title")}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">{tEnrolled("empty")}</p>
        </div>
      ) : paginatedCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-dashed border-border/80">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">{t("empty.title")}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">{t("empty.description")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {paginatedCourses.map(({ course, teacherImage, accessEndDate, progressPercentage }) => (
            <StudentEnrolledCourseCard
              key={course.id}
              course={course}
              teacherImage={teacherImage}
              accessEndDate={accessEndDate}
              progressPercentage={progressPercentage}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <ContentPagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        showingText={showingText}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
