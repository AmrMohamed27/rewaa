import * as React from "react";
import { cn } from "@/lib/utils";

interface DashboardGridProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export function DashboardGrid({ children, className, ...props }: DashboardGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
