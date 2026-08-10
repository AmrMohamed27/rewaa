"use client";
import {
  AreaChartWidget,
  BarChartWidget,
  BarListWidget,
  CategoryBarWidget,
  ComboChartWidget,
  DashboardGrid,
  DonutChartWidget,
  KpiCard,
  LineChartWidget,
  ProgressBarWidget,
  ProgressCircleWidget,
  SparkChartWidget,
  TrackerWidget,
  DataTableWidget,
} from "@/components/dashboard";
import { Activity, Clock, CreditCard, DollarSign } from "lucide-react";
import {
  revenueData,
  categoryData,
  trafficData,
  referrerData,
  sessionData,
  marketingData,
  statusData,
  sparkData,
  riskData,
  sessionColumns,
  kpiData,
} from "@/lib/mockData";

const iconMap = {
  DollarSign,
  CreditCard,
  Activity,
  Clock,
};

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      <DashboardGrid>
        {/* Row 1: KPI Cards */}
        {kpiData.map((kpi) => {
          const Icon = iconMap[kpi.icon as keyof typeof iconMap];
          return (
            <KpiCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              icon={<Icon className="size-4" />}
            />
          );
        })}

        {/* Row 2: Main Charts */}
        <AreaChartWidget
          span={2}
          title="Revenue Growth"
          description="Monthly revenue trends over the last 6 months."
          data={revenueData}
          categories={["Revenue", "Target"]}
          colors={["chart-1", "chart-2"]}
          valueFormatter={(number) => `$${Intl.NumberFormat("us").format(number).toString()}`}
        />

        <BarChartWidget
          span={2}
          title="Sales by Category"
          description="Comparison of sales across different product lines."
          data={categoryData}
          categories={["Sales"]}
          colors={["chart-3"]}
        />

        {/* Row 3: Mixed Charts */}
        <DonutChartWidget
          span={1}
          title="Traffic Source"
          description="User acquisition channels."
          data={trafficData}
          value="value"
          colors={["chart-1", "chart-2", "chart-3", "chart-4"]}
        />

        <BarListWidget
          span={1}
          title="Top Referrers"
          description="Highest traffic from external sites."
          data={referrerData}
          valueFormatter={(value) => `${value} visits`}
        />

        <LineChartWidget
          span={2}
          title="Active Sessions"
          description="Daily active users and session length."
          data={sessionData}
          categories={["Users", "Sessions"]}
          colors={["chart-4", "chart-5"]}
        />

        {/* Row 4: Advanced Widgets */}
        <ComboChartWidget
          span={2}
          title="Marketing ROI"
          description="Spend vs Conversions performance."
          data={marketingData}
          barSeries={{
            categories: ["Spend"],
            colors: ["chart-1"],
            valueFormatter: (v) => `$${v}`,
          }}
          lineSeries={{
            categories: ["Conversions"],
            colors: ["chart-2"],
          }}
          enableBiaxial
        />

        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBarWidget
            title="Quarterly Goal"
            description="Progress towards Q3 target."
            value={75}
            label="75%"
            variant="success"
            mdSpan={2}
          />
          <CategoryBarWidget
            title="Risk Assessment"
            description="System vulnerability scoring."
            data={riskData}
            colors={["chart-2", "chart-3", "chart-4", "chart-5"]}
            marker={{ value: 65, tooltip: "Current: Moderate Risk" }}
            mdSpan={2}
          />
        </div>
        <ProgressCircleWidget
          title="Uptime"
          value={99.9}
          radius={40}
          mdSpan={1}
          span={1}
          variant="success"
        />
        <ProgressCircleWidget
          title="Error Rate"
          value={0.5}
          max={5}
          radius={40}
          variant="error"
          span={1}
          mdSpan={1}
        />

        {/* Row 5: Status & Loading Examples */}
        <TrackerWidget
          span={2}
          mdSpan={2}
          title="Service Status"
          description="API availability over the last 30 days."
          data={statusData}
        />

        <SparkChartWidget
          span={2}
          title="Quick Trend"
          description="Last 24 hours activity."
          data={sparkData}
          variant="area"
          colors={["chart-1"]}
          mdSpan={2}
        />

        <DataTableWidget
          span={2}
          mdSpan={2}
          title="Session Details"
          description="Detailed view of user sessions per day."
          data={sessionData}
          columns={sessionColumns}
        />
      </DashboardGrid>
    </div>
  );
};

export default DashboardPage;
