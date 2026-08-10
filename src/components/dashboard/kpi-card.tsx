import * as React from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetCard } from "./widget-card";
import { Skeleton } from "@/components/ui/skeleton";

export interface TrendProps {
  value: number | string;
  label?: string;
  direction: "up" | "down" | "neutral";
}

export function TrendIndicator({ value, label, direction }: TrendProps) {
  const isPositive = direction === "up";
  const isNegative = direction === "down";
  const isNeutral = direction === "neutral";

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        isPositive && "text-green-600 dark:text-green-400",
        isNegative && "text-red-600 dark:text-red-400",
        isNeutral && "text-muted-foreground",
      )}
    >
      {isPositive && <ArrowUp className="h-3 w-3" />}
      {isNegative && <ArrowDown className="h-3 w-3" />}
      {isNeutral && <Minus className="h-3 w-3" />}
      <span>
        {isPositive && "+"}
        {value}
      </span>
      {label && <span className="text-muted-foreground font-normal ml-1">{label}</span>}
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: TrendProps;
  className?: string;
}

export function KpiCard({ title, value, icon, trend, className }: KpiCardProps) {
  return (
    <WidgetCard className={cn("overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <span className="text-3xl font-bold tracking-tight">{value}</span>
        </div>
        {icon && <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>}
      </div>
      {trend && (
        <div className="mt-4">
          <TrendIndicator {...trend} />
        </div>
      )}
    </WidgetCard>
  );
}

export function KpiCardSkeleton() {
  return (
    <WidgetCard>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-4 w-40" />
      </div>
    </WidgetCard>
  );
}

export function WidgetSkeleton({ className }: { className?: string }) {
  return (
    <WidgetCard className={className}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="flex-1 w-full rounded-md min-h-[100px]" />
      </div>
    </WidgetCard>
  );
}
