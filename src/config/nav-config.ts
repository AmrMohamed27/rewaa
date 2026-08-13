import {
  LayoutDashboard,
  Video,
  BookOpen,
  Users,
  CreditCard,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavConfig {
  primaryLink: {
    label: string;
    href: string;
  };
  sidebarNav: NavItem[];
}

export const navConfig: NavConfig = {
  primaryLink: {
    label: "Dashboard",
    href: "/dashboard",
  },
  sidebarNav: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Lectures",
      href: "/dashboard/lectures",
      icon: Video,
    },
    {
      label: "Courses",
      href: "/dashboard/courses",
      icon: BookOpen,
    },
    {
      label: "Lessons",
      href: "/dashboard/lessons",
      icon: Video,
    },
    {
      label: "Students",
      href: "/dashboard/students",
      icon: Users,
    },
    {
      label: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ],
};
