/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BookOpen, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Lesson, LessonPublishStatus } from "@/types/course";
import { getStoredLessons, saveStoredLessons, resetStoredLessons } from "@/lib/lessons-storage";
import { ContentFilters, SortOptionItem, TabItem } from "../common/content-filters";
import { ContentPagination } from "../common/content-pagination";
import { LessonCard } from "./lesson-card";
import { DeleteLessonDialog } from "./delete-lesson-dialog";

export type LessonFilterTab = "all" | "published" | "draft";
export type LessonTypeFilter = "all" | "independent" | "course-dependent";
export type LessonSortOption = "date-newest" | "date-oldest";

export function ManageLessonsClient() {
  const locale = useLocale();
  const t = useTranslations("lessons");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state synchronization
  const searchQuery = searchParams.get("search") || "";
  const activeTab = (searchParams.get("tab") as LessonFilterTab) || "all";
  const typeFilter = (searchParams.get("type") as LessonTypeFilter) || "all";
  const sortBy = (searchParams.get("sort") as LessonSortOption) || "date-newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10) || 1;
  const itemsPerPage = 8;

  // Helper function to update URL search parameters
  const updateUrlParams = React.useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          (key === "tab" && value === "all") ||
          (key === "type" && value === "all") ||
          (key === "sort" && value === "date-newest") ||
          (key === "page" && value === 1)
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Local state initialized & synchronized with LocalStorage
  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setLessons(getStoredLessons(locale));
    setIsLoading(false);

    const handleStorageUpdate = () => {
      setLessons(getStoredLessons(locale));
    };

    window.addEventListener("rewaa_lessons_updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("rewaa_lessons_updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [locale]);

  // Dialog state for lesson deletion
  const [lessonToDelete, setLessonToDelete] = React.useState<Lesson | null>(null);

  // Copy feedback state
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Filter & Search Logic
  const filteredLessons = React.useMemo(() => {
    return lessons.filter((lesson) => {
      const isPublished =
        lesson.publishStatus === "published" || (!lesson.publishStatus && lesson.title);
      if (activeTab === "published" && !isPublished) return false;
      if (activeTab === "draft" && isPublished) return false;

      // Type Filter (independent vs course-dependent)
      const isIndep =
        lesson.lessonCategory === "independent" || (!lesson.lessonCategory && !lesson.courseId);
      if (typeFilter === "independent" && !isIndep) return false;
      if (typeFilter === "course-dependent" && isIndep) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = lesson.title.toLowerCase().includes(query);
        const matchesSubject = (lesson.subject || "").toLowerCase().includes(query);
        const matchesGrade = (lesson.grade || "").toLowerCase().includes(query);
        const matchesTeacher = (lesson.teacherName || "").toLowerCase().includes(query);
        const matchesCourse = (lesson.courseTitle || "").toLowerCase().includes(query);
        if (
          !matchesTitle &&
          !matchesSubject &&
          !matchesGrade &&
          !matchesTeacher &&
          !matchesCourse
        ) {
          return false;
        }
      }

      return true;
    });
  }, [lessons, activeTab, typeFilter, searchQuery]);

  // Sort Logic
  const sortedLessons = React.useMemo(() => {
    return [...filteredLessons].sort((a, b) => {
      switch (sortBy) {
        case "date-oldest":
          return a.id.localeCompare(b.id);
        case "date-newest":
        default:
          return b.id.localeCompare(a.id);
      }
    });
  }, [filteredLessons, sortBy]);

  // Pagination Logic
  const totalItems = sortedLessons.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLessons = sortedLessons.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUrlParams({ search: e.target.value, page: 1 });
  };

  const handleTabChange = (tab: LessonFilterTab) => {
    updateUrlParams({ tab, page: 1 });
  };

  const handleSortChange = (sort: LessonSortOption) => {
    updateUrlParams({ sort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateUrlParams({ page });
  };

  const handlePublishToggle = (lessonId: string) => {
    const updated: Lesson[] = lessons.map((l) => {
      if (l.id === lessonId) {
        const nextStatus: LessonPublishStatus =
          l.publishStatus === "published" ? "draft" : "published";
        return { ...l, publishStatus: nextStatus };
      }
      return l;
    });
    setLessons(updated);
    saveStoredLessons(locale, updated);
  };

  const confirmDelete = () => {
    if (lessonToDelete) {
      const updated = lessons.filter((l) => l.id !== lessonToDelete.id);
      setLessons(updated);
      saveStoredLessons(locale, updated);
      setLessonToDelete(null);
    }
  };

  const handleResetData = () => {
    const reset = resetStoredLessons(locale);
    setLessons(reset);
  };

  const handleCopyLink = (lessonId: string) => {
    const link = `${window.location.origin}/${locale}/student-dashboard/lessons/${lessonId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(lessonId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTypeChange = (val: string) => {
    updateUrlParams({ type: val === "all" ? null : val, page: 1 });
  };

  const handleResetFilters = () => {
    updateUrlParams({ search: null, tab: null, type: null, sort: null, page: 1 });
  };

  // Filter tabs and sort options
  const tabs: TabItem<LessonFilterTab>[] = [
    { value: "all", label: t("tabs.all"), count: lessons.length },
    {
      value: "published",
      label: t("tabs.published"),
      count: lessons.filter((l) => l.publishStatus === "published" || (!l.publishStatus && l.title))
        .length,
    },
    {
      value: "draft",
      label: t("tabs.draft"),
      count: lessons.filter((l) => l.publishStatus !== "published" && l.publishStatus !== undefined)
        .length,
    },
  ];

  const sortOptions: SortOptionItem<LessonSortOption>[] = [
    { value: "date-newest", label: t("sort.newest") },
    { value: "date-oldest", label: t("sort.oldest") },
  ];

  const showingText = t("pagination.showing", {
    start: Math.min(startIndex + 1, totalItems),
    end: Math.min(startIndex + itemsPerPage, totalItems),
    total: totalItems,
  });

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("manageTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("manageSubtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={handleResetData}
            className="gap-2 shadow-xs font-semibold"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t("resetLessons")}</span>
          </Button>
          <Button asChild size="default" className="gap-2 shadow-sm font-semibold">
            <Link href={`/${locale}/dashboard/lessons/new`}>
              <Plus className="h-4 w-4" />
              <span>{t("addNewLesson")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and Controls Row */}
      <ContentFilters<LessonFilterTab, LessonSortOption>
        searchQuery={searchQuery}
        searchPlaceholder={t("searchPlaceholder")}
        activeTab={activeTab}
        tabs={tabs}
        sortBy={sortBy}
        sortOptions={sortOptions}
        clearFiltersLabel={t("clearFilters")}
        isFilterActiveCustom={typeFilter !== "all"}
        extraFilters={
          <div className="w-full sm:w-44 self-start sm:self-auto">
            <Select value={typeFilter} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue placeholder={t("filterType.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filterType.all")}</SelectItem>
                <SelectItem value="independent">{t("filterType.independent")}</SelectItem>
                <SelectItem value="course-dependent">{t("filterType.courseDependent")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        onSearchChange={handleSearchChange}
        onTabChange={handleTabChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
      />

      {/* Lessons Grid or Skeleton Loader */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-border/60 bg-card overflow-hidden p-4 space-y-3"
            >
              <Skeleton className="h-44 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-border/40">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-dashed border-border/80">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">{t("empty.title")}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">{t("empty.description")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              copiedId={copiedId}
              onPublishToggle={handlePublishToggle}
              onCopyLink={handleCopyLink}
              onDeleteRequest={setLessonToDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <ContentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        showingText={showingText}
        onPageChange={handlePageChange}
      />

      {/* Confirmation Dialog for Deletion */}
      <DeleteLessonDialog
        lessonToDelete={lessonToDelete}
        onClose={() => setLessonToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
