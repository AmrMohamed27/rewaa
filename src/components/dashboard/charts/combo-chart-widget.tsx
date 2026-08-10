import React from "react";
import { ComboChart, type ComboChartProps } from "@/components/ui/charts/combo-chart";
import { WidgetCard } from "../widget-card";
import { BaseChartWidgetProps, ChartDataPoint } from "./types";
import { ChartWidgetSkeleton } from "./chart-skeleton";

interface ComboChartWidgetProps extends BaseChartWidgetProps {
  data: ChartDataPoint[];
  index?: string;
  barSeries: ComboChartProps["barSeries"];
  lineSeries?: ComboChartProps["lineSeries"];
  enableBiaxial?: boolean;
  showLegend?: boolean;
}

export function ComboChartWidget({
  title,
  description,
  icon,
  loading,
  className,
  span,
  mdSpan,
  data,
  index = "label",
  barSeries,
  lineSeries,
  enableBiaxial = false,
  showLegend = true,
  ...props
}: ComboChartWidgetProps) {
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
        <div className="flex-1 min-h-[300px]">
          <ComboChart
            data={data}
            index={index}
            barSeries={barSeries}
            lineSeries={lineSeries}
            enableBiaxial={enableBiaxial}
            showLegend={showLegend}
            className="h-full"
            {...props}
          />
        </div>
      </div>
    </WidgetCard>
  );
}
