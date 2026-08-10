interface FormatPriceOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Formats a numeric price into a localized currency string.
 * Uses Intl.NumberFormat to ensure proper formatting according to locale and currency rules.
 * Handles potential server-side and client-side hydration issues by standardizing default locale.
 *
 * @param amount - The numeric price amount (in major units, e.g., 99.99).
 * @param options - Formatting options such as currency, locale, and fraction digits.
 * @returns The formatted price string.
 */
export function formatPrice(amount: number, options: FormatPriceOptions = {}): string {
  const {
    currency = "USD",
    locale = "en-US", // Consistent default to avoid server-client mismatch
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting price:", error);
    // Safe fallback if Intl formatting fails
    return `${currency} ${amount.toFixed(maximumFractionDigits)}`;
  }
}
