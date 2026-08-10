import React from "react";
import { ProgressCircle, ProgressCircleProps } from "@/components/ui/charts/progress-circle";
import { WidgetCard } from "../widget-card";
import { BaseChartWidgetProps } from "./types";
import { ChartWidgetSkeleton } from "./chart-skeleton";

interface ProgressCircleWidgetProps extends BaseChartWidgetProps {
  value: number;
  max?: number;
  variant?: ProgressCircleProps["variant"];
  radius?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function ProgressCircleWidget({
  title,
  description,
  icon,
  loading,
  className,
  span,
  mdSpan,
  value,
  max = 100,
  variant,
  radius = 32,
  strokeWidth = 6,
  children,
  ...props
}: ProgressCircleWidgetProps) {
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
        <div className="flex-1 flex items-center justify-center mt-4">
          <ProgressCircle
            value={value}
            max={max}
            variant={variant}
            radius={radius}
            strokeWidth={strokeWidth}
            {...props}
          >
            {children || (
              <span className="text-xs font-medium text-gray-900 dark:text-gray-50">
                {Math.round((value / max) * 100)}%
              </span>
            )}
          </ProgressCircle>
        </div>
      </div>
    </WidgetCard>
  );
}
