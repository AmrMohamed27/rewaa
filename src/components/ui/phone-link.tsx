import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Normalizes a phone number to standard international format (digits only, no '+' or spaces or dashes)
 * suitable for `https://wa.me/<number>`.
 * Handles Egyptian local numbers starting with 01 (e.g. 01012345678 -> 201012345678).
 */
export function getWhatsAppUrl(phone?: string | null): string {
  if (!phone) return "#";
  // Strip non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("01") && cleaned.length === 11) {
    // Egyptian local phone format (010, 011, 012, 015) -> prepend Egypt country code 20
    cleaned = `20${cleaned.slice(1)}`;
  }

  return `https://wa.me/${cleaned}`;
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className={className}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

export interface PhoneLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  phone: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

/**
 * A link component that turns any phone number into a direct WhatsApp chat link.
 */
export function PhoneLink({
  phone,
  children,
  showIcon = false,
  className,
  ...props
}: PhoneLinkProps) {
  if (!phone) return null;

  const url = getWhatsAppUrl(phone);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center gap-1 hover:underline hover:text-emerald-600 transition-colors cursor-pointer",
        className,
      )}
      {...props}
    >
      {showIcon && <WhatsAppIcon className="size-3 text-emerald-600 shrink-0" />}
      {children || <span dir="ltr">{phone}</span>}
    </a>
  );
}
