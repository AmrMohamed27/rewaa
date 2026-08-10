import React from "react";
import { DonutChart, type DonutChartProps } from "@/components/ui/charts/donut-chart";
import { WidgetCard } from "../widget-card";
import { BaseChartWidgetProps, ChartDataPoint } from "./types";
import { ChartWidgetSkeleton } from "./chart-skeleton";

interface DonutChartWidgetProps extends BaseChartWidgetProps {
  data: ChartDataPoint[];
  category?: string;
  value?: string;
  colors?: DonutChartProps["colors"];
  valueFormatter?: DonutChartProps["valueFormatter"];
  variant?: DonutChartProps["variant"];
  showLabel?: boolean;
}

export function DonutChartWidget({
  title,
  description,
  icon,
  loading,
  className,
  span,
  mdSpan,
  data,
  category = "label",
  value = "value",
  colors,
  valueFormatter,
  variant = "donut",
  showLabel = true,
  ...props
}: DonutChartWidgetProps) {
  if (loading) {
    return <ChartWidgetSkeleton span={span} mdSpan={mdSpan} className={className} type="donut" />;
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
          <DonutChart
            data={data}
            category={category}
            value={value}
            colors={colors}
            valueFormatter={valueFormatter}
            variant={variant}
            showLabel={showLabel}
            className="size-48"
            {...props}
          />
        </div>
      </div>
    </WidgetCard>
  );
}
