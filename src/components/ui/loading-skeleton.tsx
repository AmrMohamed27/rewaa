import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual variant layout of the skeleton.
   * - `card`: A full card skeleton with image placeholder and text lines
   * - `text`: Paragraph blocks with varying width lines
   * - `image`: A standard image placeholder with centering icon
   * - `circle`: A circular avatar skeleton
   * - `rect`: Standard rectangular block
   */
  variant?: "card" | "text" | "image" | "circle" | "rect";

  /**
   * Number of lines of text to render. Only applies to `text` variant.
   */
  lines?: number;

  /**
   * Aspect ratio of the image. Applies to `image` and `card` variants.
   * e.g., 'aspect-video', 'aspect-square', 'aspect-auto'
   */
  aspectRatio?: string;

  /**
   * Number of duplicate skeleton items to render (e.g. grids of cards).
   */
  count?: number;

  /**
   * Screen reader text to announce to assistive technologies.
   */
  srText?: string;
}

export function LoadingSkeleton({
  variant = "rect",
  lines = 3,
  aspectRatio = "aspect-video",
  count = 1,
  srText = "Loading content...",
  className,
  ...props
}: LoadingSkeletonProps) {
  // Announcement text for screen readers
  const screenReaderLabel = (
    <span className="sr-only" aria-live="polite" role="status">
      {srText}
    </span>
  );

  const renderSingle = (index: number) => {
    switch (variant) {
      case "card":
        return (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-4 rounded-xl border border-border p-4 bg-card shadow-xs",
              className,
            )}
            aria-hidden="true"
            {...props}
          >
            {/* Image Box */}
            <div
              className={cn(
                "relative overflow-hidden rounded-lg bg-muted flex items-center justify-center",
                aspectRatio,
              )}
            >
              <ImageIcon className="size-8 text-muted-foreground/30 animate-pulse" />
            </div>

            {/* Description lines */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        );

      case "text":
        return (
          <div
            key={index}
            className={cn("flex flex-col gap-2.5 w-full", className)}
            aria-hidden="true"
            {...props}
          >
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  "h-4",
                  // Make the last line shorter for a realistic paragraph look
                  i === lines - 1 && lines > 1 ? "w-2/3" : "w-full",
                )}
              />
            ))}
          </div>
        );

      case "image":
        return (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden rounded-lg bg-muted flex items-center justify-center",
              aspectRatio,
              className,
            )}
            aria-hidden="true"
            {...props}
          >
            <ImageIcon className="size-8 text-muted-foreground/30 animate-pulse" />
          </div>
        );

      case "circle":
        return (
          <Skeleton
            key={index}
            className={cn("rounded-full shrink-0", className)}
            aria-hidden="true"
            {...props}
          />
        );

      case "rect":
      default:
        return (
          <Skeleton key={index} className={cn("w-full", className)} aria-hidden="true" {...props} />
        );
    }
  };

  if (count > 1) {
    return (
      <div
        className={cn(
          variant === "card"
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "flex flex-col gap-6",
        )}
        aria-busy="true"
      >
        {screenReaderLabel}
        {Array.from({ length: count }).map((_, idx) => renderSingle(idx))}
      </div>
    );
  }

  return (
    <div className="contents" aria-busy="true">
      {screenReaderLabel}
      {renderSingle(0)}
    </div>
  );
}
