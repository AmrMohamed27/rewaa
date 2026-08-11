"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "vertical" | "horizontal" | "compact";
  valueClassName?: string;
  className?: string;
}

export function StatTile({
  label,
  value,
  icon,
  variant = "vertical",
  valueClassName,
  className,
}: StatTileProps) {
  if (variant === "horizontal") {
    return (
      <div
        className={cn(
          "p-3 rounded-xl border bg-muted/30 flex flex-row justify-between items-center text-start",
          className,
        )}
      >
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className={cn("text-lg font-bold text-foreground", valueClassName)}>{value}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-col gap-1 p-3 rounded-xl bg-muted/40 border", className)}>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className={cn("text-lg font-semibold text-foreground", valueClassName)}>{value}</span>
      </div>
    );
  }

  // default vertical layout
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-3.5 rounded-xl border bg-background hover:bg-muted/30 transition-colors",
        className,
      )}
    >
      <div className="flex items-center justify-center flex-col gap-4 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={cn("text-2xl font-bold text-foreground text-center", valueClassName)}>
        {value}
      </span>
    </div>
  );
}
