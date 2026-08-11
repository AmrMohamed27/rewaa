"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { dashboardMockData } from "@/lib/mockData";

interface TotalStudentsCardProps {
  students: typeof dashboardMockData.students;
}

export function TotalStudentsCard({ students }: TotalStudentsCardProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="lg:col-span-5 h-64 rounded-2xl border bg-card p-6 flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <GraduationCap className="size-5 text-primary" />
          <span>{t("totalStudents")}</span>
        </div>
        <div className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {students.total.toLocaleString()}
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/40 border">
          <span className="text-xs text-muted-foreground font-medium">{t("activeToday")}</span>
          <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            {students.activeToday.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/40 border">
          <span className="text-xs text-muted-foreground font-medium font-medium">
            {t("newAccountsToday")}
          </span>
          <span className="text-lg font-semibold text-primary">
            {students.newToday.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
