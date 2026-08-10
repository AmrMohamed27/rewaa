"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ColorOption {
  name: string;
  value: string; // e.g. "#000000" or "#FFFFFF"
  status: "in_stock" | "low_stock" | "out_of_stock" | "preorder";
}

export interface SizeOption {
  name: string; // e.g. "S", "M", "L"
  status: "in_stock" | "low_stock" | "out_of_stock" | "preorder";
}

export interface VariantSelectorProps {
  /** Array of color options */
  colors?: ColorOption[] | null;
  /** Array of size options */
  sizes?: SizeOption[] | null;
  /** Currently selected color name */
  selectedColor?: string;
  /** Currently selected size name */
  selectedSize?: string;
  /** Callback when color changes */
  onChangeColor?: (colorName: string) => void;
  /** Callback when size changes */
  onChangeSize?: (sizeName: string) => void;
  /** Custom inventory mapping for specific combinations to determine if a size is available for a selected color, or vice versa */
  combinationStatus?: Array<{
    colorName: string;
    sizeName: string;
    status: "in_stock" | "low_stock" | "out_of_stock" | "preorder";
  }> | null;
  /** UI string localizations from CMS */
  uiStrings?: {
    colorGroupLabel?: string;
    sizeGroupLabel?: string;
  } | null;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  colors = [],
  sizes = [],
  selectedColor: propSelectedColor,
  selectedSize: propSelectedSize,
  onChangeColor,
  onChangeSize,
  combinationStatus,
  uiStrings,
  className = "",
}) => {
  const colorLabel = uiStrings?.colorGroupLabel || "Color";
  const sizeLabel = uiStrings?.sizeGroupLabel || "Size";
  // Local state fallbacks if component is used uncontrolled
  const [localColor, setLocalColor] = useState<string>(() => {
    if (propSelectedColor) return propSelectedColor;
    if (colors && colors.length > 0) {
      return (colors.find((c) => c.status !== "out_of_stock") || colors[0]).name;
    }
    return "";
  });

  const [localSize, setLocalSize] = useState<string>(() => {
    if (propSelectedSize) return propSelectedSize;
    if (sizes && sizes.length > 0) {
      return (sizes.find((s) => s.status !== "out_of_stock") || sizes[0]).name;
    }
    return "";
  });

  const [prevColors, setPrevColors] = useState(colors);
  const [prevSizes, setPrevSizes] = useState(sizes);

  if (colors !== prevColors) {
    setPrevColors(colors);
    const newColor =
      colors && colors.length > 0
        ? (colors.find((c) => c.status !== "out_of_stock") || colors[0]).name
        : "";
    setLocalColor(newColor);
  }

  if (sizes !== prevSizes) {
    setPrevSizes(sizes);
    const newSize =
      sizes && sizes.length > 0
        ? (sizes.find((s) => s.status !== "out_of_stock") || sizes[0]).name
        : "";
    setLocalSize(newSize);
  }

  const activeColor = propSelectedColor ? propSelectedColor : localColor;
  const activeSize = propSelectedSize ? propSelectedSize : localSize;

  // Helper to determine status of a size based on selected color and combination inventory
  const getSizeStatus = (
    sizeName: string,
  ): "in_stock" | "low_stock" | "out_of_stock" | "preorder" => {
    if (!activeColor || !combinationStatus || combinationStatus.length === 0) {
      const sizeOpt = sizes?.find((s) => s.name === sizeName);
      return sizeOpt ? sizeOpt.status : "in_stock";
    }
    const combo = combinationStatus.find(
      (c) =>
        c.colorName.toLowerCase() === activeColor.toLowerCase() &&
        c.sizeName.toLowerCase() === sizeName.toLowerCase(),
    );
    return combo ? combo.status : "out_of_stock";
  };

  // Helper to determine status of a color based on selected size and combination inventory
  const getColorStatus = (
    colorName: string,
  ): "in_stock" | "low_stock" | "out_of_stock" | "preorder" => {
    if (!activeSize || !combinationStatus || combinationStatus.length === 0) {
      const colorOpt = colors?.find((c) => c.name === colorName);
      return colorOpt ? colorOpt.status : "in_stock";
    }
    const combo = combinationStatus.find(
      (c) =>
        c.colorName.toLowerCase() === colorName.toLowerCase() &&
        c.sizeName.toLowerCase() === activeSize.toLowerCase(),
    );
    return combo ? combo.status : "out_of_stock";
  };

  // Refs for keyboard navigation
  const colorRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sizeRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleColorChange = (name: string) => {
    if (onChangeColor) onChangeColor(name);
    else setLocalColor(name);
  };

  const handleSizeChange = (name: string) => {
    if (onChangeSize) onChangeSize(name);
    else setLocalSize(name);
  };

  // Keyboard navigation handler for color list
  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!colors) return;
    let nextIndex = -1;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % colors.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + colors.length) % colors.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = colors.length - 1;
    }

    if (nextIndex !== -1) {
      const targetRef = colorRefs.current[nextIndex];
      if (targetRef) {
        targetRef.focus();
        handleColorChange(colors[nextIndex].name);
      }
    }
  };

  // Keyboard navigation handler for size list
  const handleSizeKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!sizes) return;
    let nextIndex = -1;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % sizes.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + sizes.length) % sizes.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = sizes.length - 1;
    }

    if (nextIndex !== -1) {
      const targetRef = sizeRefs.current[nextIndex];
      if (targetRef) {
        targetRef.focus();
        handleSizeChange(sizes[nextIndex].name);
      }
    }
  };

  const hasColors = colors && colors.length > 0;
  const hasSizes = sizes && sizes.length > 0;

  if (!hasColors && !hasSizes) {
    return null;
  }

  return (
    <div className={cn("space-y-6 font-sans text-sm", className)} data-testid="variant-selector">
      {/* Colors Selection */}
      {hasColors && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground tracking-tight">
              {colorLabel}: <span className="text-muted-foreground font-normal">{activeColor}</span>
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label="Select a color swatch"
            className="flex flex-wrap gap-3"
          >
            {colors.map((color, idx) => {
              const status = getColorStatus(color.name);
              const isSelected = activeColor.toLowerCase() === color.name.toLowerCase();
              const isOutOfStock = status === "out_of_stock";
              const isLowStock = status === "low_stock";
              const isPreorder = status === "preorder";

              return (
                <button
                  key={color.name}
                  ref={(el) => {
                    colorRefs.current[idx] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-disabled={isOutOfStock}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => !isOutOfStock && handleColorChange(color.name)}
                  onKeyDown={(e) => handleColorKeyDown(e, idx)}
                  className={cn(
                    "group relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary scale-110 shadow-sm"
                      : "border-transparent hover:scale-105 hover:border-muted-foreground/30",
                    isOutOfStock && "opacity-40 cursor-not-allowed border-dashed border-muted",
                  )}
                  title={`${color.name}${isOutOfStock ? " (Out of Stock)" : isLowStock ? " (Low Stock)" : isPreorder ? " (Preorder)" : ""}`}
                >
                  <span
                    className="w-8 h-8 rounded-full border border-black/10 shadow-inner transition-transform duration-200 group-hover:scale-95 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: color.value }}
                  >
                    {isOutOfStock && (
                      <span className="absolute inset-0 bg-linear-to-tr from-transparent via-destructive/50 to-transparent w-full h-full rotate-45 scale-x-150 border-t border-destructive" />
                    )}
                  </span>

                  {/* Micro indicator dots for other statuses */}
                  {isLowStock && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full border border-background shadow-sm" />
                  )}
                  {isPreorder && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-violet-500 rounded-full border border-background shadow-sm" />
                  )}

                  {/* Screen reader content */}
                  <span className="sr-only">
                    {color.name}{" "}
                    {isOutOfStock
                      ? ", out of stock"
                      : isLowStock
                        ? ", low stock"
                        : isPreorder
                          ? ", preorder"
                          : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes Selection */}
      {hasSizes && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground tracking-tight">
              {sizeLabel}: <span className="text-muted-foreground font-normal">{activeSize}</span>
            </span>
          </div>

          <div role="radiogroup" aria-label="Select a size" className="flex flex-wrap gap-2.5">
            {sizes.map((size, idx) => {
              const status = getSizeStatus(size.name);
              const isSelected = activeSize.toLowerCase() === size.name.toLowerCase();
              const isOutOfStock = status === "out_of_stock";
              const isLowStock = status === "low_stock";
              const isPreorder = status === "preorder";

              return (
                <button
                  key={size.name}
                  ref={(el) => {
                    sizeRefs.current[idx] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-disabled={isOutOfStock}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => !isOutOfStock && handleSizeChange(size.name)}
                  onKeyDown={(e) => handleSizeKeyDown(e, idx)}
                  className={cn(
                    "relative min-w-12 h-11 px-4 rounded-md border text-sm font-medium flex items-center justify-center transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-md scale-102"
                      : "border-input bg-background hover:bg-muted hover:border-muted-foreground/30 text-foreground",
                    isOutOfStock &&
                      "opacity-40 cursor-not-allowed border-dashed bg-muted/20 text-muted-foreground border-border",
                    isLowStock &&
                      !isSelected &&
                      "border-amber-300 dark:border-amber-700/50 bg-amber-500/5",
                    isPreorder &&
                      !isSelected &&
                      "border-violet-300 dark:border-violet-700/50 bg-violet-500/5",
                  )}
                  title={`${size.name}${isOutOfStock ? " (Out of Stock)" : isLowStock ? " (Low Stock)" : isPreorder ? " (Preorder)" : ""}`}
                >
                  <span
                    className={cn(
                      isOutOfStock && "line-through decoration-destructive decoration-2",
                    )}
                  >
                    {size.name}
                  </span>

                  {/* Tiny indicator badge for low stock or preorder */}
                  {isLowStock && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-background shadow-xs" />
                  )}
                  {isPreorder && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-violet-500 rounded-full border border-background shadow-xs" />
                  )}

                  {/* Screen reader content */}
                  <span className="sr-only">
                    {size.name}{" "}
                    {isOutOfStock
                      ? ", out of stock"
                      : isLowStock
                        ? ", low stock"
                        : isPreorder
                          ? ", preorder"
                          : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
