"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import React, { useState } from "react";
import PayloadImage from "../landing/layout/payload-image";

export interface GalleryItem {
  /** Type of gallery media */
  type: "image" | "video";
  /** URL of image or video thumbnail */
  url: string;
  /** Alt text descriptor */
  alt?: string;
  /** Extensibility slot for custom video rendering (e.g. iframe, video player) */
  videoElement?: React.ReactNode;
}

export interface ProductGalleryProps {
  /** Array of media items to display */
  items?: GalleryItem[] | null;
  /** Optional controlled index of the active item (for variant image switching) */
  activeItemIndex?: number;
  /** Callback when the active media item index changes */
  onChangeActiveItem?: (index: number) => void;
  className?: string;
}

/**
 * ProductGallery displays a swipe-ready, zoomable, thumbnail-driven image and video gallery.
 * Supports Framer Motion swipe gestures, hover zoom, and controlled variant switching.
 */
export const ProductGallery: React.FC<ProductGalleryProps> = ({
  items = [],
  activeItemIndex,
  onChangeActiveItem,
  className = "",
}) => {
  const [localIndex, setLocalIndex] = useState(0);
  const [prevActivePropIndex, setPrevActivePropIndex] = useState<number | undefined>(
    activeItemIndex,
  );

  // Sync prop changes in the render cycle to avoid useEffect cascading renders
  if (activeItemIndex !== undefined && activeItemIndex !== prevActivePropIndex) {
    setPrevActivePropIndex(activeItemIndex);
    setLocalIndex(activeItemIndex);
  }

  const activeIndex = activeItemIndex !== undefined ? activeItemIndex : localIndex;
  const listItems = items || [];

  // Magnified Image Zoom State
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: "scale(1)",
    transformOrigin: "center center",
  });

  const handleActiveIndexChange = (index: number) => {
    if (onChangeActiveItem) onChangeActiveItem(index);
    else setLocalIndex(index);
  };

  const handleNext = () => {
    if (listItems.length <= 1) return;
    const nextIdx = (activeIndex + 1) % listItems.length;
    handleActiveIndexChange(nextIdx);
  };

  const handlePrev = () => {
    if (listItems.length <= 1) return;
    const prevIdx = (activeIndex - 1 + listItems.length) % listItems.length;
    handleActiveIndexChange(prevIdx);
  };

  // Magnify Glass Hover Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: "scale(1.8)",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  };

  // Mobile Swipe gestures via Framer Motion onDragEnd
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: {
      point: { x: number; y: number };
      delta: { x: number; y: number };
      offset: { x: number; y: number };
      velocity: { x: number; y: number };
    },
  ) => {
    const swipeThreshold = 50; // threshold in px
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  if (listItems.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-muted/40 border border-border flex items-center justify-center text-muted-foreground text-sm font-medium">
        No images available
      </div>
    );
  }

  const activeItem = listItems[activeIndex];

  return (
    <div
      className={cn("flex flex-col gap-4 w-full select-none", className)}
      data-testid="product-gallery"
    >
      {/* Main Showcase Container */}
      <div className="relative aspect-square w-full rounded-2xl border border-border bg-card overflow-hidden group/gallery shadow-inner">
        {activeItem?.type === "video" && activeItem.videoElement ? (
          /* Video slot element rendering */
          <div className="absolute inset-0 w-full h-full z-10 bg-black flex items-center justify-center">
            {activeItem.videoElement}
          </div>
        ) : (
          /* Zoomable, draggable product image */
          <div
            className="relative w-full h-full overflow-hidden cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.img
              key={activeIndex}
              src={activeItem?.url}
              alt={activeItem?.alt || `Product Image ${activeIndex + 1}`}
              style={zoomStyle}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              transition={{ transform: { type: "tween", ease: "easeOut", duration: 0.1 } }}
              className="w-full h-full object-contain pointer-events-none md:pointer-events-auto"
            />
          </div>
        )}

        {/* Overlay Navigation Arrows (Desktop) */}
        {listItems.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-border bg-background/80 hover:bg-background text-foreground flex items-center justify-center shadow-xs md:opacity-0 md:group-hover/gallery:opacity-100 transition-all duration-300 active:scale-90 outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 shrink-0" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-border bg-background/80 hover:bg-background text-foreground flex items-center justify-center shadow-xs md:opacity-0 md:group-hover/gallery:opacity-100 transition-all duration-300 active:scale-90 outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 shrink-0" />
            </button>
          </>
        )}

        {/* Swipe tooltip/dots indicator on mobile */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-xs md:hidden">
          {listItems.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                activeIndex === idx ? "bg-primary scale-125" : "bg-muted-foreground/40",
              )}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails Navigation Row */}
      {listItems.length > 1 && (
        <div
          role="listbox"
          aria-label="Product thumbnails"
          className="flex flex-wrap gap-3 py-1 overflow-x-auto justify-start"
        >
          {listItems.map((item, idx) => {
            const isSelected = activeIndex === idx;
            const isVideo = item.type === "video";

            return (
              <button
                key={idx}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleActiveIndexChange(idx)}
                type="button"
                className={cn(
                  "relative w-20 h-20 rounded-xl border-2 bg-card overflow-hidden shrink-0 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:scale-103",
                  isSelected
                    ? "border-primary ring-2 ring-primary/10 shadow-sm"
                    : "border-border hover:border-muted-foreground/30",
                )}
                aria-label={`Show ${item.type === "image" ? "image" : "video"} ${idx + 1}`}
              >
                <PayloadImage
                  media={item.url}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={isSelected}
                  fill={true}
                />

                {/* Video Play indicator overlay on video thumbnail */}
                {isVideo && (
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-background/90 text-primary flex items-center justify-center shadow-xs">
                      <Play className="w-4 h-4 fill-primary shrink-0 ml-0.5" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
