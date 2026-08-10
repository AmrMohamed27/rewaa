import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatPrice";

export interface ProductPriceProps {
  /** The original standard price */
  basePrice: number;
  /** The promotional price, if any */
  salePrice?: number | null;
  /** ISO 4217 Currency Code (e.g. USD, EGP, SAR) */
  currency?: string | null;
  /** Whether to show a default tax label */
  showTax?: boolean | null;
  /** Custom text to show for the tax/VAT display */
  taxText?: string | null;
  /** Extensibility slot for custom tax display components */
  taxDisplay?: React.ReactNode;
  /** UI string localizations from CMS */
  uiStrings?: {
    taxTextDefault?: string;
  } | null;
  /** Custom class name for the wrapper element */
  className?: string;
}

/**
 * ProductPrice displays the product's price, including support for sales,
 * discount percentage badges, currency formatting, and flexible tax display.
 * It is fully server-renderable (RSC) to minimize client-side hydration cost.
 */
export const ProductPrice: React.FC<ProductPriceProps> = ({
  basePrice,
  salePrice,
  currency = "USD",
  showTax = false,
  taxText,
  taxDisplay,
  uiStrings,
  className = "",
}) => {
  const finalCurrency = currency || "USD";
  const hasSale = typeof salePrice === "number" && salePrice < basePrice;
  const finalTaxText = taxText || uiStrings?.taxTextDefault || "excl. tax";

  // Calculate discount percentage
  const discountPercent = hasSale ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0;

  return (
    <div className={`flex flex-col gap-1.5 font-sans ${className}`} data-testid="product-price">
      <div className="flex items-baseline gap-3 flex-wrap">
        {hasSale ? (
          <>
            <span className="text-3xl font-bold tracking-tight text-foreground transition-colors">
              {formatPrice(salePrice, { currency: finalCurrency })}
            </span>
            <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/60">
              {formatPrice(basePrice, { currency: finalCurrency })}
            </span>
            <Badge
              variant="destructive"
              className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-semibold text-xs animate-pulse"
            >
              {discountPercent}% OFF
            </Badge>
          </>
        ) : (
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {formatPrice(basePrice, { currency: finalCurrency })}
          </span>
        )}
      </div>

      {/* Extensibility slot for tax display */}
      {taxDisplay ? (
        <div className="text-xs text-muted-foreground mt-0.5">{taxDisplay}</div>
      ) : (
        showTax && (
          <div className="text-xs text-muted-foreground mt-0.5 font-medium flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {finalTaxText}
          </div>
        )
      )}
    </div>
  );
};
