import { Tracker } from "@/components/ui/charts/tracker";
import { WidgetCard } from "../widget-card";
import { ChartWidgetSkeleton } from "./chart-skeleton";
import { BaseChartWidgetProps, ChartDataPoint } from "./types";

interface TrackerWidgetProps extends BaseChartWidgetProps {
  data: ChartDataPoint[];
  defaultBackgroundColor?: string;
  hoverEffect?: boolean;
}

export function TrackerWidget({
  title,
  description,
  icon,
  loading,
  className,
  span,
  mdSpan,
  data,
  defaultBackgroundColor,
  hoverEffect = true,
  ...props
}: TrackerWidgetProps) {
  if (loading) {
    return <ChartWidgetSkeleton span={span} mdSpan={mdSpan} className={className} type="tracker" />;
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
          <Tracker
            data={data.map((item, i) => ({
              color: (item.color as string) || "bg-gray-500",
              tooltip: (item.tooltip as string) || (item.label as string),
              key: item.key ? (item.key as string | number) : i,
            }))}
            defaultBackgroundColor={defaultBackgroundColor}
            hoverEffect={hoverEffect}
            {...props}
          />
        </div>
      </div>
    </WidgetCard>
  );
}
