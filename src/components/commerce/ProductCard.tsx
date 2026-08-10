"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ProductPrice } from "./ProductPrice";
import { StockBadge, StockStatus } from "./StockBadge";

export interface ProductCardProps {
  /** Unique product ID */
  id: string;
  /** Product title */
  title: string;
  /** Primary product image URL */
  image: string;
  /** Image alt text */
  imageAlt?: string;
  /** Base standard price */
  basePrice: number;
  /** Optional promo price */
  salePrice?: number | null;
  /** ISO Currency code (default: USD) */
  currency?: string | null;
  /** Whether to show tax status */
  showTax?: boolean | null;
  /** Custom tax label string */
  taxText?: string | null;
  /** Inventory status state */
  stockStatus: StockStatus;
  /** Optional inventory numerical count */
  stockCount?: number | null;
  /** Local path/link to product detail page */
  productUrl?: string;
  /** Add to cart button handler */
  onAddToCart?: () => void;
  /** Custom slot for Wishlist toggle button */
  wishlistSlot?: React.ReactNode;
  /** Render loading skeleton state if true */
  loading?: boolean;
}

/**
 * ProductCard is a composite display component displaying product details.
 * Features Framer Motion interactive hover effects, SEO tags, and a loading skeleton.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  image,
  imageAlt,
  basePrice,
  salePrice,
  currency = "USD",
  showTax = false,
  taxText,
  stockStatus,
  stockCount,
  productUrl = "#",
  onAddToCart,
  wishlistSlot,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs p-4 gap-4 w-full">
        {/* Image skeleton */}
        <Skeleton className="aspect-square w-full rounded-xl" />
        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {/* Price & Badge skeleton */}
        <div className="flex justify-between items-center mt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        {/* Action button skeleton */}
        <Skeleton className="h-10 w-full mt-2 rounded-lg" />
      </div>
    );
  }

  const isOutOfStock = stockStatus === "out_of_stock";

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 w-full"
      data-testid="product-card"
      data-product-id={id}
    >
      {/* Wishlist slot (absolute placement overlay) */}
      {wishlistSlot && (
        <div className="absolute top-3.5 right-3.5 z-20 transition-transform duration-300 hover:scale-110">
          {wishlistSlot}
        </div>
      )}

      {/* Product link containing image */}
      <Link
        href={productUrl}
        className="relative block aspect-square w-full overflow-hidden bg-muted rounded-t-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <motion.img
          src={image}
          alt={imageAlt || title}
          loading="lazy"
          className="object-cover w-full h-full"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          whileHover={{ scale: 1.06 }}
        />

        {/* Out of stock tint overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Card Info & Details */}
      <div className="flex flex-col flex-1 p-4.5 gap-3.5">
        <div className="space-y-1">
          {/* Stock Availability Badge */}
          <div className="flex justify-between items-center mb-1">
            <StockBadge status={stockStatus} stockCount={stockCount} />
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-base tracking-tight text-foreground line-clamp-2 min-h-12 group-hover:text-primary transition-colors duration-200">
            <Link
              href={productUrl}
              className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              {title}
            </Link>
          </h3>
        </div>

        {/* Pricing Layout */}
        <div className="flex justify-between items-end gap-2 mt-auto">
          <ProductPrice
            basePrice={basePrice}
            salePrice={salePrice}
            currency={currency}
            showTax={showTax}
            taxText={taxText}
          />
        </div>

        {/* Quick Add to Cart button */}
        {onAddToCart && (
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            disabled={isOutOfStock}
            className={cn(
              "w-full gap-2 rounded-lg font-semibold tracking-wide shadow-xs active:scale-98 transition-all duration-200 cursor-pointer",
              isOutOfStock
                ? "bg-muted text-muted-foreground cursor-not-allowed border-none"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>Add to Cart</span>
          </Button>
        )}
      </div>
    </motion.article>
  );
};
