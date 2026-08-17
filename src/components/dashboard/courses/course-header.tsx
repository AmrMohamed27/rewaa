"use client";

import { ArrowLeft, Barcode, Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";

interface CourseHeaderProps {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const locale = useLocale();
  const t = useTranslations("courses");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
          <Link href={`/${locale}/dashboard/courses`}>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
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

      <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
        <Button asChild variant="outline" size="default" className="gap-2 shadow-xs font-semibold">
          <Link href={`/${locale}/dashboard/courses/${course.id}/codes`}>
            <Barcode className="h-4 w-4" />
            <span>{t("courseActivationCodes")}</span>
          </Link>
        </Button>

        <Button asChild size="default" className="gap-2 shadow-xs font-semibold">
          <Link href={`/${locale}/dashboard/courses/${course.id}/edit`}>
            <Pencil className="h-4 w-4" />
            <span>{t("details.editCourse")}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
