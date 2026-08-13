"use client";

import { BookOpen, Eye, FileText, Video } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "../overview/dashboard-card";
import { Course } from "@/types/course";

interface CourseSectionsProps {
  course: Course;
}

export function CourseSections({ course }: CourseSectionsProps) {
  const locale = useLocale();
  const t = useTranslations("courses");

  const totalSections = course.sections.length;
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalExams = course.sections.reduce((acc, s) => acc + (s.isLinkedToExam ? 1 : 0), 0);

  return (
    <DashboardCard className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{t("details.sectionsAndContent")}</h2>
        <div className="text-xs text-muted-foreground font-medium">
          {t("details.totalSections", { count: totalSections })} •{" "}
          {t("details.totalLessons", { count: totalLessons })} •{" "}
          {t("details.totalExams", { count: totalExams })}
        </div>
      </div>

      {course.sections.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
          {t("details.noSections")}
        </div>
      ) : (
        <Accordion type="single" collapsible defaultValue="section-0" className="w-full space-y-3">
          {course.sections.map((section, idx) => (
            <AccordionItem
              key={section.id}
              value={`section-${idx}`}
              className="border border-border/60 rounded-xl px-4 py-1 bg-muted/20 data-[state=open]:bg-muted/40 transition-colors"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-start gap-2 pe-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{section.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("details.totalLessons", { count: section.lessons.length })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {section.isLinkedToExam && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-primary/5 text-primary border-primary/20"
                      >
                        {t("details.linkedExamBadge")}
                      </Badge>
                    )}
                    {section.isRequiredPassExamForNextSection && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20"
                      >
                        {t("details.requiredPassBadge")}
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4 space-y-3 border-t border-border/40 mt-2">
                {/* Lessons List */}
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-background border border-border/40 gap-2"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      {lesson.type === "text" ? (
                        <FileText className="size-4 text-emerald-500 shrink-0" />
                      ) : (
                        <BookOpen className="size-4 text-primary shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-foreground">{lesson.title}</span>

                      {lesson.type === "text" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        >
                          {t("new.step2.addLessonDialog.typeOptions.text")}
                        </Badge>
                      )}

                      {(lesson.hasPdfAttachments ||
                        (lesson.pdfFiles && lesson.pdfFiles.length > 0)) && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20"
                        >
                          PDF ({lesson.pdfFiles?.length || 1})
                        </Badge>
                      )}

                      {lesson.isLinkedToExam && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20"
                        >
                          {t("details.linkedExamBadge")}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ms-auto sm:ms-0">
                      {lesson.lectureVideoLink && lesson.type !== "text" && (
                        <a
                          href={lesson.lectureVideoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                        >
                          <Video className="size-3.5" />
                          <span>{t("details.watchVideo")}</span>
                        </a>
                      )}

                      <Link
                        href={`/${locale}/dashboard/lessons/${lesson.id}`}
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold"
                      >
                        <Eye className="size-3.5" />
                        <span>{t("card.viewDetails")}</span>
                      </Link>
                    </div>
                  </div>
                ))}

                {/* Section Exam FK reference */}
                {section.isLinkedToExam && section.linkedExamId && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <FileText className="size-4" />
                      <Link
                        href={`/${locale}/dashboard/exams/${section.linkedExamId}`}
                        className="hover:underline underline-offset-2"
                      >
                        {t("details.linkedExamBadge")} #{section.linkedExamId}
                      </Link>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </DashboardCard>
  );
}
