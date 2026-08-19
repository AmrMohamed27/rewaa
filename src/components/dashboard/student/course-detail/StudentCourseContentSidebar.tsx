/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/i18n/routing";
import { getStoredExams } from "@/lib/exams-storage";
import { cn } from "@/lib/utils";
import { Course, CourseSection, Lesson } from "@/types/course";
import { Exam } from "@/types/exam";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Lock,
  Paperclip,
  Video,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

interface StudentCourseContentSidebarProps {
  course: Course;
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
  completedLessons: string[];
  passedExamIds: string[];
  onToggleLessonCompletion: (lessonId: string) => void;
  onAttemptLockedLesson?: (section: CourseSection, requiredExamId?: string) => void;
  progressPercentage: number;
  onOpenCertificate: () => void;
  className?: string;
}

export function StudentCourseContentSidebar({
  course,
  selectedLessonId,
  onSelectLesson,
  completedLessons,
  passedExamIds,
  onToggleLessonCompletion,
  onAttemptLockedLesson,
  progressPercentage,
  onOpenCertificate,
  className,
}: StudentCourseContentSidebarProps) {
  const locale = useLocale();
  const t = useTranslations("studentDashboard.courseDetails");

  const [exams, setExams] = React.useState<Exam[]>([]);

  React.useEffect(() => {
    setExams(getStoredExams(locale));
    const handleExamsUpdate = () => setExams(getStoredExams(locale));
    window.addEventListener("rewaa_exams_updated", handleExamsUpdate);
    return () => window.removeEventListener("rewaa_exams_updated", handleExamsUpdate);
  }, [locale]);

  const totalSections = course.sections.length;
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  // Helper to resolve exam name
  const getExamTitle = (examId?: string, fallbackTitle?: string) => {
    if (!examId) return fallbackTitle || t("lesson.linkedExam");
    const found = exams.find((e) => e.id === examId);
    return found?.title || fallbackTitle || t("lesson.linkedExam");
  };

  // Auto-expand section containing the selected lesson
  const defaultSectionValue = React.useMemo(() => {
    if (!selectedLessonId) return "section-0";
    const foundIndex = course.sections.findIndex((sec) =>
      sec.lessons.some((l) => l.id === selectedLessonId),
    );
    return foundIndex !== -1 ? `section-${foundIndex}` : "section-0";
  }, [course.sections, selectedLessonId]);

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "flex flex-col h-full bg-card border border-border/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs",
          className,
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 bg-muted/20 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              {t("courseContent")}
            </h2>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary font-bold text-xs border border-primary/20"
            >
              {t("totalProgress", { progress: progressPercentage })}
            </Badge>
          </div>

          {/* Count indicators: sections & lessons */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span>{t("sectionsCount", { count: totalSections })}</span>
            <span>•</span>
            <span>{t("lessonsCount", { count: totalLessons })}</span>
          </div>

          {/* Progress Bar */}
          <Progress value={progressPercentage} className="h-2 bg-primary/15" />
        </div>

        {/* Sections & Items Collapsible List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {course.sections.length === 0 ? (
            <div className="py-8 px-4 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
              {t("empty.noSections")}
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={[defaultSectionValue]}
              className="w-full space-y-2.5"
            >
              {course.sections.map((section: CourseSection, sIdx: number) => {
                const sectionLessonsCount = section.lessons.length;
                const sectionCompletedCount = section.lessons.filter((l) =>
                  completedLessons.includes(l.id),
                ).length;
                const isSectionCompleted =
                  sectionLessonsCount > 0 && sectionCompletedCount === sectionLessonsCount;

                // Check lock status for this section based on prior sections' required exams
                let isSectionLocked = false;
                let requiredExamIdForUnlock: string | undefined;

                for (let prevIdx = 0; prevIdx < sIdx; prevIdx++) {
                  const prevSec = course.sections[prevIdx];
                  if (
                    prevSec &&
                    prevSec.isLinkedToExam &&
                    prevSec.isRequiredPassExamForNextSection &&
                    prevSec.linkedExamId
                  ) {
                    if (!passedExamIds.includes(prevSec.linkedExamId)) {
                      isSectionLocked = true;
                      requiredExamIdForUnlock = prevSec.linkedExamId;
                      break;
                    }
                  }
                }

                // Check if current section has an exam and if it is passed
                const hasExam = section.isLinkedToExam && !!section.linkedExamId;
                const isCurrentExamPassed =
                  hasExam && passedExamIds.includes(section.linkedExamId!);

                return (
                  <AccordionItem
                    key={section.id || `section-${sIdx}`}
                    value={`section-${sIdx}`}
                    className={cn(
                      "border rounded-xl px-3 py-1 bg-background data-[state=open]:bg-muted/30 transition-colors",
                      isSectionLocked
                        ? "border-amber-500/30 bg-amber-500/5 data-[state=open]:bg-amber-500/10 opacity-90"
                        : "border-border/70",
                    )}
                  >
                    <AccordionTrigger className="hover:no-underline py-2.5 min-w-0 [&>svg]:shrink-0">
                      <div className="flex flex-col items-start text-start gap-1 pe-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 w-full min-w-0">
                          {isSectionLocked ? (
                            <div className="size-4 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                              <Lock className="size-2.5 text-amber-600" />
                            </div>
                          ) : isSectionCompleted ? (
                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                          ) : (
                            <span className="size-4 rounded-full border border-muted-foreground/40 shrink-0 text-[10px] flex items-center justify-center font-bold text-muted-foreground">
                              {sIdx + 1}
                            </span>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <h3 className="text-xs sm:text-sm font-bold text-foreground truncate min-w-0 flex-1">
                                {section.title}
                              </h3>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-xs">
                              {section.title}
                            </TooltipContent>
                          </Tooltip>

                          {isSectionLocked && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-amber-500/15 text-amber-700 border-amber-500/30 font-bold shrink-0 gap-1 px-1.5 py-0"
                            >
                              <Lock className="size-2.5" />
                              <span>{t("locked.badge")}</span>
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ps-6 text-[11px] text-muted-foreground">
                          <span>
                            {sectionCompletedCount}/{sectionLessonsCount}{" "}
                            {t("lessonsCount", { count: sectionLessonsCount })}
                          </span>
                          {section.isRequiredPassExamForNextSection && (
                            <span className="text-[10px] text-amber-600 font-semibold">
                              • {t("locked.mustPassExam")}
                            </span>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-2 pb-3 space-y-2 border-t border-border/50 mt-1">
                      {/* If locked, display lock explanation warning box */}
                      {isSectionLocked && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 flex items-center gap-2 mb-2">
                          <Lock className="size-4 shrink-0 text-amber-600" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[11px] leading-tight">
                              {t("locked.tooltip")}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* List of Lessons inside section */}
                      {section.lessons.map((lesson: Lesson) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const isSelected = selectedLessonId === lesson.id;
                        const hasVideo = lesson.type !== "text" && !!lesson.lectureVideoLink;
                        const hasPdf =
                          lesson.hasPdfAttachments ||
                          (lesson.pdfFiles && lesson.pdfFiles.length > 0);

                        return (
                          <div
                            key={lesson.id}
                            className={cn(
                              "group/item relative flex items-center justify-between gap-2 p-2.5 rounded-lg border text-xs transition-all",
                              isSectionLocked
                                ? "bg-muted/40 border-border/40 text-muted-foreground cursor-not-allowed opacity-75"
                                : isSelected
                                  ? "bg-primary/10 border-primary/40 text-primary shadow-xs font-semibold cursor-pointer"
                                  : "bg-background hover:bg-muted/60 border-border/60 text-foreground cursor-pointer",
                            )}
                            onClick={() => {
                              if (isSectionLocked) {
                                onAttemptLockedLesson?.(section, requiredExamIdForUnlock);
                              } else {
                                onSelectLesson(lesson.id);
                              }
                            }}
                          >
                            {/* Completion Checkbox */}
                            <div
                              className="flex items-center gap-2.5 min-w-0 flex-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Checkbox
                                checked={isCompleted}
                                disabled={isSectionLocked}
                                onCheckedChange={() => {
                                  if (!isSectionLocked) {
                                    onToggleLessonCompletion(lesson.id);
                                  }
                                }}
                                aria-label={t("lesson.markAsCompleted")}
                                className="size-4 shrink-0 rounded-lg data-checked:bg-emerald-600 data-checked:border-emerald-600"
                              />

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    disabled={isSectionLocked}
                                    onClick={() => {
                                      if (isSectionLocked) {
                                        onAttemptLockedLesson?.(section, requiredExamIdForUnlock);
                                      } else {
                                        onSelectLesson(lesson.id);
                                      }
                                    }}
                                    className={cn(
                                      "flex items-center gap-2 text-start min-w-0 flex-1",
                                      isSectionLocked ? "cursor-not-allowed" : "hover:underline",
                                    )}
                                  >
                                    {isSectionLocked ? (
                                      <Lock className="size-3.5 shrink-0 text-muted-foreground/60" />
                                    ) : hasVideo ? (
                                      <Video className="size-3.5 shrink-0 text-primary" />
                                    ) : (
                                      <FileText className="size-3.5 shrink-0 text-blue-500" />
                                    )}
                                    <span
                                      className={cn(
                                        "truncate",
                                        isCompleted &&
                                          !isSelected &&
                                          "line-through text-muted-foreground opacity-80",
                                      )}
                                    >
                                      {lesson.title}
                                    </span>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs text-xs">
                                  {isSectionLocked ? t("locked.tooltip") : lesson.title}
                                </TooltipContent>
                              </Tooltip>
                            </div>

                            {/* Extra Badges / Indicators */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {hasPdf && (
                                <span className="p-1 rounded bg-blue-500/10 text-blue-600 text-[10px] font-bold">
                                  PDF
                                </span>
                              )}
                              {isSectionLocked ? (
                                <Lock className="size-3 text-muted-foreground/60" />
                              ) : (
                                <ChevronRight
                                  className={cn(
                                    "size-3.5 text-muted-foreground transition-transform rtl:rotate-180",
                                    isSelected &&
                                      "text-primary translate-x-0.5 rtl:-translate-x-0.5",
                                  )}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Attached files directly under section if any */}
                      {!isSectionLocked &&
                        section.lessons.flatMap((l) => l.pdfFiles || []).length > 0 && (
                          <div className="pt-1.5 space-y-1.5">
                            {section.lessons
                              .flatMap((l) => l.pdfFiles || [])
                              .slice(0, 2)
                              .map((file, fIdx) => (
                                <Tooltip key={file.id || `file-${fIdx}`}>
                                  <TooltipTrigger asChild>
                                    <a
                                      href={file.fileUrl || "#"}
                                      download
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted border border-border/50 text-[11px] text-muted-foreground hover:text-foreground transition-colors min-w-0"
                                    >
                                      <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                                        <Paperclip className="size-3 text-primary shrink-0" />
                                        <span className="truncate">{file.title}</span>
                                      </div>
                                      <Download className="size-3 text-muted-foreground shrink-0 ms-1" />
                                    </a>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs text-xs">
                                    {file.title}
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                          </div>
                        )}

                      {/* Linked Exam in Section - shows exam title & required badge */}
                      {section.isLinkedToExam && section.linkedExamId && (
                        <div className="pt-1">
                          {(() => {
                            const examTitle = getExamTitle(
                              section.linkedExamId,
                              section.linkedExamTitle,
                            );
                            return (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={`/student-dashboard/exams/${section.linkedExamId}`}
                                    className={cn(
                                      "flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold transition-colors min-w-0",
                                      isCurrentExamPassed
                                        ? "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-800"
                                        : "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-800",
                                    )}
                                  >
                                    <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                                      <FileSpreadsheet
                                        className={cn(
                                          "size-4 shrink-0",
                                          isCurrentExamPassed
                                            ? "text-emerald-600"
                                            : "text-amber-600",
                                        )}
                                      />
                                      <span className="truncate">{examTitle}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 ms-1">
                                      {isCurrentExamPassed ? (
                                        <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 h-4">
                                          {t("locked.examPassed")}
                                        </Badge>
                                      ) : section.isRequiredPassExamForNextSection ? (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] bg-amber-500/15 border-amber-500/30 text-amber-700 px-1.5 py-0 h-4"
                                        >
                                          {t("locked.examRequired")}
                                        </Badge>
                                      ) : (
                                        <FileCheck className="size-3.5 shrink-0 opacity-80" />
                                      )}
                                    </div>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs text-xs">
                                  {examTitle}
                                </TooltipContent>
                              </Tooltip>
                            );
                          })()}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        {/* Bottom Certificate Button */}
        <div className="p-4 border-t border-border/80 bg-muted/30">
          <Button
            type="button"
            onClick={onOpenCertificate}
            variant="outline"
            className="w-full justify-center gap-2 text-xs sm:text-sm font-bold border-primary/30 hover:border-primary hover:bg-primary/5 text-primary py-5 rounded-xl shadow-xs"
          >
            <Award className="size-4 text-primary" />
            <span>{t("showCertificate")}</span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
