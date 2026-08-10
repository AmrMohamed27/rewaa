"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SortOption {
  value: string;
  label: string;
}

export interface ProductSortProps {
  /** The currently active sort value option */
  value: string;
  /** Callback triggered when a new sort option is selected */
  onChange: (value: string) => void;
  /** Optional custom sort options to display */
  options?: SortOption[];
  className?: string;
}

const defaultSortOptions: SortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
];

/**
 * ProductSort renders a responsive, accessible dropdown selector for sorting product listing pages.
 */
export const ProductSort: React.FC<ProductSortProps> = ({
  value,
  onChange,
  options = defaultSortOptions,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid="product-sort">
      <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Sort by</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="w-[180px] h-9 text-xs font-semibold bg-card border-border/80 focus-visible:ring-offset-0 focus:ring-1 cursor-pointer"
          aria-label="Sort product listings"
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent align="end" className="text-xs font-semibold z-50">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
