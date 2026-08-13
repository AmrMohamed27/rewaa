"use client";

import { useTranslations } from "next-intl";
import { ContentFilters, SortOptionItem, TabItem } from "../common/content-filters";

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
  const t = useTranslations("courses");

  const tabs: TabItem<FilterTab>[] = [
    { value: "all", label: t("tabs.all"), count: totalCount },
    { value: "published", label: t("tabs.published"), count: publishedCount },
    { value: "draft", label: t("tabs.draft"), count: draftCount },
  ];

  const sortOptions: SortOptionItem<SortOption>[] = [
    { value: "date-newest", label: t("sort.newest") },
    { value: "date-oldest", label: t("sort.oldest") },
    { value: "title-asc", label: t("sort.titleAsc") },
    { value: "title-desc", label: t("sort.titleDesc") },
    { value: "students-desc", label: t("sort.studentsDesc") },
    { value: "price-asc", label: t("sort.priceAsc") },
    { value: "price-desc", label: t("sort.priceDesc") },
  ];

  return (
    <ContentFilters<FilterTab, SortOption>
      searchQuery={searchQuery}
      searchPlaceholder={t("searchPlaceholder")}
      activeTab={activeTab}
      tabs={tabs}
      sortBy={sortBy}
      sortOptions={sortOptions}
      clearFiltersLabel={t("clearFilters")}
      onSearchChange={onSearchChange}
      onTabChange={onTabChange}
      onSortChange={onSortChange}
      onResetFilters={onResetFilters}
    />
  );
}
