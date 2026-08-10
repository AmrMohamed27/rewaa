import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "../widget-card";
import { cn } from "@/lib/utils";

interface ChartSkeletonProps {
  span?: 1 | 2 | 3 | 4;
  mdSpan?: 1 | 2;
  className?: string;
  type?: "default" | "donut" | "bar-list" | "tracker" | "spark";
}

export function ChartSkeleton({
  type = "default",
  isWidget,
}: {
  type?: ChartSkeletonProps["type"];
  isWidget?: boolean;
}) {
  return type === "donut" ? (
    <div className="flex items-center justify-center py-8">
      <Skeleton className="h-32 w-32 rounded-full" />
    </div>
  ) : type === "bar-list" ? (
    <div className="space-y-3 py-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  ) : type === "tracker" ? (
    <div className="flex gap-1 py-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="h-8 flex-1" />
      ))}
    </div>
  ) : (
    <div className="pt-4">
      <Skeleton
        className={cn("w-full", type === "spark" ? "h-28" : isWidget ? "h-[200px]" : "h-[220px]")}
      />
    </div>
  );
}

export function ChartWidgetSkeleton({
  span,
  mdSpan,
  className,
  type = "default",
}: ChartSkeletonProps) {
  return (
    <WidgetCard span={span} mdSpan={mdSpan} className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <ChartSkeleton type={type} isWidget />
      </div>
    </WidgetCard>
  );
}
