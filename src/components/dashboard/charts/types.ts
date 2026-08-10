import { ReactNode } from "react";

export interface ChartDataPoint {
  /** The primary label for the x-axis or category (e.g., "Jan", "Electronics") */
  label: string;
  /** The primary numeric value (optional, useful for single-metric charts) */
  value?: number;
  /** Additional numeric values for multi-metric charts (e.g., "Revenue": 4500) */
  [key: string]: string | number | undefined;
}

export interface BaseChartWidgetProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
  span?: 1 | 2 | 3 | 4;
  mdSpan?: 1 | 2;
}
