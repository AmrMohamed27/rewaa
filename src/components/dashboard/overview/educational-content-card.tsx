"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { BookOpen, Video, HelpCircle, FileText, ArrowUpRight } from "lucide-react";
import { dashboardMockData } from "@/lib/mockData";

interface EducationalContentCardProps {
  educationalContent: typeof dashboardMockData.educationalContent;
}

export function EducationalContentCard({ educationalContent }: EducationalContentCardProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="lg:col-span-7 h-64 rounded-2xl border bg-card p-6 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          {t("totalEducationalContent")}
        </h2>
        <Link
          href="/dashboard/courses"
          className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          {t("manageCourses")}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="flex flex-col gap-2 p-3.5 rounded-xl border bg-background hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t("coursesCount")}</span>
            <BookOpen className="size-4 text-chart-1" />
          </div>
          <span className="text-2xl font-bold">{educationalContent.courses}</span>
        </div>

        <div className="flex flex-col gap-2 p-3.5 rounded-xl border bg-background hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t("lecturesCount")}</span>
            <Video className="size-4 text-chart-2" />
          </div>
          <span className="text-2xl font-bold">{educationalContent.lectures}</span>
        </div>

        <div className="flex flex-col gap-2 p-3.5 rounded-xl border bg-background hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t("questionsCount")}</span>
            <HelpCircle className="size-4 text-chart-3" />
          </div>
          <span className="text-2xl font-bold">
            {educationalContent.questions.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-3.5 rounded-xl border bg-background hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t("examsCount")}</span>
            <FileText className="size-4 text-chart-4" />
          </div>
          <span className="text-2xl font-bold">{educationalContent.exams}</span>
        </div>
      </div>
    </div>
  );
}
