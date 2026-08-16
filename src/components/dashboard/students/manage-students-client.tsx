/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowUpDown,
  BookOpen,
  Edit2,
  Eye,
  FilterX,
  GraduationCap,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import {
  deleteStoredStudent,
  getStoredStudents,
  resetStoredStudents,
} from "@/lib/students-storage";
import { RegistrationType, Student } from "@/types/student";
import { ContentPagination } from "../common/content-pagination";
import { DeleteStudentDialog } from "./delete-student-dialog";

export type StudentSortOption =
  | "date-newest"
  | "date-oldest"
  | "name-asc"
  | "name-desc"
  | "grade-asc"
  | "registration-type";

const REGISTRATION_TYPE_BADGES: Record<RegistrationType, string> = {
  center: "bg-emerald-500/10 text-emerald-600  border-emerald-500/20",
  online: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  hybrid: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  external: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

function formatDate(iso?: string, locale: string = "ar") {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ManageStudentsClient() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const t = useTranslations("studentsPage");
  const tGrades = useTranslations("courses.new.grades");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL query state
  const searchQuery = searchParams.get("search") || "";
  const selectedGrade = searchParams.get("grade") || "all";
  const selectedRegType = searchParams.get("regType") || "all";
  const selectedCountry = searchParams.get("country") || "all";
  const selectedState = searchParams.get("state") || "all";
  const sortBy = (searchParams.get("sort") as StudentSortOption) || "date-newest";
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
          (key === "regType" && value === "all") ||
          (key === "country" && value === "all") ||
          (key === "state" && value === "all") ||
          (key === "sort" && value === "date-newest") ||
          (key === "page" && value === 1)
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, pathname, router],
  );

  const [students, setStudents] = React.useState<Student[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Deletion State
  const [deletingStudent, setDeletingStudent] = React.useState<Student | null>(null);

  React.useEffect(() => {
    setStudents(getStoredStudents(locale));
    setIsLoading(false);

    const handleUpdate = () => {
      setStudents(getStoredStudents(locale));
    };

    window.addEventListener("rewaa_students_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("rewaa_students_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [locale]);

  // Extract unique options for filter dropdowns
  const availableGrades = React.useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.grade && set.add(s.grade));
    return Array.from(set);
  }, [students]);

  const availableCountries = React.useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.country && set.add(s.country));
    return Array.from(set);
  }, [students]);

  const availableStates = React.useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (selectedCountry === "all" || s.country === selectedCountry) {
        if (s.state) set.add(s.state);
      }
    });
    return Array.from(set);
  }, [students, selectedCountry]);

  // Safe Grade Formatter
  const formatGrade = React.useCallback(
    (key?: string) => {
      if (!key) return "";
      return tGrades.has(key as Parameters<typeof tGrades.has>[0])
        ? tGrades(key as Parameters<typeof tGrades>[0])
        : key;
    },
    [tGrades],
  );

  // Filter Logic
  const filteredStudents = React.useMemo(() => {
    return students.filter((student) => {
      if (selectedGrade !== "all" && student.grade !== selectedGrade) {
        return false;
      }

      if (selectedRegType !== "all" && student.registrationType !== selectedRegType) {
        return false;
      }

      if (selectedCountry !== "all" && student.country !== selectedCountry) {
        return false;
      }

      if (selectedState !== "all" && student.state !== selectedState) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const fullName = [
          student.firstName,
          student.middleName,
          student.lastName,
          student.additionalName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesName = fullName.includes(query);
        const matchesEmail = student.email.toLowerCase().includes(query);
        const matchesPhone = student.phoneNumber.toLowerCase().includes(query);
        const matchesParentPhone = (student.parentPhoneNumber || "").toLowerCase().includes(query);
        const matchesId = student.id.toLowerCase().includes(query);
        const matchesCountry = (student.country || "").toLowerCase().includes(query);
        const matchesState = (student.state || "").toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesEmail &&
          !matchesPhone &&
          !matchesParentPhone &&
          !matchesId &&
          !matchesCountry &&
          !matchesState
        ) {
          return false;
        }
      }

      return true;
    });
  }, [students, selectedGrade, selectedRegType, selectedCountry, selectedState, searchQuery]);

  // Sort Logic
  const sortedStudents = React.useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      switch (sortBy) {
        case "date-newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "date-oldest":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case "name-asc": {
          const nameA = `${a.firstName} ${a.lastName}`;
          const nameB = `${b.firstName} ${b.lastName}`;
          return nameA.localeCompare(nameB, locale);
        }
        case "name-desc": {
          const nameA = `${a.firstName} ${a.lastName}`;
          const nameB = `${b.firstName} ${b.lastName}`;
          return nameB.localeCompare(nameA, locale);
        }
        case "grade-asc":
          return (a.grade || "").localeCompare(b.grade || "", locale);
        case "registration-type":
          return a.registrationType.localeCompare(b.registrationType);
        default:
          return 0;
      }
    });
  }, [filteredStudents, sortBy, locale]);

  // Pagination Logic
  const totalItems = sortedStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = React.useMemo(() => {
    return sortedStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedStudents, startIndex, itemsPerPage]);

  const isFilterActive =
    searchQuery.trim() !== "" ||
    selectedGrade !== "all" ||
    selectedRegType !== "all" ||
    selectedCountry !== "all" ||
    selectedState !== "all" ||
    sortBy !== "date-newest";

  const handleResetFilters = () => {
    updateUrlParams({
      search: null,
      grade: null,
      regType: null,
      country: null,
      state: null,
      sort: null,
      page: 1,
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingStudent) return;
    deleteStoredStudent(locale, deletingStudent.id);
    setDeletingStudent(null);
  };

  const handleResetData = () => {
    const fresh = resetStoredStudents(locale);
    setStudents(fresh);
  };

  const sortOptions = [
    { value: "date-newest", label: t("sort.dateNewest") },
    { value: "date-oldest", label: t("sort.dateOldest") },
    { value: "name-asc", label: t("sort.nameAsc") },
    { value: "name-desc", label: t("sort.nameDesc") },
    { value: "grade-asc", label: t("sort.gradeAsc") },
    { value: "registration-type", label: t("sort.registrationType") },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label || t("sort.dateNewest");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="default"
            onClick={handleResetData}
            className="gap-2 shadow-xs font-semibold"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t("resetData")}</span>
          </Button>

          <Button asChild size="default" className="gap-2 shadow-xs font-semibold">
            <Link href={`/${locale}/dashboard/students/new`}>
              <Plus className="h-4 w-4" />
              <span>{t("addNewStudent")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card p-4 rounded-xl border border-border/60 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-60">
            <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => updateUrlParams({ search: e.target.value, page: 1 })}
              className="ps-9 bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => updateUrlParams({ search: null, page: 1 })}
                className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort & Reset Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {isFilterActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-muted-foreground hover:text-foreground hover:bg-muted text-xs h-9 px-2.5"
              >
                <FilterX className="h-3.5 w-3.5 me-1.5" />
                {t("emptyState.resetFilters")}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span>{currentSortLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isAr ? "start" : "end"} className="w-52">
                {sortOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => updateUrlParams({ sort: opt.value, page: 1 })}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="flex flex-row flex-wrap gap-3 pt-2 border-t border-border/40">
          {/* Grade Filter */}
          <Select
            value={selectedGrade}
            onValueChange={(val) => updateUrlParams({ grade: val, page: 1 })}
          >
            <SelectTrigger className="bg-background h-9 text-xs">
              <SelectValue placeholder={t("allGrades")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allGrades")}</SelectItem>
              {availableGrades.map((g) => (
                <SelectItem key={g} value={g}>
                  {formatGrade(g)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Registration Type Filter */}
          <Select
            value={selectedRegType}
            onValueChange={(val) => updateUrlParams({ regType: val, page: 1 })}
          >
            <SelectTrigger className="bg-background h-9 text-xs">
              <SelectValue placeholder={t("allRegistrationTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allRegistrationTypes")}</SelectItem>
              <SelectItem value="center">{t("registrationTypes.center")}</SelectItem>
              <SelectItem value="online">{t("registrationTypes.online")}</SelectItem>
              <SelectItem value="hybrid">{t("registrationTypes.hybrid")}</SelectItem>
              <SelectItem value="external">{t("registrationTypes.external")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Country Filter */}
          <Select
            value={selectedCountry}
            onValueChange={(val) => updateUrlParams({ country: val, state: "all", page: 1 })}
          >
            <SelectTrigger className="bg-background h-9 text-xs">
              <SelectValue placeholder={t("allCountries")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCountries")}</SelectItem>
              {availableCountries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Governorate / State Filter */}
          <Select
            value={selectedState}
            onValueChange={(val) => updateUrlParams({ state: val, page: 1 })}
          >
            <SelectTrigger className="bg-background h-9 text-xs">
              <SelectValue placeholder={t("allStates")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStates")}</SelectItem>
              {availableStates.map((st) => (
                <SelectItem key={st} value={st}>
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-card rounded-xl border border-border/60 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : paginatedStudents.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Users className="size-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{t("emptyState.title")}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{t("emptyState.description")}</p>
            {isFilterActive && (
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-2">
                {t("emptyState.resetFilters")}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-start border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground text-xs font-semibold">
                  <th className="px-4 py-3.5 text-start font-medium">
                    {t("columns.fullNameAndId")}
                  </th>
                  <th className="px-4 py-3.5 text-start font-medium">{t("columns.phoneNumber")}</th>
                  <th className="px-4 py-3.5 text-start font-medium">{t("columns.state")}</th>
                  <th className="px-4 py-3.5 text-center font-medium">
                    {t("columns.coursesCount")}
                  </th>
                  <th className="px-4 py-3.5 text-start font-medium">{t("columns.grade")}</th>
                  <th className="px-4 py-3.5 text-start font-medium">
                    {t("columns.registrationDate")}
                  </th>
                  <th className="px-4 py-3.5 text-center font-medium">
                    {t("columns.registrationType")}
                  </th>
                  <th className="px-4 py-3.5 text-end font-medium">{t("columns.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedStudents.map((student) => {
                  const fullName = [
                    student.firstName,
                    student.middleName,
                    student.lastName,
                    student.additionalName,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  const regTypeKey = student.registrationType;
                  const regTypeLabel = t(
                    `registrationTypes.${regTypeKey}` as Parameters<typeof t>[0],
                  );

                  return (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                      {/* Full Name & ID */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <Link
                            href={`/${locale}/dashboard/students/${student.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            <span>{fullName}</span>
                          </Link>
                          <div className="flex flex-col items-start gap-0 mt-0.5">
                            <span className="text-xs text-muted-foreground font-mono">
                              ID: {student.id}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-45">
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className=" text-xs text-foreground flex items-center gap-1">
                            <Phone className="size-3 text-muted-foreground shrink-0" />
                            <span dir="ltr">{student.phoneNumber}</span>
                          </span>
                          {student.parentPhoneNumber && (
                            <span className="text-[11px] text-muted-foreground  mt-0.5 flex items-center gap-1">
                              <UserCheck className="size-3 text-muted-foreground/70 shrink-0" />
                              <span dir="ltr">{student.parentPhoneNumber}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Governorate / Country */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                          <span>
                            {student.state}
                            {student.country ? `, ${student.country}` : ""}
                          </span>
                        </div>
                      </td>

                      {/* Courses Count */}
                      <td className="px-4 py-3.5 text-center">
                        <Badge variant="secondary" className="font-semibold text-xs gap-1">
                          <BookOpen className="size-3" />
                          <span>{student.coursesCount ?? 0}</span>
                        </Badge>
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <GraduationCap className="size-3.5 text-muted-foreground shrink-0" />
                          <span>{formatGrade(student.grade)}</span>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(student.createdAt, locale)}
                        </span>
                      </td>

                      {/* Registration Type Badge */}
                      <td className="px-4 py-3.5 text-center">
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize font-medium ${
                            REGISTRATION_TYPE_BADGES[student.registrationType] || ""
                          }`}
                        >
                          {regTypeLabel}
                        </Badge>
                      </td>

                      {/* Actions Dropdown */}
                      <td className="px-4 py-3.5 text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 rounded-lg">
                              <MoreVertical className="size-4 text-muted-foreground" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isAr ? "start" : "end"} className="w-44">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${locale}/dashboard/students/${student.id}`}
                                className="cursor-pointer gap-2"
                              >
                                <Eye className="size-4" />
                                <span>{t("actions.viewDetails")}</span>
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${locale}/dashboard/students/${student.id}/edit`}
                                className="cursor-pointer gap-2"
                              >
                                <Edit2 className="size-4" />
                                <span>{t("actions.editStudent")}</span>
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => setDeletingStudent(student)}
                              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                            >
                              <Trash2 className="size-4" />
                              <span>{t("actions.deleteStudent")}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        {totalItems > 0 && (
          <div className="p-4 border-t border-border/60">
            <ContentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              showingText={t("showing", {
                start: Math.min(startIndex + 1, totalItems),
                end: Math.min(startIndex + itemsPerPage, totalItems),
                total: totalItems,
              })}
              onPageChange={(page) => updateUrlParams({ page })}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingStudent && (
        <DeleteStudentDialog
          isOpen={!!deletingStudent}
          studentName={[deletingStudent.firstName, deletingStudent.lastName]
            .filter(Boolean)
            .join(" ")}
          onClose={() => setDeletingStudent(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
