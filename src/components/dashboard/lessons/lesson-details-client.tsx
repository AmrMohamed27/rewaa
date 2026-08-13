/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Lesson } from "@/types/course";
import { getStoredLessons } from "@/lib/lessons-storage";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "../overview/dashboard-card";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";
import {
  ArrowLeft,
  FileQuestion,
  FileText,
  Globe,
  Globe2,
  GraduationCap,
  House,
  Link2,
  Paperclip,
  Pencil,
  User,
  Video,
  Download,
  Clock,
  Sparkles,
} from "lucide-react";

interface LessonDetailsClientProps {
  lessonId: string;
}

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.includes("youtube.com/embed/")) return trimmed;
  if (trimmed.includes("youtube.com/watch")) {
    const videoId = trimmed.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : trimmed.replace("watch?v=", "embed/");
  }
  if (trimmed.includes("youtu.be/")) {
    const videoId = trimmed.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
  }
  if (trimmed.includes("vimeo.com/")) {
    const videoId = trimmed.split("vimeo.com/")[1]?.split("?")[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : trimmed;
  }
  return null;
}

export function LessonDetailsClient({ lessonId }: LessonDetailsClientProps) {
  const locale = useLocale();
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

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lessons = getStoredLessons(locale);
    const found = lessons.find((l) => l.id === lessonId);
    if (found) {
      setLesson(found);
    }
    setIsLoading(false);
  }, [lessonId, locale]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading lesson details...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">{t("empty.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("empty.description")}</p>
        <Button asChild variant="outline">
          <Link href={`/${locale}/dashboard/lessons`}>
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {t("details.backToLessons")}
          </Link>
        </Button>
      </div>
    );
  }

  const pdfCount = (lesson.pdfFiles || []).length || (lesson.hasPdfAttachments ? 1 : 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
            <Link href={`/${locale}/dashboard/lessons`}>
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
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

              {lesson.publishStatus === "published" || (!lesson.publishStatus && lesson.title) ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-bg text-success">
                  {t("card.published")}
                </span>
              ) : lesson.publishStatus === "scheduled" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Clock className="h-3 w-3" />
                  {t("card.scheduled")}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning-bg text-warning">
                  {t("card.draft")}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {lesson.title}
            </h1>
          </div>
        </div>

        <Button
          asChild
          size="default"
          className="gap-2 shadow-sm font-semibold self-start sm:self-auto"
        >
          <Link href={`/${locale}/dashboard/lessons/${lesson.id}/edit`}>
            <Pencil className="h-4 w-4" />
            <span>{t("details.editLesson")}</span>
          </Link>
        </Button>
      </div>

      {/* Main Grid: Details Content + Sidebar Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Content (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player if videoAndText */}
          {lesson.type !== "text" &&
            lesson.lectureVideoLink &&
            (() => {
              const embedUrl = getEmbedUrl(lesson.lectureVideoLink);
              return (
                <DashboardCard className="p-4 space-y-3">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Video className="size-4 text-primary" />
                    {t("details.videoLecture")}
                  </h2>
                  <div className="relative aspect-video w-full rounded-md overflow-hidden bg-black/90 flex items-center justify-center border">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={lesson.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="text-center p-6 space-y-3 text-white">
                        <Video className="size-12 mx-auto text-primary animate-pulse" />
                        <p className="text-sm font-medium">{lesson.title}</p>
                        <a
                          href={lesson.lectureVideoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                        >
                          Open External Video
                        </a>
                      </div>
                    )}
                  </div>
                </DashboardCard>
              );
            })()}

          {/* Markdown Content Viewer */}
          <DashboardCard className="p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b pb-3">
              <FileText className="size-4 text-primary" />
              {t("details.writtenNotes")}
            </h2>
            {lesson.description || lesson.writtenText ? (
              <MarkdownViewer content={lesson.description || lesson.writtenText || ""} />
            ) : (
              <p className="text-sm text-muted-foreground italic py-4 text-center border border-dashed rounded-lg">
                No written summary provided for this lesson.
              </p>
            )}
          </DashboardCard>

          {/* Attached PDF Files */}
          {pdfCount > 0 && (
            <DashboardCard className="p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Paperclip className="size-4 text-primary" />
                {t("details.attachments")} ({pdfCount})
              </h2>
              <div className="space-y-2">
                {(lesson.pdfFiles || []).map((pdf) => (
                  <div
                    key={pdf.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-foreground block">{pdf.title}</span>
                        {pdf.sizeInBytes && (
                          <span className="text-xs text-muted-foreground">
                            {(pdf.sizeInBytes / 1024 / 1024).toFixed(2)} MB
                          </span>
                        )}
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
                      <a href={pdf.fileUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="size-3.5" />
                        <span>{t("details.downloadPdf")}</span>
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {/* Linked Exam Card */}
          {lesson.isLinkedToExam && (
            <DashboardCard className="p-6 space-y-3 bg-amber-500/5 border-amber-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-base">
                  <FileQuestion className="size-5" />
                  <span>{lesson.linkedExamTitle || t("details.linkedExam")}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  {t("details.takeExam")}
                </Button>
              </div>
              {lesson.isRequiredPassExam && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  * Students are required to pass this exam to unlock subsequent curriculum lessons.
                </p>
              )}
            </DashboardCard>
          )}
        </div>

        {/* Right / Sidebar Information Card (1 Column) */}
        <div className="space-y-6">
          <DashboardCard className="p-6 space-y-5">
            <h3 className="text-base font-bold text-foreground border-b pb-3 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              {t("metadata")}
            </h3>

            {/* Category */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground block">
                {t("details.category")}
              </span>
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Link2 className="size-4 text-primary" />
                {lesson.lessonCategory === "course-dependent" && lesson.courseTitle
                  ? t("card.courseDependent", { courseTitle: lesson.courseTitle })
                  : t("card.independent")}
              </span>
            </div>

            {/* Course Link if courseDependent */}
            {lesson.courseId && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-xs font-medium text-primary block">
                  {t("details.linkedCourse")}
                </span>
                <Link
                  href={`/${locale}/dashboard/courses/${lesson.courseId}`}
                  className="text-sm font-bold text-primary hover:underline block truncate"
                >
                  {lesson.courseTitle || t("details.viewCourse")}
                </Link>
              </div>
            )}

            {/* Instructor */}
            {lesson.teacherName && (
              <div className="space-y-1 pt-2 border-t border-border/40">
                <span className="text-xs font-medium text-muted-foreground block">
                  {t("details.teacherInfo")}
                </span>
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <User className="size-4 text-muted-foreground" />
                  {lesson.teacherName}
                </span>
              </div>
            )}

            {/* Subject & Grade */}
            {(lesson.subject || lesson.grade) && (
              <div className="space-y-1 pt-2 border-t border-border/40">
                <span className="text-xs font-medium text-muted-foreground block">
                  {t("details.subjectAndGrade")}
                </span>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <GraduationCap className="size-4 text-muted-foreground" />
                  {[formatSubject(lesson.subject), formatGrade(lesson.grade)]
                    .filter(Boolean)
                    .join(" • ")}
                </span>
              </div>
            )}

            {/* Venue */}
            <div className="space-y-1 pt-2 border-t border-border/40">
              <span className="text-xs font-medium text-muted-foreground block">
                {t("details.venue")}
              </span>
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                {lesson.venue === "online" ? (
                  <Globe className="size-4 text-primary" />
                ) : lesson.venue === "center" ? (
                  <House className="size-4 text-primary" />
                ) : (
                  <Globe2 className="size-4 text-primary" />
                )}
                {formatVenue(lesson.venue)}
              </span>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
