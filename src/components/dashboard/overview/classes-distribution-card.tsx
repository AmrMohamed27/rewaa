"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import { ProgressBar } from "@/components/ui/charts/progress-bar";
import { dashboardMockData } from "@/lib/mockData";

interface ClassesDistributionCardProps {
  classesDistribution: typeof dashboardMockData.classesDistribution;
  totalStudents: number;
}

export function ClassesDistributionCard({
  classesDistribution,
  totalStudents,
}: ClassesDistributionCardProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="lg:col-span-4 rounded-2xl border bg-card p-6 flex flex-col justify-between shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <Users className="size-5 text-primary" />
          {t("classesDistribution")}
        </h2>

        <div className="flex flex-col gap-5">
          {classesDistribution.map((cls) => (
            <div key={cls.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">{t(`classesList.${cls.key}`)}</span>
                <span className="text-muted-foreground">
                  {cls.students.toLocaleString()} ({cls.percentage}%)
                </span>
              </div>
              <ProgressBar value={cls.percentage} variant="default" showAnimation />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t text-xs text-muted-foreground text-center">
        {t("totalStudents")}: {totalStudents.toLocaleString()}
      </div>
    </div>
  );
}
