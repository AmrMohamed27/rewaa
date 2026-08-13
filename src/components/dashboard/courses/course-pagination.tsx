"use client";

import { useTranslations } from "next-intl";
import { ContentPagination } from "../common/content-pagination";

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
  const t = useTranslations("courses");

  const showingText = t("pagination.showing", {
    start: Math.min(startIndex + 1, totalItems),
    end: Math.min(startIndex + itemsPerPage, totalItems),
    total: totalItems,
  });

  return (
    <ContentPagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      startIndex={startIndex}
      itemsPerPage={itemsPerPage}
      showingText={showingText}
      onPageChange={onPageChange}
    />
  );
}
