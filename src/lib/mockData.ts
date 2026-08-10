import { ColumnDef } from "@tanstack/react-table";

export const kpiData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    trend: { direction: "up" as const, label: "from last month", value: "20.1%" },
    icon: "DollarSign",
  },
  {
    title: "Subscriptions",
    value: "+2,350",
    trend: { direction: "up" as const, label: "from last month", value: "180.1%" },
    icon: "CreditCard",
  },
  {
    title: "Sales",
    value: "+12,234",
    trend: { direction: "up" as const, label: "from last month", value: "19%" },
    icon: "Activity",
  },
  {
    title: "Active Now",
    value: "+573",
    trend: { direction: "up" as const, label: "since last hour", value: "201" },
    icon: "Clock",
  },
];

export const revenueData = [
  { label: "Jan", Revenue: 4500, Target: 4000 },
  { label: "Feb", Revenue: 5200, Target: 4200 },
  { label: "Mar", Revenue: 4800, Target: 4500 },
  { label: "Apr", Revenue: 6100, Target: 4800 },
  { label: "May", Revenue: 5900, Target: 5200 },
  { label: "Jun", Revenue: 7200, Target: 5500 },
];

export const categoryData = [
  { label: "Electronics", Sales: 2400 },
  { label: "Apparel", Sales: 1900 },
  { label: "Home & Garden", Sales: 1200 },
  { label: "Software", Sales: 3100 },
];

export const trafficData = [
  { label: "Direct", value: 450 },
  { label: "Organic Search", value: 320 },
  { label: "Social Media", value: 180 },
  { label: "Referral", value: 90 },
];

export const referrerData = [
  { label: "google.com", value: 1200 },
  { label: "github.com", value: 950 },
  { label: "twitter.com", value: 600 },
  { label: "linkedin.com", value: 450 },
  { label: "producthunt.com", value: 300 },
];

export const sessionData = [
  { label: "Mon", Users: 240, Sessions: 400 },
  { label: "Tue", Users: 300, Sessions: 520 },
  { label: "Wed", Users: 280, Sessions: 480 },
  { label: "Thu", Users: 350, Sessions: 610 },
  { label: "Fri", Users: 320, Sessions: 590 },
  { label: "Sat", Users: 180, Sessions: 320 },
  { label: "Sun", Users: 150, Sessions: 280 },
];

export const marketingData = [
  { label: "Week 1", Spend: 1200, Conversions: 45 },
  { label: "Week 2", Spend: 1500, Conversions: 52 },
  { label: "Week 3", Spend: 1100, Conversions: 48 },
  { label: "Week 4", Spend: 1800, Conversions: 61 },
];

export const statusData = [
  { label: "1", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "2", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "3", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "4", color: "bg-yellow-500", tooltip: "Partial Outage" },
  { label: "5", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "6", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "7", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "8", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "9", color: "bg-red-500", tooltip: "Major Outage" },
  { label: "10", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "11", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "12", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "13", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "14", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "15", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "16", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "17", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "18", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "19", color: "bg-emerald-500", tooltip: "Operational" },
  { label: "20", color: "bg-emerald-500", tooltip: "Operational" },
];

export const sparkData = [
  { label: "1h", value: 40 },
  { label: "2h", value: 35 },
  { label: "3h", value: 55 },
  { label: "4h", value: 45 },
  { label: "5h", value: 60 },
  { label: "6h", value: 50 },
  { label: "7h", value: 75 },
  { label: "8h", value: 80 },
];

export const riskData = [
  { label: "Low", value: 20 },
  { label: "Medium", value: 30 },
  { label: "High", value: 40 },
  { label: "Critical", value: 10 },
];

export type SessionInfo = {
  label: string;
  Users: number;
  Sessions: number;
};

export const sessionColumns: ColumnDef<SessionInfo>[] = [
  {
    accessorKey: "label",
    header: "Day",
  },
  {
    accessorKey: "Users",
    header: "Users",
  },
  {
    accessorKey: "Sessions",
    header: "Sessions",
  },
];
