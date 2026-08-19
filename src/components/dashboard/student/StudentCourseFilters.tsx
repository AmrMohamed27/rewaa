"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

export type StudentCourseSortOption =
  | "date-newest"
  | "date-oldest"
  | "title-asc"
  | "title-desc"
  | "progress-desc"
  | "progress-asc";

interface StudentCourseFiltersProps {
  searchQuery: string;
  sortBy: StudentCourseSortOption;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (sort: StudentCourseSortOption) => void;
  onResetFilters?: () => void;
}

export function StudentCourseFilters({
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
  onResetFilters,
}: StudentCourseFiltersProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("studentDashboard.coursesPage");

  const sortOptions: { value: StudentCourseSortOption; label: string }[] = [
    { value: "date-newest", label: t("sort.newest") },
    { value: "date-oldest", label: t("sort.oldest") },
    { value: "title-asc", label: t("sort.titleAsc") },
    { value: "title-desc", label: t("sort.titleDesc") },
    { value: "progress-desc", label: t("sort.progressHigh") },
    { value: "progress-asc", label: t("sort.progressLow") },
  ];

  const currentSortObj = sortOptions.find((o) => o.value === sortBy) || sortOptions[0];
  const isFilterActive = searchQuery.trim() !== "" || sortBy !== "date-newest";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border/60 shadow-xs">
      {/* Search Box */}
      <div className="relative flex-1 min-w-55">
        <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={onSearchChange}
          className="ps-9 bg-background"
        />
      </div>

      {/* Sort & Reset Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {isFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-muted-foreground hover:text-foreground hover:bg-muted text-xs h-9 px-2.5"
          >
            <X className="h-3.5 w-3.5 me-1.5" />
            {t("clearFilters")}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{currentSortObj?.label || sortBy}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isAr ? "start" : "end"} className="w-52">
            {sortOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className={sortBy === opt.value ? "font-semibold bg-accent/60" : ""}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
