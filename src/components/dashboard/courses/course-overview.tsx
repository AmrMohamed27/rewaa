"use client";

import { PlayCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { DashboardCard } from "../overview/dashboard-card";
import { Course } from "@/types/course";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";

interface CourseOverviewProps {
  course: Course;
}

export function CourseOverview({ course }: CourseOverviewProps) {
  const t = useTranslations("courses");
  const locale = useLocale();
  const isRtl = locale === "ar";
  console.log(course.description);

  return (
    <DashboardCard className="p-6 space-y-4">
      <h2 className="text-lg font-bold text-foreground">{t("details.overview")}</h2>
      <MarkdownViewer content={course.description} isRtl={isRtl} />

      {/* Preview Video if available */}
      {course.previewVideoLink && (
        <div className="pt-2 border-t border-border/40">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-foreground">
            <PlayCircle className="size-4 text-primary" />
            <span>{t("details.previewVideo")}</span>
          </div>
          <a
            href={course.previewVideoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-primary hover:underline font-medium"
          >
            {course.previewVideoLink}
          </a>
        </div>
      )}
    </DashboardCard>
  );
}
