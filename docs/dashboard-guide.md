# Dashboard Documentation Guide

This guide explains how to use the dashboard layout system and the various widget components available in the project.

---

## Layout System

The dashboard uses a responsive grid system based on a 4-column layout (on desktop).

### `DashboardGrid`

The `DashboardGrid` component is the main container. It automatically handles responsive column counts:

- **Mobile**: 1 column
- **Medium (Tablets)**: 2 columns
- **Extra Large (Desktop)**: 4 columns

```tsx
import { DashboardGrid } from "@/components/dashboard";

<DashboardGrid>{/* Widgets go here */}</DashboardGrid>;
```

### `WidgetCard` & Spanning

All widgets (except KPI cards) wrap their content in a `WidgetCard`. You can control how many columns a widget spans using the `span` and `mdSpan` props.

- `span`: Number of columns on desktop (1-4). Defaults to 1.
- `mdSpan`: Number of columns on tablet/medium screens (1-2).

```tsx
<BarChartWidget
  span={2} // Takes up 2/4 columns on desktop
  mdSpan={2} // Takes up 2/2 columns on tablet
  {...props}
/>
```

---

## Available Widgets

### 1. KPI Cards

Small, high-level metric cards used at the top of the dashboard.

- **Props**: `title`, `value`, `icon`, `trend`.
- **Trend**: Includes `value`, `label`, and `direction` ("up" | "down" | "neutral").

```tsx
<KpiCard
  title="Total Revenue"
  value="$45,231.89"
  icon={<DollarSign className="size-4" />}
  trend={{ value: "20.1%", direction: "up", label: "from last month" }}
/>
```

### 2. Chart Widgets

Robust wrappers around chart components that include titles, descriptions, and loading states.

- `AreaChartWidget`
- `BarChartWidget`
- `LineChartWidget`
- `DonutChartWidget`
- `ComboChartWidget`
- `SparkChartWidget`

### 3. Specialty Widgets

- `BarListWidget`: Ranked list of items with bars.
- `TrackerWidget`: Status tracking over time (e.g., uptime).
- `CategoryBarWidget`: Multi-segment bar with markers.
- `ProgressBarWidget` & `ProgressCircleWidget`.
- `DataTableWidget`: TanStack Table integration for detailed data.

---

## Data Structures

Most chart widgets consume an array of `ChartDataPoint` objects.

```typescript
interface ChartDataPoint {
  label: string; // X-axis label
  [key: string]: string | number | undefined; // Metric values
}
```

### Example Data

```typescript
const revenueData = [
  { label: "Jan", Revenue: 4500, Target: 4000 },
  { label: "Feb", Revenue: 5200, Target: 4000 },
];
```

### Passing Data to Widgets

Use the `categories` prop to specify which keys in your data objects should be plotted.

```tsx
<AreaChartWidget
  data={revenueData}
  index="label" // Key for x-axis
  categories={["Revenue"]} // Keys to plot
  {...props}
/>
```

---

## Color System

The dashboard uses a semantic color system defined in `globals.css`. Instead of hex codes, use the semantic keys:

- `chart-1` (Primary)
- `chart-2`
- `chart-3`
- `chart-4`
- `chart-5`

These colors automatically adapt to Light and Dark modes.

```tsx
<BarChartWidget
  colors={["chart-1", "chart-3"]} // Applies colors to categories in order
  {...props}
/>
```

---

## Component Reference

### Common Props (Chart Widgets)

All chart widgets share these base props:

| Prop          | Type               | Description                       |
| :------------ | :----------------- | :-------------------------------- |
| `title`       | `string`           | Main header text                  |
| `description` | `string`           | Sub-header text (optional)        |
| `icon`        | `ReactNode`        | Lucide icon or similar (optional) |
| `loading`     | `boolean`          | Shows a skeleton loader when true |
| `span`        | `1 \| 2 \| 3 \| 4` | Desktop column span               |
| `mdSpan`      | `1 \| 2`           | Tablet column span                |

### Feature-Specific Props

#### `DonutChartWidget`

- `value`: The key in data to use for segments (defaults to "value").
- `category`: The key for the segment label (defaults to "label").

#### `ComboChartWidget`

- `barSeries`: Configuration for bars (`categories`, `colors`).
- `lineSeries`: Configuration for lines (`categories`, `colors`).

#### `DataTableWidget`

- `columns`: TanStack Table column definitions.
- `data`: Array of objects.
