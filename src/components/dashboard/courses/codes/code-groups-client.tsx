/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Barcode,
  CheckCircle2,
  Eye,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { ContentPagination } from "@/components/dashboard/common/content-pagination";
import { DashboardCard } from "@/components/dashboard/overview/dashboard-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  addStoredCodeGroup,
  getStoredCodeGroups,
  resetStoredCodeGroups,
} from "@/lib/code-groups-storage";
import { getStoredCourses } from "@/lib/courses-storage";
import { CodeGroup } from "@/types/code-group";
import { Course } from "@/types/course";
import { AddCodeGroupDialog } from "./add-code-group-dialog";

export function CodeGroupsClient() {
  const locale = useLocale();
  const t = useTranslations("codeGroupsPage");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state synchronization
  const searchQuery = searchParams.get("search") || "";
  const selectedCourseFilter = searchParams.get("courseId") || "all";
  const sortBy = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10) || 1;
  const itemsPerPage = 8;

  const updateUrlParams = React.useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          (key === "courseId" && value === "all") ||
          (key === "sort" && value === "newest") ||
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

  // Local state for code groups & courses
  const [groups, setGroups] = React.useState<CodeGroup[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setGroups(getStoredCodeGroups(locale));
    setCourses(getStoredCourses(locale));

    const handleUpdate = () => {
      setGroups(getStoredCodeGroups(locale));
      setCourses(getStoredCourses(locale));
    };

    window.addEventListener("rewaa_code_groups_updated", handleUpdate);
    window.addEventListener("rewaa_courses_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("rewaa_code_groups_updated", handleUpdate);
      window.removeEventListener("rewaa_courses_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [locale]);

  // Overall platform statistics calculation
  const stats = React.useMemo(() => {
    return groups.reduce(
      (acc, item) => {
        acc.total += item.totalCodes;
        acc.sold += item.soldCodes;
        acc.used += item.usedCodes;
        acc.available += item.availableCodes;
        return acc;
      },
      { total: 0, sold: 0, used: 0, available: 0 },
    );
  }, [groups]);

  // Handle data reset
  const handleResetData = () => {
    const freshGroups = resetStoredCodeGroups(locale);
    setGroups(freshGroups);
  };

  // Handle adding new code group
  const handleAddCodeGroup = (data: {
    courseId: string;
    courseTitle: string;
    price: number;
    totalCodes: number;
    availableCodes: number;
    expiryDate: string;
  }) => {
    addStoredCodeGroup(locale, data);
    setGroups(getStoredCodeGroups(locale));
  };

  // Filter & Sort Logic
  const filteredAndSortedGroups = React.useMemo(() => {
    return groups
      .filter((group) => {
        // Filter by course dropdown
        if (selectedCourseFilter !== "all" && group.courseId !== selectedCourseFilter) {
          return false;
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = group.courseTitle.toLowerCase().includes(query);
          const matchesId = group.id.toLowerCase().includes(query);
          if (!matchesTitle && !matchesId) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "priceDesc") {
          return b.price - a.price;
        }
        if (sortBy === "priceAsc") {
          return a.price - b.price;
        }
        if (sortBy === "totalCodesDescSort") {
          return b.totalCodes - a.totalCodes;
        }
        // Default: newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [groups, selectedCourseFilter, searchQuery, sortBy]);

  // Pagination bounds
  const totalItems = filteredAndSortedGroups.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGroups = React.useMemo(() => {
    return filteredAndSortedGroups.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedGroups, startIndex, itemsPerPage]);

  const isFiltered =
    searchQuery.trim() !== "" || selectedCourseFilter !== "all" || sortBy !== "newest";

  const handleResetFilters = () => {
    updateUrlParams({ search: null, courseId: null, sort: null, page: 1 });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* ──────────────────────────────────────────────────────────────────────────────
          1. HEADER SECTION
      ────────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={handleResetData}
            title={t("resetData")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            <span className="hidden md:inline">{t("resetData")}</span>
          </Button>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2 shadow-sm font-semibold"
          >
            <Plus className="size-4" />
            <span>{t("createButton")}</span>
          </Button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────────
          2. STAT CARDS (4 CARDS)
      ────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Codes */}
        <DashboardCard className="border-border/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("stats.totalCodes")}
            </span>
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Barcode className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-foreground">{stats.total}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{t("stats.totalCodesDesc")}</p>
        </DashboardCard>

        {/* Sold Codes */}
        <DashboardCard className="border-border/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("stats.soldCodes")}
            </span>
            <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-foreground">{stats.sold}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{t("stats.soldCodesDesc")}</p>
        </DashboardCard>

        {/* Used Codes */}
        <DashboardCard className="border-border/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("stats.usedCodes")}
            </span>
            <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-foreground">{stats.used}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{t("stats.usedCodesDesc")}</p>
        </DashboardCard>

        {/* Available Codes */}
        <DashboardCard className="border-border/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {t("stats.availableCodes")}
            </span>
            <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Tag className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-foreground">{stats.available}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{t("stats.availableCodesDesc")}</p>
        </DashboardCard>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────────
          3. FILTERS SECTION
      ────────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card border border-border/80 p-4 rounded-xl shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={t("filters.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => updateUrlParams({ search: e.target.value, page: 1 })}
              className="ps-9 h-10 w-full"
            />
          </div>

          {/* Course Filter Select */}
          <Select
            value={selectedCourseFilter}
            onValueChange={(val) => updateUrlParams({ courseId: val, page: 1 })}
          >
            <SelectTrigger className="h-10 w-full sm:w-60">
              <SelectValue placeholder={t("filters.allCourses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allCourses")}</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={(val) => updateUrlParams({ sort: val, page: 1 })}>
            <SelectTrigger className="h-10 w-full sm:w-52">
              <SelectValue placeholder={t("filters.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("filters.newest")}</SelectItem>
              <SelectItem value="oldest">{t("filters.oldest")}</SelectItem>
              <SelectItem value="priceDesc">{t("filters.priceDesc")}</SelectItem>
              <SelectItem value="priceAsc">{t("filters.priceAsc")}</SelectItem>
              <SelectItem value="totalCodesDescSort">{t("filters.totalCodesDescSort")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="gap-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            <RotateCcw className="size-3.5" />
            {t("filters.resetFilters")}
          </Button>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────────
          4. TABLE & PAGINATION
      ────────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border/80 rounded-xl shadow-2xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 *:text-start">
                <TableHead className="font-bold">{t("table.courseName")}</TableHead>
                <TableHead className="font-bold">{t("table.codePrice")}</TableHead>
                <TableHead className="font-bold">{t("table.totalCodes")}</TableHead>
                <TableHead className="font-bold">{t("table.availableCodes")}</TableHead>
                <TableHead className="font-bold">{t("table.soldCodes")}</TableHead>
                <TableHead className="font-bold">{t("table.usedCodes")}</TableHead>
                <TableHead className="font-bold">{t("table.createdAt")}</TableHead>
                <TableHead className="font-bold text-center">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    {t("table.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedGroups.map((group) => (
                  <TableRow key={group.id} className="hover:bg-muted/20 transition-colors">
                    {/* Course Name */}
                    <TableCell className="font-semibold text-foreground max-w-xs truncate">
                      {group.courseTitle}
                    </TableCell>

                    {/* Code Price */}
                    <TableCell className="font-bold text-primary">
                      {group.price}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        {t("addDialog.currency")}
                      </span>
                    </TableCell>

                    {/* Total Codes */}
                    <TableCell className="font-semibold">{group.totalCodes}</TableCell>

                    {/* Available */}
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        {group.availableCodes}
                      </span>
                    </TableCell>

                    {/* Sold */}
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                        {group.soldCodes}
                      </span>
                    </TableCell>

                    {/* Used */}
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                        {group.usedCodes}
                      </span>
                    </TableCell>

                    {/* Date of Creation */}
                    <TableCell className="text-xs text-muted-foreground">
                      {group.createdAt}
                    </TableCell>

                    {/* Actions: View Details button linking to /dashboard/courses/[courseId]/codes/[groupId] */}
                    <TableCell className="text-center">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full hover:bg-primary/10 hover:text-primary"
                        title={t("table.viewDetails")}
                      >
                        <Link
                          href={`/${locale}/dashboard/courses/${group.courseId}/codes/${group.id}`}
                        >
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border/60">
          <ContentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            showingText={`${locale === "ar" ? "عرض" : "Showing"} ${Math.min(startIndex + 1, totalItems)} - ${Math.min(startIndex + itemsPerPage, totalItems)} ${locale === "ar" ? "من إجمالي" : "of"} ${totalItems}`}
            onPageChange={(page) => updateUrlParams({ page })}
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────────
          5. ADD CODE GROUP DIALOG
      ────────────────────────────────────────────────────────────────────────────── */}
      <AddCodeGroupDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        courses={courses}
        onSubmit={handleAddCodeGroup}
      />
    </div>
  );
}
