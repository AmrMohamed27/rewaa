"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Building2, ArrowUpRight } from "lucide-react";
import { ProgressBar } from "@/components/ui/charts/progress-bar";
import { dashboardMockData } from "@/lib/mockData";

interface GovernoratesBreakdownProps {
  governorates: typeof dashboardMockData.governorates;
}

export function GovernoratesBreakdown({ governorates }: GovernoratesBreakdownProps) {
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Building2 className="size-5 text-primary" />
          {t("governoratesTitle")}
        </h2>
        <Link
          href="/dashboard/governorates"
          className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          {t("displayAllGovernorates")}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {governorates.map((gov) => {
          const isOthers = gov.key === "others";
          const displayName = t(`governoratesList.${gov.key}`);

          return (
            <div
              key={gov.key}
              className="rounded-2xl border bg-card p-4 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-1">
                  <span className="font-semibold text-foreground truncate">{displayName}</span>
                  <span className="text-primary font-bold">{gov.percentage}%</span>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {gov.count.toLocaleString()}
                </div>
                <p className="text-[11px] text-muted-foreground">{tNav("students")}</p>
              </div>

              <ProgressBar value={gov.percentage} variant={isOthers ? "neutral" : "default"} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
