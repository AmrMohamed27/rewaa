import * as React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";

export interface EmptyStateProps {
  /**
   * The Lucide icon to display at the top of the empty state.
   */
  icon?: LucideIcon;

  /**
   * Main title of the empty state (e.g. "Your cart is empty").
   */
  title: string;

  /**
   * Descriptive text below the title explaining why the section is empty.
   */
  description?: string;

  /**
   * Interactive action button configuration.
   */
  action?: {
    /**
     * Text shown inside the action button (e.g. "Start Shopping").
     */
    label: string;

    /**
     * Optional click handler for local component events.
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

    /**
     * Optional link destination. If provided, the button will render as a Next.js Link.
     */
    href?: string;

    /**
     * Shadcn Button variant style to apply.
     */
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

    /**
     * Strict ARIA label for screen readers.
     */
    ariaLabel?: string;
  };

  /**
   * Accessibility label for the entire empty state container if needed.
   */
  ariaLabel?: string;

  /**
   * Extra classes for custom container styling.
   */
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  ariaLabel,
  className,
}: EmptyStateProps) {
  return (
    <Empty className={className} role="region" aria-label={ariaLabel || title}>
      <EmptyHeader>
        {Icon && (
          <EmptyMedia variant="icon">
            <Icon className="text-muted-foreground" aria-hidden="true" />
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>

      {action && (
        <EmptyContent>
          {action.href ? (
            <Button asChild variant={action.variant || "default"}>
              <Link href={action.href} aria-label={action.ariaLabel || action.label}>
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button
              variant={action.variant || "default"}
              onClick={action.onClick}
              aria-label={action.ariaLabel || action.label}
            >
              {action.label}
            </Button>
          )}
        </EmptyContent>
      )}
    </Empty>
  );
}
