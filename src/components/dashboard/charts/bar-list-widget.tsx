import React from "react";
import { BarList, BarListProps } from "@/components/ui/charts/bar-list";
import { WidgetCard } from "../widget-card";
import { BaseChartWidgetProps, ChartDataPoint } from "./types";
import { ChartWidgetSkeleton } from "./chart-skeleton";

interface BarListWidgetProps extends BaseChartWidgetProps {
  data: ChartDataPoint[];
  valueFormatter?: BarListProps["valueFormatter"];
  sortOrder?: BarListProps["sortOrder"];
}

type BarListItem = {
  name: string;
  value: number;
  key?: string;
  href?: string;
};

function normalizeBarListData(data: ChartDataPoint[]): BarListItem[] {
  return data
    .map((item, index) => {
      const name = typeof item.label === "string" ? item.label : `Item ${index + 1}`;

      const rawValue = item.value;

      const value = typeof rawValue === "number" ? rawValue : Number(rawValue);

      if (Number.isNaN(value)) {
        return null;
      }

      return {
        name,
        value,
        key: typeof item.key === "string" ? (item.key as string) : undefined,
        href: typeof item.href === "string" ? (item.href as string) : undefined,
      } as BarListItem;
    })
    .filter((item): item is BarListItem => item !== null);
}

export function BarListWidget({
  title,
  description,
  icon,
  loading,
  className,
  span,
  mdSpan,
  data,
  valueFormatter,
  sortOrder = "descending",
  ...props
}: BarListWidgetProps) {
  const normalizedData = React.useMemo(() => normalizeBarListData(data), [data]);
  if (loading) {
    return (
      <ChartWidgetSkeleton span={span} mdSpan={mdSpan} className={className} type="bar-list" />
    );
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
        <div className="flex-1 mt-4">
          <BarList
            data={normalizedData}
            valueFormatter={valueFormatter}
            sortOrder={sortOrder}
            color="chart-6"
            {...props}
          />
        </div>
      </div>
    </WidgetCard>
  );
}
