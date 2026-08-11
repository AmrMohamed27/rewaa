"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function DashboardBanner() {
  const t = useTranslations("dashboard");

  return (
    <div className="relative h-64 w-full rounded-2xl border bg-card p-6 md:p-8 flex flex-col justify-center overflow-hidden shadow-sm">
      {/* Background Image on the end side with smooth gradient overlay */}
      <div className="absolute inset-y-0 right-0 left-auto rtl:left-0 rtl:right-auto w-full md:w-1/2 pointer-events-none overflow-hidden">
        <Image
          src="/dashboard-bg.jpg"
          alt="Dashboard Header"
          fill
          priority
          className="object-cover object-center opacity-25 dark:opacity-20 mask-radial-fade ltr:mask-[linear-gradient(to_right,transparent,black_70%)] rtl:mask-[linear-gradient(to_left,transparent,black_70%)]"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {t("welcomeTitle", { userName: "Admin" })}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {t("welcomeSubtitle")}
        </p>
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Button size="default" className="font-bold">
            {t("downloadReport")}
          </Button>
          <Button variant="outline" size="default" className="font-bold">
            {t("manageSettings")}
          </Button>
        </div>
      </div>
    </div>
  );
}
