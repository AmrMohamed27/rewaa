"use client";
import { SparkAreaChart, SparkLineChart, SparkBarChart } from "@/components/ui/charts/spark-chart";
import { WidgetCard } from "../widget-card";
import { BaseChartWidgetProps, ChartDataPoint } from "./types";
import { ChartWidgetSkeleton } from "./chart-skeleton";
import { AvailableChartColorsKeys } from "@/lib/chart-utils";

interface SparkChartWidgetProps extends BaseChartWidgetProps {
  data: ChartDataPoint[];
  index?: string;
  categories?: string[];
  colors?: AvailableChartColorsKeys[];
  variant?: "area" | "line" | "bar";
}

export function SparkChartWidget({
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
  variant = "area",
  ...props
}: SparkChartWidgetProps) {
  if (loading) {
    return <ChartWidgetSkeleton span={span} mdSpan={mdSpan} className={className} />;
  }

  const ChartComponent =
    variant === "line" ? SparkLineChart : variant === "bar" ? SparkBarChart : SparkAreaChart;

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
          <ChartComponent
            data={data}
            index={index}
            categories={categories}
            colors={colors}
            className="w-full h-24"
            {...props}
          />
        </div>
      </div>
    </WidgetCard>
  );
}
