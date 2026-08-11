"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardHeaderProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
  badge?: React.ReactNode;
  className?: string;
}

export function DashboardCardHeader({
  icon,
  title,
  action,
  badge,
  className,
}: DashboardCardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-2 mb-4", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">{title}</h2>
        {badge}
      </div>

      {action && (
        <Link
          href={action.href}
          className="text-xs font-medium text-primary hover:underline shrink-0 inline-flex items-center gap-1"
        >
          {action.label}
          <ArrowUpRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
