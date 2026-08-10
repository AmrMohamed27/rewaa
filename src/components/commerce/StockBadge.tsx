import React from "react";
import { Badge } from "@/components/ui/badge";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export interface StockBadgeProps {
  /** The stock status state */
  status: StockStatus;
  /** Optional custom text label override */
  customLabel?: string | null;
  /** Optional numerical count (e.g. "Only 3 left") */
  stockCount?: number | null;
  /** Custom class name for the wrapper element */
  className?: string;
}

/**
 * StockBadge displays stock availability states (in stock, low stock, out of stock, preorder)
 * with semantic styling and icons. Optimized for zero client hydration cost.
 */
export const StockBadge: React.FC<StockBadgeProps> = ({
  status,
  customLabel,
  stockCount,
  className = "",
}) => {
  // Determine text, styles, and dot indicator color based on status
  let label = "";
  let badgeClasses = "";
  let dotColor = "";

  switch (status) {
    case "in_stock":
      label = customLabel || "In Stock";
      badgeClasses =
        "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20";
      dotColor = "bg-emerald-500";
      break;
    case "low_stock":
      label = customLabel || (stockCount ? `Only ${stockCount} left` : "Low Stock");
      badgeClasses =
        "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20 animate-pulse";
      dotColor = "bg-amber-500";
      break;
    case "out_of_stock":
      label = customLabel || "Out of Stock";
      badgeClasses =
        "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-500/20";
      dotColor = "bg-rose-500";
      break;
    case "preorder":
      label = customLabel || "Available for Preorder";
      badgeClasses =
        "bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border-violet-500/20";
      dotColor = "bg-violet-500";
      break;
    default:
      label = "Status Unknown";
      badgeClasses = "bg-muted text-muted-foreground border-border";
      dotColor = "bg-muted-foreground";
  }

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border transition-all ${badgeClasses} ${className}`}
      data-testid="stock-badge"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
      <span>{label}</span>
    </Badge>
  );
};
