import React from "react";
import { BarChart, BarChartProps } from "@/components/ui/charts/bar-chart";
import { WidgetCard } from "../widget-card";
import { BaseChartWidgetProps, ChartDataPoint } from "./types";
import { ChartWidgetSkeleton } from "./chart-skeleton";

interface BarChartWidgetProps extends BaseChartWidgetProps {
  data: ChartDataPoint[];
  index?: string;
  categories?: string[];
  colors?: BarChartProps["colors"];
  valueFormatter?: BarChartProps["valueFormatter"];
  type?: BarChartProps["type"];
  layout?: BarChartProps["layout"];
  showLegend?: boolean;
  showYAxis?: boolean;
}

export function BarChartWidget({
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
  type = "default",
  layout = "horizontal",
  showLegend = true,
  showYAxis = true,
  ...props
}: BarChartWidgetProps) {
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
          <BarChart
            data={data}
            index={index}
            categories={categories}
            colors={colors}
            valueFormatter={valueFormatter}
            type={type}
            layout={layout}
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
