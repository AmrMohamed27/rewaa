"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, ProductCardProps } from "./ProductCard";
import { Button } from "@/components/ui/button";

export interface ProductCarouselProps {
  title?: string | null;
  products: ProductCardProps[];
}

/**
 * ProductCarousel displays a list of ProductCards in a horizontal scroll container.
 * Features desktop scroll buttons and native touch gestures/inertia scroll on mobile.
 */
export const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Approx card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full h-10 w-10 shrink-0 cursor-pointer hidden sm:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full h-10 w-10 shrink-0 cursor-pointer hidden sm:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};
