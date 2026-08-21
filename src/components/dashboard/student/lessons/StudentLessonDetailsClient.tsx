/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { DashboardCard } from "@/components/dashboard/overview/dashboard-card";
import { Button } from "@/components/ui/button";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";
import { Link } from "@/i18n/routing";
import { getStoredLessons } from "@/lib/lessons-storage";
import { Lesson } from "@/types/course";
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  FileQuestion,
  FileText,
  Paperclip,
  Video,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

interface StudentLessonDetailsClientProps {
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

export function StudentLessonDetailsClient({ lessonId }: StudentLessonDetailsClientProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("studentDashboard.lessonDetailsPage");
  const tLessons = useTranslations("studentDashboard.lessonsPage");
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

  const [lesson, setLesson] = React.useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const lessons = getStoredLessons(locale);
    // Find lesson that is independent and published
    const found = lessons.find((l) => {
      if (l.id !== lessonId) return false;
      const isIndependent = !l.courseId && l.lessonCategory !== "course-dependent";
      const isPublished = l.publishStatus === "published" || (!l.publishStatus && !!l.title);
      return isIndependent && isPublished;
    });

    setLesson(found || null);
    setIsLoading(false);
  }, [lessonId, locale]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-muted-foreground animate-pulse">Loading lesson...</div>
    );
  }

  if (!lesson) {
    return (
      <div className="py-16 text-center space-y-4 bg-card rounded-2xl border border-dashed border-border/70 p-8 max-w-xl mx-auto my-8">
        <BookOpen className="size-12 mx-auto text-muted-foreground/40 mb-2" />
        <h2 className="text-xl font-bold text-foreground">{t("lessonNotFoundTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("lessonNotFoundDesc")}</p>
        <div className="pt-2">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/student-dashboard/lessons">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              <span>{t("backToLessons")}</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const pdfCount = (lesson.pdfFiles || []).length || (lesson.hasPdfAttachments ? 1 : 0);

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Top Header Row with Standard Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0">
            <Link href="/student-dashboard/lessons">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                {lesson.type === "text" ? (
                  <>
                    <FileText className="h-3 w-3" />
                    {tLessons("card.textOnly")}
                  </>
                ) : (
                  <>
                    <Video className="h-3 w-3" />
                    {tLessons("card.videoText")}
                  </>
                )}
              </span>

              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                {tLessons("card.independent")}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {lesson.title}
            </h1>
          </div>
        </div>
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
                <DashboardCard className="p-4 space-y-3 rounded-2xl">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Video className="size-4 text-primary" />
                    {t("videoLecture")}
                  </h2>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/90 flex items-center justify-center border">
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
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                        >
                          <ExternalLink className="size-3.5" />
                          <span>{t("openExternal")}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </DashboardCard>
              );
            })()}

          {/* Markdown Content Viewer */}
          <DashboardCard className="p-6 space-y-4 rounded-2xl">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b pb-3">
              <FileText className="size-4 text-primary" />
              {t("writtenNotes")}
            </h2>
            {lesson.description || lesson.writtenText ? (
              <MarkdownViewer
                content={lesson.description || lesson.writtenText || ""}
                isRtl={isRtl}
              />
            ) : (
              <p className="text-sm text-muted-foreground italic py-4 text-center border border-dashed rounded-xl">
                No written summary provided for this lesson.
              </p>
            )}
          </DashboardCard>

          {/* Attached PDF Files */}
          {pdfCount > 0 && (
            <DashboardCard className="p-6 space-y-4 rounded-2xl">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Paperclip className="size-4 text-primary" />
                {t("attachments")} ({pdfCount})
              </h2>
              <div className="space-y-2">
                {(lesson.pdfFiles || []).map((pdf) => (
                  <div
                    key={pdf.id}
                    className="flex items-center justify-between p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
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
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs rounded-lg"
                    >
                      <a href={pdf.fileUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="size-3.5" />
                        <span>{t("downloadPdf")}</span>
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {/* Linked Exam Card */}
          {lesson.isLinkedToExam && lesson.linkedExamId && (
            <DashboardCard className="p-6 space-y-3 bg-amber-500/5 border-amber-500/20 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                  <FileQuestion className="size-5 shrink-0" />
                  <span>{lesson.linkedExamTitle || t("linkedExam")}</span>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl self-start sm:self-auto"
                >
                  <Link href={`/student-dashboard/exams/${lesson.linkedExamId}`}>
                    <span>{t("takeExam")}</span>
                  </Link>
                </Button>
              </div>
            </DashboardCard>
          )}
        </div>

        {/* Right / Sidebar Information Card (1 Column) */}
        <div className="space-y-6">
          <DashboardCard className="p-6 space-y-4 rounded-2xl">
            <h2 className="text-base font-bold text-foreground border-b border-border/60 pb-3">
              {t("metadata")}
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{t("category")}</span>
                <span className="font-semibold text-foreground">
                  {tLessons("card.independent")}
                </span>
              </div>

              {lesson.teacherName && (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">{t("teacher")}</span>
                  <span className="font-semibold text-foreground">{lesson.teacherName}</span>
                </div>
              )}

              {(lesson.subject || lesson.grade) && (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">{t("subjectAndGrade")}</span>
                  <span className="font-semibold text-foreground">
                    {[formatSubject(lesson.subject), formatGrade(lesson.grade)]
                      .filter(Boolean)
                      .join(" • ")}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{t("venue")}</span>
                <span className="font-semibold text-foreground">{formatVenue(lesson.venue)}</span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
