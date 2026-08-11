"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonutChart } from "@/components/ui/charts/donut-chart";
import { dashboardMockData } from "@/lib/mockData";

interface ExamActivityCardProps {
  examActivityToday: typeof dashboardMockData.examActivityToday;
}

export function ExamActivityCard({ examActivityToday }: ExamActivityCardProps) {
  const t = useTranslations("dashboard");

  const localizedChartData = examActivityToday.chartData.map((item) => {
    const key =
      item.label.toLowerCase() === "passed"
        ? "examPassed"
        : item.label.toLowerCase() === "failed"
          ? "examFailed"
          : null;
    return {
      ...item,
      label: key ? t(key) : item.label,
    };
  });

  return (
    <div className="lg:col-span-4 rounded-2xl border bg-card p-6 flex flex-col justify-between shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <CheckCircle2 className="size-5 text-emerald-500" />
          {t("examActivityToday")}
        </h2>

        {/* Donut Chart */}
        <div className="flex flex-col items-center justify-center relative my-2">
          <DonutChart
            data={localizedChartData}
            category="label"
            value="value"
            colors={["chart-1", "chart-2"]}
            showLabel={false}
            className="size-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs text-muted-foreground font-medium">{t("successRate")}</span>
            <span className="text-2xl font-bold text-foreground">
              {examActivityToday.successRate}%
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div className="p-3 rounded-xl border bg-muted/30 text-start flex flex-row justify-between items-center">
            <span className="text-xs text-muted-foreground block font-medium">
              {t("studentsExamsToday")}
            </span>
            <span className="text-lg font-bold text-foreground block">
              {examActivityToday.studentsCount.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl border bg-muted/30 text-start flex flex-row justify-between items-center">
            <span className="text-xs text-muted-foreground block font-medium">
              {t("averageGrade")}
            </span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">
              {examActivityToday.averageGrade}
            </span>
          </div>
        </div>
      </div>

      <Button asChild className="w-full mt-6 font-bold">
        <Link href="/dashboard/exams" className="w-full flex items-center justify-center gap-2">
          {t("activityDetails")}
          <ArrowUpRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
