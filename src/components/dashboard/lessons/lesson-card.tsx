"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

        {/* Lesson Type Icon & Badge on top-start */}
        <div className="absolute top-2.5 inset-s-2.5 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white shadow-xs">
            {lesson.type === "text" ? (
              <>
                <FileText className="h-3 w-3" />
                {t("card.textOnly")}
              </>
            ) : (
              <>
                <Video className="h-3 w-3" />
                {t("card.videoText")}
              </>
            )}
          </span>
        </div>

        {/* Publish Status Badge on top-end */}
        <div className="absolute top-2.5 inset-e-2.5">
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
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Course Tag */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 gap-2">
            <span className="font-semibold text-primary truncate max-w-52">
              {lesson.lessonCategory === "course-dependent" && lesson.courseTitle
                ? t("card.courseDependent", { courseTitle: lesson.courseTitle })
                : t("card.independent")}
            </span>
            <span className="text-[11px] font-medium flex items-center gap-1 shrink-0">
              {lesson.venue === "online" ? (
                <Globe className="h-3 w-3" />
              ) : lesson.venue === "center" ? (
                <House className="h-3 w-3" />
              ) : (
                <Globe2 className="h-3 w-3" />
              )}
              {formatVenue(lesson.venue)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {lesson.title}
          </h3>

          {/* Teacher and Subject Info */}
          <div className="mt-2 text-xs text-muted-foreground space-y-1">
            {lesson.teacherName && (
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                <span className="truncate">{lesson.teacherName}</span>
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

        {/* Additional Metadata Badges: PDFs & Exam */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          {pdfCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20 font-medium">
              <Paperclip className="h-3 w-3" />
              {t("card.pdfsCount", { count: pdfCount })}
            </span>
          )}

          {lesson.isLinkedToExam && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 font-medium">
              <FileQuestion className="h-3 w-3" />
              {t("card.examLinked")}
            </span>
          )}
        </div>

        {/* Card Footer: View Details CTA & Actions Dropdown */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold flex-1"
          >
            <Link href={`/${locale}/dashboard/lessons/${lesson.id}`}>
              <span>{t("card.viewDetails")}</span>
            </Link>
          </Button>

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
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/dashboard/lessons/${lesson.id}/edit`}>
                  <Pencil className="h-3.5 w-3.5 me-2" />
                  <span>{t("card.editLesson")}</span>
                </Link>
              </DropdownMenuItem>

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

              <DropdownMenuItem onClick={() => onPublishToggle(lesson.id)}>
                <BookOpen className="h-3.5 w-3.5 me-2" />
                <span>
                  {lesson.publishStatus === "published" ? t("card.unpublish") : t("card.publish")}
                </span>
              </DropdownMenuItem>

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
