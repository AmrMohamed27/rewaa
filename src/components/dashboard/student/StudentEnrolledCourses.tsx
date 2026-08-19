"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getStoredCourses } from "@/lib/courses-storage";
import { getStoredTeachers } from "@/lib/settings-storage";
import { getEnrolledCourseIds } from "@/lib/student-enrollment-storage";
import { Course } from "@/types/course";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { StudentEnrolledCourseCard } from "./StudentEnrolledCourseCard";

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
  const t = useTranslations("studentDashboard.enrolledCourses");

  const [storedCourses, setStoredCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState(getStoredTeachers());
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = () => {
      setStoredCourses(getStoredCourses(locale));
      setTeachers(getStoredTeachers());
      setEnrolledCourseIds(getEnrolledCourseIds());
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

  // Build enrolled courses list
  const enrolledCourses: EnrolledCourseItem[] = useMemo(() => {
    if (customCourses && customCourses.length > 0) {
      return customCourses;
    }

    const defaultProgress = [65, 40, 20, 0];
    const defaultEndDates = ["2026-12-31", "2026-11-15", "2026-10-30", "2026-12-01"];

    const enrolledSet = new Set(enrolledCourseIds);
    const available = storedCourses.length > 0 ? storedCourses : [];
    const enrolled = available.filter((c) => !c.isDraft && enrolledSet.has(c.id));

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
  }, [customCourses, storedCourses, teachers, enrolledCourseIds]);

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
          {enrolledCourses.map(({ course, teacherImage, accessEndDate, progressPercentage }) => (
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
    </section>
  );
}
