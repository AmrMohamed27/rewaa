/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Barcode,
  Check,
  CheckCircle2,
  Copy,
  Layers,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentPagination } from "@/components/dashboard/common/content-pagination";

import { ActivationCode, CodeStatus } from "@/types/activation-code";
import { CodeGroup } from "@/types/code-group";
import {
  addStoredActivationCode,
  addStoredActivationCodesBatch,
  deleteStoredActivationCode,
  getStoredActivationCodes,
  resetStoredActivationCodes,
  updateStoredActivationCode,
  updateStoredActivationCodeStatus,
} from "@/lib/activation-codes-storage";
import { getStoredCodeGroups } from "@/lib/code-groups-storage";
import { EditCodeDialog } from "./edit-code-dialog";
import { CreateCodeDialog } from "./create-code-dialog";
import { DeleteCodeDialog } from "./delete-code-dialog";
import { CreateBatchCodesDialog } from "./create-batch-codes-dialog";

interface GroupCodesClientProps {
  courseId: string;
  groupId: string;
}

export function GroupCodesClient({ courseId: _courseId, groupId }: GroupCodesClientProps) {
  const locale = useLocale();
  const t = useTranslations("groupCodesPage");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state synchronization
  const searchQuery = searchParams.get("search") || "";
  const activeTab = (searchParams.get("status") as "all" | CodeStatus) || "all";
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
          (key === "status" && value === "all") ||
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

  // Local state for activation codes & parent group
  const [allCodes, setAllCodes] = React.useState<ActivationCode[]>([]);
  const [currentGroup, setCurrentGroup] = React.useState<CodeGroup | null>(null);
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null);
  const [editingCode, setEditingCode] = React.useState<ActivationCode | null>(null);
  const [codeToDelete, setCodeToDelete] = React.useState<ActivationCode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const loadedCodes = getStoredActivationCodes(locale);
    setAllCodes(loadedCodes);

    const loadedGroups = getStoredCodeGroups(locale);
    const targetGroup = loadedGroups.find((g) => g.id === groupId) || null;
    setCurrentGroup(targetGroup);

    const handleUpdate = () => {
      setAllCodes(getStoredActivationCodes(locale));
      const freshGroups = getStoredCodeGroups(locale);
      setCurrentGroup(freshGroups.find((g) => g.id === groupId) || null);
    };

    window.addEventListener("rewaa_activation_codes_updated", handleUpdate);
    window.addEventListener("rewaa_code_groups_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("rewaa_activation_codes_updated", handleUpdate);
      window.removeEventListener("rewaa_code_groups_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [locale, groupId]);

  // Codes belonging to this specific group
  const groupCodes = React.useMemo(() => {
    return allCodes.filter((item) => item.groupId === groupId);
  }, [allCodes, groupId]);

  // Computed stat counts for this code group
  const stats = React.useMemo(() => {
    return groupCodes.reduce(
      (acc, item) => {
        acc.total += 1;
        if (item.status === "available") acc.available += 1;
        if (item.status === "sold") acc.sold += 1;
        if (item.status === "used") acc.used += 1;
        return acc;
      },
      { total: 0, sold: 0, used: 0, available: 0 },
    );
  }, [groupCodes]);

  // Reset Data to initial mock dataset
  const handleResetData = () => {
    const freshCodes = resetStoredActivationCodes(locale);
    setAllCodes(freshCodes);
  };

  // Copy code to clipboard
  const handleCopyCode = (codeId: string, codeString: string) => {
    navigator.clipboard.writeText(codeString);
    setCopiedCodeId(codeId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Status transition handler (available -> sold -> used)
  const handleStatusTransition = (codeId: string, currentStatus: CodeStatus) => {
    const nextStatus: CodeStatus = currentStatus === "available" ? "sold" : "used";
    const updated = updateStoredActivationCodeStatus(locale, codeId, nextStatus);
    setAllCodes(updated);
  };

  // Confirm delete code handler
  const confirmDeleteCode = () => {
    if (codeToDelete) {
      const updated = deleteStoredActivationCode(locale, codeToDelete.id);
      setAllCodes(updated);
      setCodeToDelete(null);
    }
  };

  // Create new code in group handler
  const handleCreateCode = (data: { code: string; cost: number; expiryDate: string }) => {
    if (!currentGroup) return;
    const updated = addStoredActivationCode(locale, {
      groupId: currentGroup.id,
      courseId: currentGroup.courseId,
      courseTitle: currentGroup.courseTitle,
      code: data.code,
      cost: data.cost,
      status: "available",
      expiryDate: data.expiryDate,
    });
    setAllCodes(updated);
  };

  // Create batch of codes in group handler
  const handleCreateBatchCodes = (data: {
    count: number;
    prefix: string;
    cost: number;
    expiryDate: string;
  }) => {
    if (!currentGroup) return;
    const prefixToUse = data.prefix
      ? data.prefix.endsWith("-")
        ? data.prefix
        : `${data.prefix}-`
      : "RW-CODE-";
    const newItems = Array.from({ length: data.count }).map((_, idx) => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
      return {
        groupId: currentGroup.id,
        courseId: currentGroup.courseId,
        courseTitle: currentGroup.courseTitle,
        code: `${prefixToUse}${randomNum}-${randomStr}-${idx + 1}`,
        cost: data.cost,
        status: "available" as const,
        expiryDate: data.expiryDate,
      };
    });
    const updated = addStoredActivationCodesBatch(locale, newItems);
    setAllCodes(updated);
  };

  // Save edited code info
  const handleSaveEdit = (updatedData: {
    code: string;
    cost: number;
    status: CodeStatus;
    expiryDate: string;
  }) => {
    if (!editingCode) return;
    const updated = updateStoredActivationCode(locale, editingCode.id, updatedData);
    setAllCodes(updated);
    setEditingCode(null);
  };

  // Filter & Sort logic
  const filteredAndSortedCodes = React.useMemo(() => {
    return groupCodes
      .filter((item) => {
        // Tab status filter
        if (activeTab !== "all" && item.status !== activeTab) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesCode = item.code.toLowerCase().includes(query);
          const matchesId = item.id.toLowerCase().includes(query);
          if (!matchesCode && !matchesId) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "costDesc") {
          return b.cost - a.cost;
        }
        if (sortBy === "costAsc") {
          return a.cost - b.cost;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [groupCodes, activeTab, searchQuery, sortBy]);

  // Pagination calculations
  const totalItems = filteredAndSortedCodes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCodes = React.useMemo(() => {
    return filteredAndSortedCodes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCodes, startIndex, itemsPerPage]);

  const isFiltered = searchQuery.trim() !== "" || activeTab !== "all" || sortBy !== "newest";

  const handleResetFilters = () => {
    updateUrlParams({ search: null, status: null, sort: null, page: 1 });
  };

  const showingNumber =
    Math.min(startIndex + itemsPerPage, totalItems) - Math.min(startIndex + 1, totalItems) + 1;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* ──────────────────────────────────────────────────────────────────────────────
          1. HEADER SECTION (WITH STANDARD ROUND BACK BUTTON)
      ────────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
            <Link href={`/${locale}/dashboard/courses/codes`}>
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {currentGroup ? currentGroup.courseTitle : t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("subtitle")} ({groupId})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={handleResetData}
            title={t("resetData")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            <span>{t("resetData")}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsBatchDialogOpen(true)}
            className="gap-2 shadow-2xs font-semibold"
          >
            <Layers className="size-4" />
            <span>{t("createBatch")}</span>
          </Button>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2 shadow-sm font-semibold"
          >
            <Plus className="size-4" />
            <span>{t("createCode")}</span>
          </Button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────────
          2. STAT CARDS (4 CARDS FOR THIS CODE GROUP)
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
          3. TABS & FILTERS SECTION
      ────────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-row max-lg:flex-wrap items-center gap-4 bg-card border border-border/80 p-4 rounded-xl shadow-2xs">
        {/* Search & Sort controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder={t("filters.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => updateUrlParams({ search: e.target.value, page: 1 })}
                className="ps-9 h-10 w-full"
              />
            </div>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={(val) => updateUrlParams({ sort: val, page: 1 })}>
              <SelectTrigger className="h-10 w-full sm:w-52">
                <SelectValue placeholder={t("filters.sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("filters.newest")}</SelectItem>
                <SelectItem value="oldest">{t("filters.oldest")}</SelectItem>
                <SelectItem value="costDesc">{t("filters.costDesc")}</SelectItem>
                <SelectItem value="costAsc">{t("filters.costAsc")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(val) => updateUrlParams({ status: val as CodeStatus | "all", page: 1 })}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
            <TabsTrigger value="available">{t("tabs.available")}</TabsTrigger>
            <TabsTrigger value="sold">{t("tabs.sold")}</TabsTrigger>
            <TabsTrigger value="used">{t("tabs.used")}</TabsTrigger>
          </TabsList>
        </Tabs>
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
          4. CODES TABLE
      ────────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border/80 rounded-xl shadow-2xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 *:text-start">
                <TableHead className="font-bold">{t("table.serialNumber")}</TableHead>
                <TableHead className="font-bold">{t("table.codeValue")}</TableHead>
                <TableHead className="font-bold">{t("table.courseName")}</TableHead>
                <TableHead className="font-bold">{t("table.cost")}</TableHead>
                <TableHead className="font-bold">{t("table.status")}</TableHead>
                <TableHead className="font-bold">{t("table.expiryDate")}</TableHead>
                <TableHead className="font-bold text-center">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    {t("table.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCodes.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                    {/* Serial Number / ID */}
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.id}
                    </TableCell>

                    {/* Code Value with Copy button */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground text-sm tracking-wide bg-muted/60 px-2 py-1 rounded">
                          {item.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyCode(item.id, item.code)}
                          className="size-7 rounded-md hover:bg-primary/10 hover:text-primary"
                          title={t("table.copyTitle")}
                        >
                          {copiedCodeId === item.id ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>

                    {/* Course Name */}
                    <TableCell className="font-semibold text-foreground max-w-xs truncate">
                      {item.courseTitle}
                    </TableCell>

                    {/* Cost */}
                    <TableCell className="font-bold text-primary">
                      {item.cost}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        {t("editDialog.currency")}
                      </span>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      {item.status === "available" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">
                          {t(`statusLabels.${item.status}`)}
                        </span>
                      ) : item.status === "sold" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600">
                          {t(`statusLabels.${item.status}`)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">
                          {t(`statusLabels.${item.status}`)}
                        </span>
                      )}
                    </TableCell>

                    {/* Expiry Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      {item.expiryDate}
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 rounded-full">
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Modify info */}
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCode(item);
                              setIsEditDialogOpen(true);
                            }}
                            className="gap-2 cursor-pointer"
                          >
                            <Pencil className="size-4" />
                            <span>{t("actions.modifyInfo")}</span>
                          </DropdownMenuItem>

                          {/* Mark as (if available -> sold, if sold -> used) */}
                          {item.status === "available" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusTransition(item.id, item.status)}
                              className="gap-2 cursor-pointer text-blue-600"
                            >
                              <ShoppingBag className="size-4" />
                              <span>{t("actions.markAsSold")}</span>
                            </DropdownMenuItem>
                          )}
                          {item.status === "sold" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusTransition(item.id, item.status)}
                              className="gap-2 cursor-pointer text-amber-600"
                            >
                              <CheckCircle2 className="size-4" />
                              <span>{t("actions.markAsUsed")}</span>
                            </DropdownMenuItem>
                          )}

                          {/* Delete code */}
                          <DropdownMenuItem
                            onClick={() => setCodeToDelete(item)}
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-4" />
                            <span>{t("actions.deleteCode")}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
            showingText={`${locale === "ar" ? "عرض" : "Showing"} ${showingNumber} ${locale === "ar" ? "من إجمالي" : "of"} ${totalItems}`}
            onPageChange={(page) => updateUrlParams({ page })}
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────────
          5. EDIT, CREATE & DELETE CODE DIALOGS
      ────────────────────────────────────────────────────────────────────────────── */}
      <EditCodeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        codeItem={editingCode}
        onSubmit={handleSaveEdit}
      />

      <CreateCodeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        group={currentGroup}
        existingCodes={allCodes}
        onSubmit={handleCreateCode}
      />

      <CreateBatchCodesDialog
        open={isBatchDialogOpen}
        onOpenChange={setIsBatchDialogOpen}
        group={currentGroup}
        existingCodes={allCodes}
        onSubmit={handleCreateBatchCodes}
      />

      <DeleteCodeDialog
        codeToDelete={codeToDelete}
        onClose={() => setCodeToDelete(null)}
        onConfirm={confirmDeleteCode}
      />
    </div>
  );
}
