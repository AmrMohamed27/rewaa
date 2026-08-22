"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lesson } from "@/types/course";
import {
  BookOpen,
  Check,
  Copy,
  FileQuestion,
  FileText,
  Globe,
  Globe2,
  House,
  MoreVertical,
  Paperclip,
  Pencil,
  Trash2,
  Video,
  Clock,
  GraduationCap,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getStoredTeachers } from "@/lib/settings-storage";
import Image from "next/image";
import Link from "next/link";

interface LessonCardProps {
  lesson: Lesson;
  copiedId: string | null;
  onPublishToggle: (lessonId: string) => void;
  onCopyLink: (lessonId: string) => void;
  onDeleteRequest: (lesson: Lesson) => void;
}

export function LessonCard({
  lesson,
  copiedId,
  onPublishToggle,
  onCopyLink,
  onDeleteRequest,
}: LessonCardProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("lessons");
  const tCourses = useTranslations("courses");
  const tGrades = useTranslations("courses.new.grades");
  const tSubjects = useTranslations("courses.new.subjects");

  const formatVenue = (v?: string) => {
    if (v === "online") return tCourses("venue.online");
    if (v === "center") return tCourses("venue.center");
    return tCourses("venue.all");
  };

  const formatGrade = (g?: string) => {
    if (!g) return "";
    return tGrades.has(g as Parameters<typeof tGrades.has>[0])
      ? tGrades(g as Parameters<typeof tGrades>[0])
      : g;
  };

  const formatSubject = (s?: string) => {
    if (!s) return "";
    return tSubjects.has(s as Parameters<typeof tSubjects.has>[0])
      ? tSubjects(s as Parameters<typeof tSubjects>[0])
      : s;
  };

  const fallbackCover = lesson.coverImage || "/courses/physics.jpg";
  const pdfCount = (lesson.pdfFiles || []).length || (lesson.hasPdfAttachments ? 1 : 0);

  // Look up teacher image
  const teachers = typeof window !== "undefined" ? getStoredTeachers() : [];
  const teacherImage =
    lesson.teacherImage ||
    teachers.find(
      (t) =>
        t.name.trim().toLowerCase() === (lesson.teacherName || "").trim().toLowerCase() ||
        t.id === lesson.teacherName,
    )?.image ||
    "";

  const subjectAndGradeText = [formatSubject(lesson.subject), formatGrade(lesson.grade)]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="group flex flex-col bg-card rounded-xl border border-border/60 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {/* Cover Image Container with Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={fallbackCover}
          alt={lesson.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />

        {/* Publish Status Badge on top-start */}
        <div className="absolute top-2.5 inset-s-2.5">
          {lesson.publishStatus === "published" || (!lesson.publishStatus && lesson.title) ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-bg text-success shadow-xs">
              {t("card.published")}
            </span>
          ) : lesson.publishStatus === "scheduled" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30 backdrop-blur-xs">
              <Clock className="h-3 w-3" />
              {t("card.scheduled")}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning-bg text-warning backdrop-blur-xs">
              {t("card.draft")}
            </span>
          )}
        </div>

        {/* Lesson Type Icon Badge on top-end (icon only) */}
        <div className="absolute top-2.5 inset-e-2.5 flex items-center gap-1.5">
          <span
            className="inline-flex items-center justify-center p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs shadow-xs"
            title={lesson.type === "text" ? t("card.textOnly") : t("card.videoText")}
          >
            {lesson.type === "text" ? (
              <FileText className="h-3.5 w-3.5" />
            ) : (
              <Video className="h-3.5 w-3.5" />
            )}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Course Tag with Quick Metadata Icons */}
          <div className="flex items-start justify-between text-xs text-muted-foreground mb-1.5 gap-2">
            <span className="font-semibold text-primary wrap-break-word leading-tight">
              {lesson.lessonCategory === "course-dependent" && lesson.courseTitle
                ? t("card.courseDependent", { courseTitle: lesson.courseTitle })
                : t("card.independent")}
            </span>

            {/* Quick Metadata Icons: Venue, PDFs, Exam */}
            <TooltipProvider>
              <div className="flex items-center gap-2 shrink-0 pt-0.5 text-muted-foreground">
                {/* Venue */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-default transition-colors hover:text-foreground">
                      {lesson.venue === "online" ? (
                        <Globe className="h-3.5 w-3.5 text-primary" />
                      ) : lesson.venue === "center" ? (
                        <House className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Globe2 className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">{formatVenue(lesson.venue)}</TooltipContent>
                </Tooltip>

                {/* PDF Attachments */}
                {pdfCount > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-default text-primary hover:text-primary/80 transition-colors">
                        <Paperclip className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-[11px] font-semibold">{pdfCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {t("card.pdfsCount", { count: pdfCount })}
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Linked Exam */}
                {lesson.isLinkedToExam && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-default text-amber-500 hover:text-amber-600 transition-colors">
                        <FileQuestion className="h-3.5 w-3.5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {lesson.linkedExamTitle
                        ? `${t("card.examLinked")}: ${lesson.linkedExamTitle}`
                        : t("card.examLinked")}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {lesson.title}
          </h3>

          {/* Teacher and Subject Info */}
          <div className="mt-2 text-xs text-muted-foreground space-y-1.5">
            {lesson.teacherName && (
              <div className="flex items-center gap-2">
                <div className="relative size-5 rounded-full overflow-hidden bg-primary/10 border border-border/60 shrink-0 flex items-center justify-center">
                  {teacherImage ? (
                    <Image
                      src={teacherImage}
                      alt={lesson.teacherName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="size-3 text-primary/70" />
                  )}
                </div>
                <span className="truncate font-medium text-foreground/80">
                  {lesson.teacherName}
                </span>
              </div>
            )}
            {subjectAndGradeText && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                <span className="truncate">{subjectAndGradeText}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: CTA & Actions Dropdown */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          {lesson.publishStatus === "draft" ? (
            <Button
              onClick={() => onPublishToggle(lesson.id)}
              variant="default"
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold flex-1 cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{t("card.publishNow")}</span>
            </Button>
          ) : (
            <Button
              asChild
              variant="default"
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold flex-1"
            >
              <Link href={`/${locale}/dashboard/lessons/${lesson.id}/edit`}>
                <Pencil className="h-3.5 w-3.5" />
                <span>{t("card.editLesson")}</span>
              </Link>
            </Button>
          )}

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isAr ? "start" : "end"} className="w-44">
              {lesson.publishStatus === "draft" && (
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard/lessons/${lesson.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 me-2" />
                    <span>{t("card.editLesson")}</span>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => onCopyLink(lesson.id)}>
                {copiedId === lesson.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 me-2 text-success" />
                    <span className="text-success">{t("card.copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 me-2" />
                    <span>{t("card.copyLink")}</span>
                  </>
                )}
              </DropdownMenuItem>

              {lesson.publishStatus !== "draft" && (
                <DropdownMenuItem onClick={() => onPublishToggle(lesson.id)}>
                  <BookOpen className="h-3.5 w-3.5 me-2" />
                  <span>
                    {lesson.publishStatus === "published" ? t("card.unpublish") : t("card.publish")}
                  </span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => onDeleteRequest(lesson)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 me-2" />
                <span>{t("card.deleteLesson")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
