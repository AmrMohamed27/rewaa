"use client";

import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";

interface CourseHeaderProps {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("courses");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Link
          href={`/${locale}/dashboard/courses`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          {isAr ? <ArrowRight className="size-3.5" /> : <ArrowLeft className="size-3.5" />}
          <span>{t("details.backToCourses")}</span>
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {course.title}
          </h1>
          {!course.isDraft ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-bg text-success shadow-xs">
              {t("status.published")}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning-bg text-warning">
              {t("status.draft")}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={`/${locale}/dashboard/courses/${course.id}/edit`}>
            <Pencil className="size-4" />
            <span>{t("details.editCourse")}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
