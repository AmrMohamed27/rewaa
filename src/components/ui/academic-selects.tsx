/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { CheckIcon, ChevronDownIcon, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getStoredCourses } from "@/lib/courses-storage";
import { getStoredExams } from "@/lib/exams-storage";
import { getStoredLessons } from "@/lib/lessons-storage";
import { getStoredTeachers } from "@/lib/settings-storage";
import { cn } from "@/lib/utils";
import { Exam } from "@/types/exam";
import { Teacher } from "@/types/settings";

const triggerBaseStyles = cn(
  "flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 px-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
  "dark:bg-input/30 dark:hover:bg-input/50",
  "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
);

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ComboboxOption[];
  label?: React.ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
}

export function ComboboxSelect({
  value,
  onValueChange,
  options,
  label,
  placeholder = "اختر...",
  searchPlaceholder = "ابحث...",
  emptyLabel = "لا توجد نتائج.",
  disabled,
  required,
  id,
  className,
  triggerClassName,
  showIcon = false,
  icon,
}: ComboboxSelectProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label
          htmlFor={id}
          className="text-sm font-medium text-foreground flex items-center gap-1.5"
        >
          {showIcon && (icon || <User className="size-4 text-muted-foreground shrink-0" />)}
          <span>{label}</span>
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              triggerBaseStyles,
              !value && "text-muted-foreground",
              isRTL ? "text-right" : "text-left",
              triggerClassName,
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <span className="line-clamp-1 flex items-center gap-1.5 flex-1">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] min-w-36 p-0"
          align="start"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Command dir={isRTL ? "rtl" : "ltr"}>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyLabel}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      onValueChange(opt.value === value ? "" : opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-2 text-sm outline-hidden select-none",
                      isRTL ? "pl-8 pr-1.5 text-right" : "pr-8 pl-1.5 text-left",
                    )}
                  >
                    <span className="flex-1 line-clamp-1">{opt.label}</span>
                    <span
                      className={cn(
                        "pointer-events-none absolute flex size-4 items-center justify-center",
                        isRTL ? "left-2" : "right-2",
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          "pointer-events-none size-4",
                          value === opt.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// --- Grade Select ---
export interface GradeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export function GradeSelect({
  value,
  onValueChange,
  label,
  placeholder,
  disabled,
  required,
  id = "grade-select",
  className,
  triggerClassName,
  showAllOption = false,
  allOptionLabel,
}: GradeSelectProps) {
  const tGrades = useTranslations("courses.new.grades");

  const options: ComboboxOption[] = [
    ...(showAllOption ? [{ value: "all", label: allOptionLabel || "كل المراحل" }] : []),
    { value: "grade1", label: tGrades("grade1") },
    { value: "grade2", label: tGrades("grade2") },
    { value: "grade3", label: tGrades("grade3") },
    { value: "university", label: tGrades("university") },
  ];

  return (
    <ComboboxSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      label={label}
      placeholder={placeholder || tGrades("grade1")}
      searchPlaceholder="ابحث عن مرحلة..."
      disabled={disabled}
      required={required}
      className={className}
      triggerClassName={triggerClassName}
    />
  );
}

// --- Subject Select ---
export interface SubjectSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export function SubjectSelect({
  value,
  onValueChange,
  label,
  placeholder,
  disabled,
  required,
  id = "subject-select",
  className,
  triggerClassName,
  showAllOption = false,
  allOptionLabel,
}: SubjectSelectProps) {
  const tSubjects = useTranslations("courses.new.subjects");

  const options: ComboboxOption[] = [
    ...(showAllOption ? [{ value: "all", label: allOptionLabel || "كل المواد" }] : []),
    { value: "physics", label: tSubjects("physics") },
    { value: "chemistry", label: tSubjects("chemistry") },
    { value: "mathematics", label: tSubjects("mathematics") },
    { value: "biology", label: tSubjects("biology") },
    { value: "arabic", label: tSubjects("arabic") },
    { value: "english", label: tSubjects("english") },
  ];

  return (
    <ComboboxSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      label={label}
      placeholder={placeholder || tSubjects("physics")}
      searchPlaceholder="ابحث عن مادة..."
      disabled={disabled}
      required={required}
      className={className}
      triggerClassName={triggerClassName}
    />
  );
}

// --- Teacher Select ---
export interface TeacherSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  showIcon?: boolean;
  teachers?: Teacher[];
}

export function TeacherSelect({
  value,
  onValueChange,
  label,
  placeholder = "اختر المعلم...",
  disabled,
  required,
  id = "teacher-select",
  className,
  triggerClassName,
  showIcon = false,
  teachers,
}: TeacherSelectProps) {
  const [internalTeachers, setInternalTeachers] = React.useState<Teacher[]>([]);

  React.useEffect(() => {
    if (teachers) return;
    const loadTeachers = () => setInternalTeachers(getStoredTeachers());
    loadTeachers();
    window.addEventListener("rewaa_teachers_updated", loadTeachers);
    return () => window.removeEventListener("rewaa_teachers_updated", loadTeachers);
  }, [teachers]);

  const activeTeachers = teachers || internalTeachers;
  const options: ComboboxOption[] = activeTeachers.map((tch) => ({
    value: tch.name,
    label: tch.name,
  }));

  return (
    <ComboboxSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      label={label}
      placeholder={placeholder}
      searchPlaceholder="ابحث عن معلم..."
      emptyLabel="لا يوجد معلم بهذا الاسم."
      disabled={disabled}
      required={required}
      className={className}
      triggerClassName={triggerClassName}
      showIcon={showIcon}
    />
  );
}

// --- Exam Select ---
export interface ExamSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  exams?: Array<{ id: string; title: string; teacherName?: string }>;
  showNoneOption?: boolean;
  noneOptionLabel?: string;
  emptyLabel?: string;
  showTeacherNameInOption?: boolean;
}

