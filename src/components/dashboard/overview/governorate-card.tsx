"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ProgressBar } from "@/components/ui/charts/progress-bar";

interface GovernorateCardProps {
  displayName: string;
  percentage: number;
  count: number;
  isOthers?: boolean;
}

export function GovernorateCard({
  displayName,
  percentage,
  count,
  isOthers = false,
}: GovernorateCardProps) {
  const tNav = useTranslations("nav");

  return (
    <div className="rounded-2xl border bg-card p-4 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-1">
          <span className="font-semibold text-foreground truncate">{displayName}</span>
          <span className="text-primary font-bold">{percentage}%</span>
        </div>
        <div className="text-lg font-bold text-foreground">{count.toLocaleString()}</div>
        <p className="text-[11px] text-muted-foreground">{tNav("students")}</p>
      </div>

      <ProgressBar value={percentage} variant={isOthers ? "neutral" : "default"} />
    </div>
  );
}
