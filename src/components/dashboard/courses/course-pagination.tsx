"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoursePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function CoursePagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  itemsPerPage,
  onPageChange,
}: CoursePaginationProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("courses");

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
      <div className="text-xs text-muted-foreground font-medium">
        {t("pagination.showing", {
          start: Math.min(startIndex + 1, totalItems),
          end: Math.min(startIndex + itemsPerPage, totalItems),
          total: totalItems,
        })}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="h-8 gap-1 text-xs"
        >
          {isAr ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </Button>

        <div className="flex items-center gap-1 px-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all ${
                currentPage === page
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="h-8 gap-1 text-xs"
        >
          {isAr ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