export function ExamSelect({
  value,
  onValueChange,
  label,
  placeholder = "اختر الامتحان...",
  disabled,
  required,
  id = "exam-select",
  className,
  triggerClassName,
  exams,
  showNoneOption = false,
  noneOptionLabel = "بدون امتحان",
  emptyLabel = "لا يوجد امتحان بهذا الاسم.",
  showTeacherNameInOption = false,
}: ExamSelectProps) {
  const locale = useLocale();
  const [internalExams, setInternalExams] = React.useState<Exam[]>([]);

  React.useEffect(() => {
    if (exams) return;
    setInternalExams(getStoredExams(locale));
  }, [exams, locale]);

  const activeExams = exams || internalExams;

  const options: ComboboxOption[] = [
    ...(showNoneOption ? [{ value: "none", label: noneOptionLabel }] : []),
    ...activeExams.map((exam) => ({
      value: exam.id,
      label: `${exam.title}${
        showTeacherNameInOption && exam.teacherName ? ` (${exam.teacherName})` : ""
      }`,
    })),
  ];

  return (
    <ComboboxSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      label={label}
      placeholder={placeholder}
      searchPlaceholder="ابحث عن امتحان..."
      emptyLabel={emptyLabel}
      disabled={disabled}
      required={required}
      className={className}
      triggerClassName={triggerClassName}
    />
  );
}

// --- Course Select ---
export interface CourseSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  courses?: Array<{ id: string; title: string }>;
  showAllOption?: boolean;
  allOptionLabel?: string;
  emptyLabel?: string;
}

export function CourseSelect({
  value,
  onValueChange,
  label,
  placeholder = "اختر الكورس...",
  disabled,
  required,
  id = "course-select",
  className,
  triggerClassName,
  courses,
  showAllOption = false,
  allOptionLabel = "كل الكورسات",
  emptyLabel = "لا يوجد كورس بهذا الاسم.",
}: CourseSelectProps) {
  const locale = useLocale();
  const [internalCourses, setInternalCourses] = React.useState<
    Array<{ id: string; title: string }>
  >([]);

  React.useEffect(() => {
    if (courses) return;
    const loaded = getStoredCourses(locale);
    setInternalCourses(loaded.map((c) => ({ id: c.id, title: c.title })));
  }, [courses, locale]);

  const activeCourses = courses || internalCourses;

  const options: ComboboxOption[] = [
    ...(showAllOption ? [{ value: "all", label: allOptionLabel }] : []),
    ...activeCourses.map((c) => ({
      value: c.id,
      label: c.title,
    })),
  ];

  return (
    <ComboboxSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      label={label}
      placeholder={placeholder}
      searchPlaceholder="ابحث عن كورس..."
      emptyLabel={emptyLabel}
      disabled={disabled}
      required={required}
      className={className}
      triggerClassName={triggerClassName}
    />
  );
}

