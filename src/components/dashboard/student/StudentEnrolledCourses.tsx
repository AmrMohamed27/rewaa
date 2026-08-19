"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/routing";
import { getStoredCourses } from "@/lib/courses-storage";
import { getStoredTeachers } from "@/lib/settings-storage";
import { Course } from "@/types/course";
import { ArrowRight, Calendar, Play, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export interface EnrolledCourseItem {
  course: Course;
  teacherImage?: string;
  accessEndDate?: string;
  progressPercentage: number;
}

interface StudentEnrolledCoursesProps {
  courses?: EnrolledCourseItem[];
}

export function StudentEnrolledCourses({ courses: customCourses }: StudentEnrolledCoursesProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("studentDashboard.enrolledCourses");

  const [storedCourses, setStoredCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState(getStoredTeachers());

  useEffect(() => {
    const loadData = () => {
      setStoredCourses(getStoredCourses(locale));
      setTeachers(getStoredTeachers());
    };

    loadData();
    window.addEventListener("rewaa_courses_updated", loadData);
    window.addEventListener("rewaa_settings_updated", loadData);
    return () => {
      window.removeEventListener("rewaa_courses_updated", loadData);
      window.removeEventListener("rewaa_settings_updated", loadData);
    };
  }, [locale]);

  // Build enrolled courses list
  const enrolledCourses: EnrolledCourseItem[] = useMemo(() => {
    if (customCourses && customCourses.length > 0) {
      return customCourses;
    }

    // Default mock sample progress data mapped to stored courses
    const defaultProgress = [65, 40, 85, 20];
    const defaultEndDates = ["2026-12-31", "2026-11-15", "", "2027-01-30"];

    // Filter published courses first or take top courses
    const available = storedCourses.length > 0 ? storedCourses : [];
    const enrolled = available.slice(0, 4);

    return enrolled.map((course, idx) => {
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
  }, [customCourses, storedCourses, teachers]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="space-y-4 w-full">
      {/* Section Header with Title and "View All" */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary hover:bg-primary/10 gap-1.5 font-semibold text-sm h-8 px-3 rounded-lg group"
        >
          <Link href="/student-dashboard/courses">
            <span>{t("viewAll")}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </Button>
      </div>

      {/* Courses List */}
      {enrolledCourses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground bg-card/50">
          {t("empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {enrolledCourses.map(({ course, teacherImage, accessEndDate, progressPercentage }) => {
            const formattedDate = formatDate(accessEndDate);

            return (
              <div
                key={course.id}
                className="group relative flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 p-4 sm:p-5 rounded-2xl bg-card border border-border/70 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                {/* Left Side (Cover Image + Column of Title / Teacher / Access Date) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                  {/* Cover Image */}
                  <div className="relative aspect-video sm:aspect-4/3 w-full sm:w-36 md:w-44 h-auto sm:h-28 rounded-xl overflow-hidden bg-muted shrink-0 shadow-xs">
                    {course.coverImage ? (
                      <Image
                        src={course.coverImage}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 180px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                        {course.title.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Column of Course Title + Teacher Info & Access Date + Progress Bar */}
                  <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                    <Link
                      href={`/student-dashboard/courses`}
                      className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
                    >
                      {course.title}
                    </Link>

                    {/* Teacher Image & Name + Access End Date */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground">
                      {/* Teacher info */}
                      <div className="flex items-center gap-2">
                        <div className="relative size-6 rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
                          {teacherImage ? (
                            <Image
                              src={teacherImage}
                              alt={course.teacherName}
                              fill
                              className="object-cover"
                              sizes="24px"
                            />
                          ) : (
                            <User className="size-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-medium text-foreground truncate max-w-[140px] sm:max-w-[200px]">
                          {course.teacherName}
                        </span>
                      </div>

                      {/* Access End Date (if exists) */}
                      {formattedDate && (
                        <>
                          <span className="text-border hidden sm:inline">•</span>
                          <div className="flex items-center gap-1.5 text-muted-foreground/90">
                            <Calendar className="size-3.5 text-primary/70 shrink-0" />
                            <span>{t("accessEnds", { date: formattedDate })}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Progress Bar under teacher and date */}
                    <div className="space-y-1.5 pt-1 max-w-md w-full">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">{t("progress")}</span>
                        <span className="text-primary font-mono">{progressPercentage}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2 bg-primary/15" />
                    </div>
                  </div>
                </div>

                {/* Continue Button at the bottom end */}
                <div className="flex items-center justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/50 self-end md:self-center">
                  <Button
                    asChild
                    size="default"
                    className="font-semibold gap-2 shadow-xs shrink-0 px-5"
                  >
                    <Link href={`/student-dashboard/courses/${course.id}`}>
                      <span>{t("continue")}</span>
                      <Play className="size-3.5 fill-current rtl:rotate-180" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
