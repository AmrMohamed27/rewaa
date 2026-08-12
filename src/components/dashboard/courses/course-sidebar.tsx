"use client";

import {
  BookOpen,
  Calendar,
  Clock,
  Globe,
  GraduationCap,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardCard } from "../overview/dashboard-card";
import { Course } from "@/types/course";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const t = useTranslations("courses");

  return (
    <DashboardCard className="p-5 space-y-4">
      <h3 className="text-sm font-bold text-foreground border-b border-border/40 pb-2">
        {t("details.overview")}
      </h3>

      <div className="space-y-3.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <User className="size-3.5 text-primary" />
            {t("details.teacher")}
          </span>
          <span className="font-semibold text-foreground">{course.teacherName}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <GraduationCap className="size-3.5 text-primary" />
            {t("details.grade")}
          </span>
          <span className="font-semibold text-foreground">{course.grade}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <BookOpen className="size-3.5 text-primary" />
            {t("details.subject")}
          </span>
          <span className="font-semibold text-foreground">{course.subject}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <Calendar className="size-3.5 text-primary" />
            {t("details.period")}
          </span>
          <span className="font-semibold text-foreground">{t(`period.${course.period}`)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <Globe className="size-3.5 text-primary" />
            {t("details.venue")}
          </span>
          <span className="font-semibold text-foreground">
            {course.venue === "all"
              ? t("venue.all")
              : course.venue === "online"
                ? t("venue.online")
                : t("venue.center")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <Clock className="size-3.5 text-primary" />
            {t("details.timeLimit")}
          </span>
          <span className="font-semibold text-foreground">
            {course.hasTimeLimit && course.timeLimitValue
              ? t("details.timeLimitDays", { days: course.timeLimitValue })
              : t("details.noTimeLimit")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <Users className="size-3.5 text-primary" />
            {t("details.groupsSplit")}
          </span>
          <span className="font-semibold text-foreground">
            {course.isSplitToGroups ? t("details.groupsSplitYes") : t("details.groupsSplitNo")}
          </span>
        </div>

        {course.hasOffer && course.offerPercentage && (
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-muted-foreground flex items-center gap-2">
              <Sparkles className="size-3.5 text-amber-500" />
              {t("details.offerLabel")}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {course.offerPercentage}
            </span>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