// --- Lesson Select ---
export interface LessonSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  lessons?: Array<{ id: string; title: string }>;
  showAllOption?: boolean;
  allOptionLabel?: string;
  emptyLabel?: string;
}

export function LessonSelect({
  value,
  onValueChange,
  label,
  placeholder = "اختر الدرس...",
  disabled,
  required,
  id = "lesson-select",
  className,
  triggerClassName,
  lessons,
  showAllOption = false,
  allOptionLabel = "كل الدروس",
  emptyLabel = "لا يوجد درس بهذا الاسم.",
}: LessonSelectProps) {
  const locale = useLocale();
  const [internalLessons, setInternalLessons] = React.useState<
    Array<{ id: string; title: string }>
  >([]);

  React.useEffect(() => {
    if (lessons) return;
    const loaded = getStoredLessons(locale);
    setInternalLessons(loaded.map((l) => ({ id: l.id, title: l.title })));
  }, [lessons, locale]);

  const activeLessons = lessons || internalLessons;

  const options: ComboboxOption[] = [
    ...(showAllOption ? [{ value: "all", label: allOptionLabel }] : []),
    ...activeLessons.map((l) => ({
      value: l.id,
      label: l.title,
    })),
  ];

  return (
    <ComboboxSelect
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      label={label}
      placeholder={placeholder}
      searchPlaceholder="ابحث عن درس..."
      emptyLabel={emptyLabel}
      disabled={disabled}
      required={required}
      className={className}
      triggerClassName={triggerClassName}
    />
  );
}

// --- Multi Lesson Select ---
export interface MultiLessonSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  lessons?: Array<{ id: string; title: string }>;
  emptyLabel?: string;
}

export function MultiLessonSelect({
  value = [],
  onValueChange,
  label,
  placeholder = "اختر الدروس...",
  disabled,
  required,
  id = "multi-lesson-select",
  className,
  triggerClassName,
  lessons,
  emptyLabel = "لا يوجد درس بهذا الاسم.",
}: MultiLessonSelectProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [open, setOpen] = React.useState(false);
  const [internalLessons, setInternalLessons] = React.useState<
    Array<{ id: string; title: string }>
  >([]);

  React.useEffect(() => {
    if (lessons) return;
    const loaded = getStoredLessons(locale);
    setInternalLessons(loaded.map((l) => ({ id: l.id, title: l.title })));
  }, [lessons, locale]);

  const activeLessons = lessons || internalLessons;

  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onValueChange(value.filter((v) => v !== optValue));
    } else {
      onValueChange([...value, optValue]);
    }
  };

  const selectedLabels = activeLessons.filter((l) => value.includes(l.id)).map((l) => l.title);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label
          htmlFor={id}
          className="text-sm font-medium text-foreground flex items-center gap-1.5"
        >
          <span>{label}</span>
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              triggerBaseStyles,
              "h-auto min-h-8 py-1.5 px-2.5",
              value.length === 0 && "text-muted-foreground",
              isRTL ? "text-right" : "text-left",
              triggerClassName,
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="flex flex-wrap items-center gap-1 flex-1">
              {selectedLabels.length > 0 ? (
                selectedLabels.map((lbl, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary"
                  >
                    {lbl}
                  </span>
                ))
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
            <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] min-w-48 p-0"
          align="start"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Command dir={isRTL ? "rtl" : "ltr"}>
            <CommandInput placeholder="ابحث عن درس..." />
            <CommandList>
              <CommandEmpty>{emptyLabel}</CommandEmpty>
              <CommandGroup>
                {activeLessons.map((l) => {
                  const isSelected = value.includes(l.id);
                  return (
                    <CommandItem
                      key={l.id}
                      value={l.title}
                      onSelect={() => toggleOption(l.id)}
                      className={cn(
                        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-2 text-sm outline-hidden select-none",
                        isRTL ? "pl-8 pr-1.5 text-right" : "pr-8 pl-1.5 text-left",
                      )}
                    >
                      <span className="flex-1 line-clamp-1">{l.title}</span>
                      <span
                        className={cn(
                          "pointer-events-none absolute flex size-4 items-center justify-center",
                          isRTL ? "left-2" : "right-2",
                        )}
                      >
                        <CheckIcon
                          className={cn(
                            "pointer-events-none size-4",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
