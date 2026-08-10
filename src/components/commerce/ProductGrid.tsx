"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ProductCard, ProductCardProps } from "./ProductCard";

export interface ProductGridProps {
  /** Array of products to display in the grid */
  products: Array<
    Omit<ProductCardProps, "loading"> & {
      id: string;
      title: string;
    }
  >;
  /** Responsive columns Tailwind grids class (default: grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4) */
  columnsClass?: string;
  /** Loading state indicator */
  loading?: boolean;
  /** Number of loading card skeletons to render on initial page loading */
  skeletonCount?: number;
  /** Custom empty state title override */
  emptyStateTitle?: string;
  /** Custom empty state descriptive text override */
  emptyStateDescription?: string;
  /** Optional interactive action configuration for empty state */
  emptyStateAction?: {
    label: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    href?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
  /** Extensibility pagination element slot (rendered at the bottom of the grid) */
  paginationSlot?: React.ReactNode;
  /** React ref to bind with IntersectionObserver for loading infinite scroll pages */
  infiniteScrollTriggerRef?: React.RefObject<HTMLDivElement | null>;
  /** Indicates whether there are more infinite scroll pages to fetch */
  hasMoreInfiniteScroll?: boolean;
  className?: string;
}

/**
 * ProductGrid handles layout grids, card loaders, empty states, and pagination/scroll controls.
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columnsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  loading = false,
  skeletonCount = 8,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateAction,
  paginationSlot,
  infiniteScrollTriggerRef,
  hasMoreInfiniteScroll = false,
  className = "",
}) => {
  // Initial page loading state (zero products fetched yet)
  if (loading && products.length === 0) {
    return (
      <div className={cn("w-full py-2", className)} data-testid="product-grid-loading">
        <LoadingSkeleton
          variant="card"
          count={skeletonCount}
          className={cn("grid gap-6", columnsClass)}
        />
      </div>
    );
  }

  // Zero results / empty filters state
  if (!loading && products.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center min-h-[350px] w-full border border-dashed border-border/80 rounded-2xl p-8 bg-muted/5",
          className,
        )}
        data-testid="product-grid-empty"
      >
        <EmptyState
          icon={PackageOpen}
          title={emptyStateTitle || "No products found"}
          description={
            emptyStateDescription ||
            "We couldn't find any products matching your filters. Try adjusting your filter preferences or browse a different category."
          }
          action={emptyStateAction}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-8 w-full", className)} data-testid="product-grid">
      {/* Product Cards Layout Grid */}
      <div className={cn("grid gap-6", columnsClass)}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}

        {/* Append card skeletons inline if loading next pages (infinite scroll/pagination fetch) */}
        {loading &&
          Array.from({ length: 4 }).map((_, idx) => (
            <ProductCard
              key={`loading-cell-${idx}`}
              id={`loading-cell-${idx}`}
              title=""
              image=""
              basePrice={0}
              stockStatus="in_stock"
              loading
            />
          ))}
      </div>

      {/* Pagination Controls Slot */}
      {!loading && paginationSlot && (
        <div className="flex justify-center items-center mt-4 w-full" data-testid="grid-pagination">
          {paginationSlot}
        </div>
      )}

      {/* Infinite Scroll Trigger Ref Area */}
      {infiniteScrollTriggerRef && hasMoreInfiniteScroll && (
        <div
          ref={infiniteScrollTriggerRef}
          className="flex justify-center items-center py-6 w-full border-t border-border/40 mt-4"
          aria-live="polite"
          role="status"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <span className="animate-spin size-4 border-2 border-primary border-t-transparent rounded-full" />
            <span>Loading more products...</span>
          </div>
        </div>
      )}
    </div>
  );
};
