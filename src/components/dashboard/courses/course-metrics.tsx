"use client";

import { DollarSign, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { StatTile } from "../overview/stat-tile";
import { Course } from "@/types/course";

interface CourseMetricsProps {
  course: Course;
}

export function CourseMetrics({ course }: CourseMetricsProps) {
  const t = useTranslations("courses");

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatTile
        label={t("details.totalStudents")}
        value={course.numberOfParticipants}
        icon={<Users className="size-4 text-primary" />}
      />
      <StatTile
        label={t("details.revenue")}
        value={`${(course.numberOfParticipants * course.price).toLocaleString()} ${t("card.egp")}`}
        icon={<DollarSign className="size-4 text-emerald-500" />}
      />
    </div>
  );
}
