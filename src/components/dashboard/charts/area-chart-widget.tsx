import React from "react";
import { AreaChart } from "@/components/ui/charts/area-chart";
import type { AreaChartProps } from "@/components/ui/charts/area-chart";
import { WidgetCard } from "../widget-card";
import { BaseChartWidgetProps, ChartDataPoint } from "./types";
import { ChartWidgetSkeleton } from "./chart-skeleton";

interface AreaChartWidgetProps extends BaseChartWidgetProps {
  data: ChartDataPoint[];
  index?: string;
  categories?: string[];
  colors?: AreaChartProps["colors"];
  valueFormatter?: AreaChartProps["valueFormatter"];
  showLegend?: boolean;
  showYAxis?: boolean;
}

export function AreaChartWidget({
  title,
  description,
  icon,
  loading,
  className,
  span,
  mdSpan,
  data,
  index = "label",
  categories = ["value"],
  colors,
  valueFormatter,
  showLegend = true,
  showYAxis = true,
  ...props
}: AreaChartWidgetProps) {
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
        <div className="flex-1 min-h-[250px]">
          <AreaChart
            data={data}
            index={index}
            categories={categories}
            colors={colors}
            valueFormatter={valueFormatter}
            showLegend={showLegend}
            showYAxis={showYAxis}
            className="h-full"
            {...props}
          />
        </div>
      </div>
    </WidgetCard>
  );
}
