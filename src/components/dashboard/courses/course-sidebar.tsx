"use client";

import { useTranslations } from "next-intl";
import { DashboardCard } from "../overview/dashboard-card";
import { Course } from "@/types/course";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const t = useTranslations("courses");

  return (
    <DashboardCard className="p-6 space-y-4">
      <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3">
        {t("details.overview")}
      </h2>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("details.teacher")}</span>
          <span className="font-semibold text-foreground">{course.teacherName}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("details.grade")}</span>
          <span className="font-semibold text-foreground">{course.grade}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("details.subject")}</span>
          <span className="font-semibold text-foreground">{course.subject}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("details.period")}</span>
          <span className="font-semibold text-foreground">{t(`period.${course.period}`)}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("details.venue")}</span>
          <span className="font-semibold text-foreground">
            {course.venue === "all"
              ? t("venue.all")
              : course.venue === "online"
                ? t("venue.online")
                : t("venue.center")}
          </span>
        </div>

        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("details.timeLimit")}</span>
          <span className="font-semibold text-foreground">
            {course.hasTimeLimit && course.timeLimitValue
              ? t("details.timeLimitDays", { days: course.timeLimitValue })
              : t("details.noTimeLimit")}
          </span>
        </div>

        <div className="flex justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("details.groupsSplit")}</span>
          <span className="font-semibold text-foreground">
            {course.isSplitToGroups ? t("details.groupsSplitYes") : t("details.groupsSplitNo")}
          </span>
        </div>

        {course.hasOffer && course.offerPercentage && (
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">{t("details.offerLabel")}</span>
            <span className="font-bold text-emerald-600">{course.offerPercentage}</span>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
