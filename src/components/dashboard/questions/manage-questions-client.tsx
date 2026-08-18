/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  ArrowUpDown,
  Edit2,
  Eye,
  FileQuestion,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { GradeSelect, SubjectSelect } from "@/components/ui/academic-selects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionWithContext, getAllQuestions } from "@/lib/questions-storage";
import { QuestionDifficulty } from "@/types/exam";
import { ContentPagination } from "../common/content-pagination";

const DIFFICULTY_COLORS: Record<QuestionDifficulty, string> = {
  easy: "bg-green-100 text-green-700 border-green-300/40",
  medium: "bg-amber-100 text-amber-700 border-amber-300/40",
  hard: "bg-red-100 text-red-700 border-red-300/40",
};

export type QuestionSortOption = "name-asc" | "name-desc" | "times-used-desc" | "times-used-asc";

export function ManageQuestionsClient() {
  const locale = useLocale();
  const t = useTranslations("questionsPage");
  const tExams = useTranslations("exams");
  const tGrades = useTranslations("courses.new.grades");
  const tSubjects = useTranslations("courses.new.subjects");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state
  const searchQuery = searchParams.get("search") || "";
  const selectedGrade = searchParams.get("grade") || "all";
  const selectedSubject = searchParams.get("subject") || "all";
  const sortBy = (searchParams.get("sort") as QuestionSortOption) || "name-asc";
  const currentPage = parseInt(searchParams.get("page") || "1", 10) || 1;
  const itemsPerPage = 10;

  const updateUrlParams = React.useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          (key === "grade" && value === "all") ||
          (key === "subject" && value === "all") ||
          (key === "sort" && value === "name-asc") ||
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

  const [questions, setQuestions] = React.useState<QuestionWithContext[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setQuestions(getAllQuestions(locale));
    setIsLoading(false);

    const handleUpdate = () => {
      setQuestions(getAllQuestions(locale));
    };

    window.addEventListener("rewaa_exams_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("rewaa_exams_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [locale]);

  // Filter Logic:
  // search box searches teacherName, questionName, questionContent, modelAnswer, or option texts
  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      if (selectedGrade !== "all" && q.academicGrade !== selectedGrade) {
        return false;
      }
      if (selectedSubject !== "all" && q.subject !== selectedSubject) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = (q.questionName || "").toLowerCase().includes(query);
        const matchesContent = (q.questionContent || "").toLowerCase().includes(query);
        const matchesAnswer = (q.modelAnswer || "").toLowerCase().includes(query);
        const matchesTeacher = (q.teacherName || "").toLowerCase().includes(query);
        const matchesOptions =
          q.options && q.options.some((opt) => opt.text.toLowerCase().includes(query));

        if (
          !matchesName &&
          !matchesContent &&
          !matchesAnswer &&
          !matchesTeacher &&
          !matchesOptions
        ) {
          return false;
        }
      }

      return true;
    });
  }, [questions, selectedGrade, selectedSubject, searchQuery]);

  // Sort Logic
  const sortedQuestions = React.useMemo(() => {
    return [...filteredQuestions].sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return b.questionName.localeCompare(a.questionName, locale);
        case "times-used-desc":
          return (b.timesUsed || 0) - (a.timesUsed || 0);
        case "times-used-asc":
          return (a.timesUsed || 0) - (b.timesUsed || 0);
        case "name-asc":
        default:
          return a.questionName.localeCompare(b.questionName, locale);
      }
    });
  }, [filteredQuestions, sortBy, locale]);

  // Pagination calculation
  const totalItems = sortedQuestions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = sortedQuestions.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateUrlParams({ search: e.target.value, page: 1 });

  const handleGradeChange = (val: string) => updateUrlParams({ grade: val, page: 1 });

  const handleSubjectChange = (val: string) => updateUrlParams({ subject: val, page: 1 });

  const handleSortChange = (sort: QuestionSortOption) => updateUrlParams({ sort, page: 1 });

  const handleResetFilters = () =>
    updateUrlParams({ search: null, grade: null, subject: null, sort: null, page: 1 });

  const formatGrade = (g?: string) => {
    if (!g) return "";
    try {
      return tGrades(g);
    } catch {
      return g;
    }
  };

  const formatSubject = (s?: string) => {
    if (!s) return "";
    try {
      return tSubjects(s);
    } catch {
      return s;
    }
  };

  const formatType = (type: string) => {
    if (type === "mcq") return tExams("questionDialog.types.mcq");
    if (type === "true/false") return tExams("questionDialog.types.trueFalse");
    return tExams("questionDialog.types.text");
  };

  const formatDifficulty = (d: QuestionDifficulty) => tExams(`questionDialog.difficulties.${d}`);

  const isFilterActive =
    searchQuery.trim() !== "" ||
    selectedGrade !== "all" ||
    selectedSubject !== "all" ||
    sortBy !== "name-asc";

  const sortOptions: { value: QuestionSortOption; label: string }[] = [
    { value: "name-asc", label: t("sort.nameAsc") },
    { value: "name-desc", label: t("sort.nameDesc") },
    { value: "times-used-desc", label: t("sort.timesUsedDesc") },
    { value: "times-used-asc", label: t("sort.timesUsedAsc") },
  ];

  const currentSortObj = sortOptions.find((o) => o.value === sortBy) || sortOptions[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("manageTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("manageSubtitle")}</p>
        </div>

        <Button asChild size="default" className="gap-2 shadow-xs font-semibold shrink-0">
          <Link href={`/${locale}/dashboard/questions/new`}>
            <Plus className="h-4 w-4" />
            <span>{t("addNewQuestion")}</span>
          </Link>
        </Button>
      </div>

      {/* Filters Bar: Search Box, Grade Select, Subject Select, Sort Dropdown & Reset button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border/60 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-55">
            <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="ps-9 bg-background"
            />
          </div>

          {/* Grade Select */}
          <div className="w-full sm:w-44">
            <GradeSelect
              value={selectedGrade}
              onValueChange={handleGradeChange}
              placeholder={t("allGrades")}
              showAllOption
              allOptionLabel={t("allGrades")}
            />
          </div>

          {/* Subject Select */}
          <div className="w-full sm:w-44">
            <SubjectSelect
              value={selectedSubject}
              onValueChange={handleSubjectChange}
              placeholder={t("allSubjects")}
              showAllOption
              allOptionLabel={t("allSubjects")}
            />
          </div>
        </div>

        {/* Right Controls: Clear Filters & Sort Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {isFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
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
                <span>{currentSortObj?.label || sortBy}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={locale === "ar" ? "start" : "end"} className="w-48">
              {sortOptions.map((opt) => (
                <DropdownMenuItem key={opt.value} onClick={() => handleSortChange(opt.value)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Component */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40">
                {[
                  t("table.columns.questionName"),
                  t("table.columns.subject"),
                  t("table.columns.grade"),
                  t("table.columns.type"),
                  t("table.columns.difficulty"),
                  t("table.columns.timesUsed"),
                  t("table.columns.actions"),
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/40">
                    <td colSpan={7} className="px-4 py-3">
                      <Skeleton className="h-6 w-full rounded-md" />
                    </td>
                  </tr>
                ))
              ) : paginatedQuestions.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileQuestion className="h-12 w-12 text-muted-foreground/40 mb-3" />
                      <h3 className="text-base font-semibold text-foreground">
                        {t("empty.title")}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                        {t("empty.description")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedQuestions.map((q, idx) => {
                  const rowBg = idx % 2 === 0 ? "" : "bg-muted/20";
                  return (
                    <tr
                      key={`${q.id}-${idx}`}
                      className={`border-b border-border/40 hover:bg-accent/40 transition-colors ${rowBg}`}
                    >
                      {/* Question Name & Content preview */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground truncate">
                            {q.questionName}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {q.questionContent}
                          </span>
                          {q.teacherName && (
                            <span className="text-[11px] text-primary/80 font-medium">
                              {q.teacherName}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold"
                        >
                          {formatSubject(q.subject)}
                        </Badge>
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-foreground">
                        {formatGrade(q.academicGrade)}
                      </td>

                      {/* Question Type */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {formatType(q.type)}
                        </Badge>
                      </td>

                      {/* Difficulty */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${DIFFICULTY_COLORS[q.difficulty]}`}
                        >
                          {formatDifficulty(q.difficulty)}
                        </Badge>
                      </td>

                      {/* Times Used */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {t("table.timesUsedCount", { count: q.timesUsed || 1 })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${locale}/dashboard/questions/${q.id}`}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Eye className="h-4 w-4" />
                                <span>{t("actions.viewDetails")}</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${locale}/dashboard/questions/${q.id}/edit`}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Edit2 className="h-4 w-4" />
                                <span>{t("actions.edit")}</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => {
                                // Deletion placeholder logic for future backend CRUD
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>{t("actions.delete")}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        {!isLoading && totalItems > 0 && (
          <div className="border-t border-border/60 bg-muted/20 px-4 py-3">
            <ContentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              showingText={t("pagination.showing", {
                start: startIndex + 1,
                end: Math.min(startIndex + itemsPerPage, totalItems),
                total: totalItems,
              })}
              onPageChange={(page) => updateUrlParams({ page })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
