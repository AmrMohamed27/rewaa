"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Building2 } from "lucide-react";
import { dashboardMockData } from "@/lib/mockData";
import { DashboardCardHeader } from "./dashboard-card-header";
import { GovernorateCard } from "./governorate-card";

interface GovernoratesBreakdownProps {
  governorates: typeof dashboardMockData.governorates;
}

export function GovernoratesBreakdown({ governorates }: GovernoratesBreakdownProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="flex flex-col gap-4">
      <DashboardCardHeader
        className="mb-0"
        icon={<Building2 className="size-5 text-primary" />}
        title={t("governoratesTitle")}
        action={{
          label: t("displayAllGovernorates"),
          href: "/dashboard/governorates",
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {governorates.map((gov) => {
          const isOthers = gov.key === "others";
          const displayName = t(`governoratesList.${gov.key}`);

          return (
            <GovernorateCard
              key={gov.key}
              displayName={displayName}
              percentage={gov.percentage}
              count={gov.count}
              isOthers={isOthers}
            />
          );
        })}
      </div>
    </div>
  );
}
