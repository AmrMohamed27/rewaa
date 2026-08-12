"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowUpDown, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterTab = "all" | "published" | "draft";
export type SortOption =
  | "title-asc"
  | "title-desc"
  | "date-newest"
  | "date-oldest"
  | "students-desc"
  | "price-asc"
  | "price-desc";

interface CourseFiltersProps {
  searchQuery: string;
  activeTab: FilterTab;
  sortBy: SortOption;
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTabChange: (tab: FilterTab) => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters?: () => void;
}

export function CourseFilters({
  searchQuery,
  activeTab,
  sortBy,
  totalCount,
  publishedCount,
  draftCount,
  onSearchChange,
  onTabChange,
  onSortChange,
  onResetFilters,
}: CourseFiltersProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("courses");

  const isFilterActive =
    searchQuery.trim() !== "" || activeTab !== "all" || sortBy !== "date-newest";

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border/60 shadow-xs">
      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
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

        {/* Tab Selector */}
        <div className="flex items-center p-1 bg-muted rounded-lg border border-border/40 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => onTabChange("all")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("tabs.all")} ({totalCount})
          </button>
          <button
            onClick={() => onTabChange("published")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "published"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("tabs.published")} ({publishedCount})
          </button>
          <button
            onClick={() => onTabChange("draft")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "draft"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("tabs.draft")} ({draftCount})
          </button>
        </div>
      </div>

      {/* Controls: Sort Menu & Clear Filters */}
      <div className="flex items-center gap-2 self-start md:self-auto">
        {isFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground hover:bg-muted text-xs h-9 px-2.5"
          >
            <X className="h-3.5 w-3.5 me-1.5" />
            {t("clearFilters")}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>
                {sortBy === "date-newest" && t("sort.newestLabel")}
                {sortBy === "date-oldest" && t("sort.oldestLabel")}
                {sortBy === "title-asc" && t("sort.titleAscLabel")}
                {sortBy === "title-desc" && t("sort.titleDescLabel")}
                {sortBy === "students-desc" && t("sort.studentsDescLabel")}
                {sortBy === "price-asc" && t("sort.priceAscLabel")}
                {sortBy === "price-desc" && t("sort.priceDescLabel")}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isAr ? "start" : "end"} className="w-48">
            <DropdownMenuItem onClick={() => onSortChange("date-newest")}>
              {t("sort.newest")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("date-oldest")}>
              {t("sort.oldest")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("title-asc")}>
              {t("sort.titleAsc")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("title-desc")}>
              {t("sort.titleDesc")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("students-desc")}>
              {t("sort.studentsDesc")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("price-asc")}>
              {t("sort.priceAsc")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("price-desc")}>
              {t("sort.priceDesc")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
