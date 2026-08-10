import React from "react";
import { ProgressBar, ProgressBarProps } from "@/components/ui/charts/progress-bar";
import { WidgetCard } from "../widget-card";
import { BaseChartWidgetProps } from "./types";
import { ChartWidgetSkeleton } from "./chart-skeleton";

interface ProgressBarWidgetProps extends BaseChartWidgetProps {
  value: number;
  max?: number;
  label?: string;
  variant?: ProgressBarProps["variant"];
}

export function ProgressBarWidget({
  title,
  description,
  icon,
  loading,
  className,
  span,
  mdSpan,
  value,
  max = 100,
  label,
  variant,
  ...props
}: ProgressBarWidgetProps) {
  if (loading) {
    return <ChartWidgetSkeleton span={span} mdSpan={mdSpan} className={className} />;
  }

  return (
    <WidgetCard span={span} mdSpan={mdSpan} className={className}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {icon}
              {title}
            </h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center mt-4">
          <ProgressBar value={value} max={max} label={label} variant={variant} {...props} />
        </div>
      </div>
    </WidgetCard>
  );
}
