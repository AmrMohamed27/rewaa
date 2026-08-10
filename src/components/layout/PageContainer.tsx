import { cn } from "@/lib/utils";
import React from "react";

/**
 * Types for supported max-width values corresponding to Tailwind's max-w classes.
 */
type MaxWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "full"
  | "prose"
  | "screen-sm"
  | "screen-md"
  | "screen-lg"
  | "screen-xl"
  | "screen-2xl";

interface PageContainerProps {
  children: React.ReactNode;
  /** Additional CSS classes to apply to the container. */
  className?: string;
  /**
   * The maximum width of the container.
   * @default "7xl"
   */
  maxWidth?: MaxWidth;
}

const maxWidthMap: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
  prose: "max-w-prose",
  "screen-sm": "max-w-screen-sm",
  "screen-md": "max-w-screen-md",
  "screen-lg": "max-w-screen-lg",
  "screen-xl": "max-w-screen-xl",
  "screen-2xl": "max-w-screen-2xl",
};

/**
 * PageContainer standardizes the padding and max-width for children elements.
 * Use it to wrap the main content of a page or layout.
 */
export function PageContainer({ children, className, maxWidth = "7xl" }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 container",
        maxWidthMap[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}
