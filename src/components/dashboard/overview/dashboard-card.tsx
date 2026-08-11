"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DashboardCard({ children, className, ...props }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 flex flex-col justify-between shadow-sm transition-shadow",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
