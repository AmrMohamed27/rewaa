import React from "react";
import { CategoryBar, CategoryBarProps } from "@/components/ui/charts/category-bar";
import { WidgetCard } from "../widget-card";
import { BaseChartWidgetProps, ChartDataPoint } from "./types";
import { ChartWidgetSkeleton } from "./chart-skeleton";

interface CategoryBarWidgetProps extends BaseChartWidgetProps {
  data: ChartDataPoint[];
  colors?: CategoryBarProps["colors"];
  marker?: CategoryBarProps["marker"];
  showLabels?: boolean;
}

export function CategoryBarWidget({
  title,
  description,
  icon,
  loading,
  className,
  span,
  mdSpan,
  data,
  colors,
  marker,
  showLabels = true,
  ...props
}: CategoryBarWidgetProps) {
  const values = React.useMemo(() => data.map((d) => d.value ?? 0), [data]);

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
        <div className="flex-1 flex flex-col justify-center max-md:mt-4">
          <CategoryBar
            values={values}
            colors={colors}
            marker={marker}
            showLabels={showLabels}
            {...props}
          />
        </div>
      </div>
    </WidgetCard>
  );
}
